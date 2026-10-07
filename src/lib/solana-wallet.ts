import type { PublicKey, Transaction } from "@solana/web3.js";

export type WalletKind = "phantom" | "solflare";
export interface SolanaWallet {
  publicKey: PublicKey | null;
  connect(): Promise<{ publicKey: PublicKey }>;
  disconnect(): Promise<void>;
  signTransaction(transaction: Transaction): Promise<Transaction>;
  on?(event: string, callback: () => void): void;
  off?(event: string, callback: () => void): void;
}

export function getWallet(kind: WalletKind): SolanaWallet | undefined {
  const browser = window as Window & {
    phantom?: { solana?: SolanaWallet };
    solflare?: SolanaWallet;
  };
  return kind === "phantom" ? browser.phantom?.solana : browser.solflare;
}