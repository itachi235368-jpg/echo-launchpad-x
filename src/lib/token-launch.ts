import type { SolanaWallet } from "./solana-wallet";

export const LAUNCH_NETWORK = "devnet";
export const DEFAULT_SUPPLY = "1000000000";
export const TOKEN_DECIMALS = 6;
export type TokenInput = { name: string; symbol: string; supply: string };
export type LaunchReceipt = { mint: string; signature: string; owner: string; name: string; symbol: string; supply: string; network: "devnet" };

export function validateToken(input: TokenInput): string | null {
  if (!input.name.trim() || input.name.trim().length > 32) return "Enter a token name of 1–32 characters.";
  if (!/^[A-Z0-9]{1,8}$/.test(input.symbol)) return "Use 1–8 uppercase letters or numbers for the symbol.";
  if (!/^[1-9]\d*$/.test(input.supply) || BigInt(input.supply) > 1000000000n) return "Supply must be a whole number from 1 to 1,000,000,000.";
  return null;
}

export function supplyBaseUnits(supply: string): bigint {
  return BigInt(supply) * 10n ** BigInt(TOKEN_DECIMALS);
}

export async function launchToken(wallet: SolanaWallet, input: TokenInput, progress: (message: string) => void): Promise<LaunchReceipt> {
  const error = validateToken(input);
  if (error) throw new Error(error);
  const owner = wallet.publicKey;
  if (!owner) throw new Error("Connect your wallet first.");
  // Solana SDKs are only loaded in this browser event handler, never during SSR.
  const { Buffer } = await import("buffer");
  (globalThis as typeof globalThis & { Buffer?: typeof Buffer }).Buffer ??= Buffer;
  const web3 = await import("@solana/web3.js");
  const spl = await import("@solana/spl-token");
  const metadata = await import("@solana/spl-token-metadata");
  const connection = new web3.Connection(web3.clusterApiUrl(LAUNCH_NETWORK), "confirmed");
  const mint = web3.Keypair.generate();
  const meta = { mint: mint.publicKey, name: input.name.trim(), symbol: input.symbol, uri: "", additionalMetadata: [] as [string, string][] };
  const mintSize = spl.getMintLen([spl.ExtensionType.MetadataPointer]);
  const totalSize = mintSize + spl.TYPE_SIZE + spl.LENGTH_SIZE + metadata.pack(meta).length;
  progress("Checking devnet balance…");
  const rent = await connection.getMinimumBalanceForRentExemption(totalSize);
  const balance = await connection.getBalance(owner);
  if (balance < rent + 100000) throw new Error("Not enough devnet SOL. Fund your wallet using the Solana faucet, then try again.");
  const ata = spl.getAssociatedTokenAddressSync(mint.publicKey, owner, false, spl.TOKEN_2022_PROGRAM_ID);
  const transaction = new web3.Transaction().add(
    web3.SystemProgram.createAccount({ fromPubkey: owner, newAccountPubkey: mint.publicKey, space: mintSize, lamports: rent, programId: spl.TOKEN_2022_PROGRAM_ID }),
    spl.createInitializeMetadataPointerInstruction(mint.publicKey, owner, mint.publicKey, spl.TOKEN_2022_PROGRAM_ID),
    spl.createInitializeMintInstruction(mint.publicKey, TOKEN_DECIMALS, owner, null, spl.TOKEN_2022_PROGRAM_ID),
    metadata.createInitializeInstruction({ programId: spl.TOKEN_2022_PROGRAM_ID, metadata: mint.publicKey, updateAuthority: owner, mint: mint.publicKey, mintAuthority: owner, name: meta.name, symbol: meta.symbol, uri: meta.uri }),
    spl.createAssociatedTokenAccountIdempotentInstruction(owner, ata, owner, mint.publicKey, spl.TOKEN_2022_PROGRAM_ID),
    spl.createMintToInstruction(mint.publicKey, ata, owner, supplyBaseUnits(input.supply), [], spl.TOKEN_2022_PROGRAM_ID),
    spl.createSetAuthorityInstruction(mint.publicKey, owner, spl.AuthorityType.MintTokens, null, [], spl.TOKEN_2022_PROGRAM_ID),
  );
  const block = await connection.getLatestBlockhash();
  transaction.feePayer = owner;
  transaction.recentBlockhash = block.blockhash;
  transaction.partialSign(mint);
  progress("Approve the devnet transaction in your wallet…");
  const signed = await wallet.signTransaction(transaction);
  if (!wallet.publicKey?.equals(owner)) throw new Error("Wallet changed. Reconnect and try again.");
  progress("Submitting token transaction…");
  const signature = await connection.sendRawTransaction(signed.serialize(), { skipPreflight: false, maxRetries: 3 });
  // Save the submitted receipt before confirmation so a timeout cannot hide a sent transaction.
  const receipt: LaunchReceipt = { mint: mint.publicKey.toBase58(), signature, owner: owner.toBase58(), ...input, network: "devnet" };
  localStorage.setItem("vyrai:last-launch", JSON.stringify(receipt));
  progress("Confirming on Solana devnet…");
  const confirmation = await connection.confirmTransaction({ signature, ...block }, "confirmed");
  if (confirmation.value.err) throw new Error(`Transaction failed. Check ${signature} on Solana Explorer.`);
  const onchainMint = await spl.getMint(connection, mint.publicKey, "confirmed", spl.TOKEN_2022_PROGRAM_ID);
  if (onchainMint.supply !== supplyBaseUnits(input.supply) || onchainMint.mintAuthority !== null) throw new Error("Token verification failed. Check the submitted transaction before retrying.");
  return receipt;
}