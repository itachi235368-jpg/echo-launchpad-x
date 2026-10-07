import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { LoaderCircle, LogOut, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getWallet, type SolanaWallet, type WalletKind } from "@/lib/solana-wallet";

type WalletContextValue = { wallet: SolanaWallet | null; address: string | null; openConnect: () => void };
const WalletContext = createContext<WalletContextValue | null>(null);

export function useWallet() {
  const value = useContext(WalletContext);
  if (!value) throw new Error("WalletProvider is required.");
  return value;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<SolanaWallet | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [missing, setMissing] = useState<WalletKind | null>(null);
  useEffect(() => {
    if (!wallet) return;
    const update = () => { setAddress(wallet.publicKey?.toBase58() ?? null); };
    wallet.on?.("accountChanged", update);
    wallet.on?.("disconnect", update);
    return () => { wallet.off?.("accountChanged", update); wallet.off?.("disconnect", update); };
  }, [wallet]);

  async function connect(kind: WalletKind) {
    setError(""); setMissing(null);
    const provider = getWallet(kind);
    if (!provider) { setMissing(kind); return; }
    setBusy(true);
    try {
      const result = await provider.connect();
      setWallet(provider); setAddress(result.publicKey.toBase58()); setOpen(false);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Wallet connection declined."); }
    finally { setBusy(false); }
  }

  async function disconnect() {
    try { await wallet?.disconnect(); setWallet(null); setAddress(null); setOpen(false); }
    catch { setError("Could not disconnect. Please try again."); }
  }

  return <WalletContext.Provider value={{ wallet, address, openConnect: () => { setError(""); setMissing(null); setOpen(true); } }}>
    {children}
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-w-sm"><DialogHeader><DialogTitle>{address ? "Connected wallet" : "Connect"}</DialogTitle><DialogDescription>Solana devnet · Test tokens only</DialogDescription></DialogHeader>
      {address ? <><p className="break-all font-mono text-xs text-muted-foreground">{address}</p><Button variant="outline" onClick={disconnect}><LogOut/> Disconnect wallet</Button></> : <div className="grid gap-3">{(["phantom", "solflare"] as const).map(kind => <Button key={kind} variant="outline" disabled={busy} className="h-12 justify-start capitalize" onClick={() => connect(kind)}>{busy ? <LoaderCircle className="animate-spin"/> : <Wallet/>}{kind}</Button>)}</div>}
      {missing && <p className="text-sm text-muted-foreground">{missing === "phantom" ? "Phantom" : "Solflare"} was not detected. Open VYRAI in your wallet’s browser or <a className="text-primary underline" href={missing === "phantom" ? "https://phantom.com/download" : "https://solflare.com/download"} target="_blank" rel="noreferrer">install the wallet</a>.</p>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="border-t border-border pt-4"><Button asChild variant="ghost" className="w-full" onClick={() => setOpen(false)}><Link to="/auth">Connect creator account</Link></Button></div>
    </DialogContent></Dialog>
  </WalletContext.Provider>;
}

export function ConnectButton({ className }: { className?: string }) {
  const { address, openConnect } = useWallet();
  return <Button variant="outline" onClick={openConnect} className={className}><Wallet/>{address ? `${address.slice(0, 4)}…${address.slice(-4)}` : "Connect"}</Button>;
}