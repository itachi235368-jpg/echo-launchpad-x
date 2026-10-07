import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ExternalLink, LoaderCircle, Rocket } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/site-header";
import { ConnectButton, useWallet } from "@/components/wallet-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_SUPPLY, launchToken, validateToken, type LaunchReceipt } from "@/lib/token-launch";

export const Route = createFileRoute("/launch")({
  validateSearch: (search: Record<string, unknown>) => ({ name: typeof search.name === "string" ? search.name : "", symbol: typeof search.symbol === "string" ? search.symbol : "" }),
  head: () => ({ meta: [
    { title: "Launch a Devnet Token — VYRAI" }, { name: "description", content: "Create a fixed-supply Solana devnet token with your own wallet on VYRAI." },
    { property: "og:title", content: "Launch a Devnet Token — VYRAI" }, { property: "og:description", content: "Create a fixed-supply Solana devnet token with your own wallet on VYRAI." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: LaunchPage,
});

function LaunchPage() {
  const search = Route.useSearch();
  const { wallet, address } = useWallet();
  const [name, setName] = useState(search.name);
  const [symbol, setSymbol] = useState(search.symbol);
  const [supply, setSupply] = useState(DEFAULT_SUPPLY);
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<LaunchReceipt | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("vyrai:last-launch") ?? "null") as LaunchReceipt | null;
      if (stored?.network === "devnet" && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(stored.mint) && /^[1-9A-HJ-NP-Za-km-z]{64,90}$/.test(stored.signature)) setReceipt(stored);
    } catch { /* Corrupt local receipts must not block launch. */ }
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault(); setError("");
    if (!wallet || !address || !accepted || busy) return;
    const validation = validateToken({ name, symbol, supply });
    if (validation) { setError(validation); return; }
    setBusy(true);
    try {
      const result = await launchToken(wallet, { name, symbol, supply }, setStatus);
      setReceipt(result); setConfirmed(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Token launch failed. Please try again.");
      const saved = localStorage.getItem("vyrai:last-launch");
      if (saved) setReceipt(JSON.parse(saved) as LaunchReceipt);
    } finally { setBusy(false); setStatus(""); }
  }

  return <div className="min-h-screen"><SiteHeader/><main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
    <div className="flex flex-wrap items-start justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">Solana devnet</p><h1 className="mt-3 font-display text-4xl font-semibold">Launch your token.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">A fixed-supply Token-2022 mint, signed by your wallet. Test SOL only. No bonding curve, trading market, or automatic fee splits.</p></div><ConnectButton/></div>
    {receipt ? <section className="mt-10 border-t border-border py-8"><CheckCircle2 className="size-8 text-primary"/><h2 className="mt-4 font-display text-2xl font-semibold">{confirmed ? "Token confirmed on devnet" : "Previous transaction submitted"}</h2><p className="mt-2 text-sm text-muted-foreground">{receipt.name} · ${receipt.symbol} · {receipt.supply} tokens</p><p className="mt-6 break-all font-mono text-sm">{receipt.mint}</p><div className="mt-6 flex flex-wrap gap-3"><Button asChild><a href={`https://explorer.solana.com/address/${receipt.mint}?cluster=devnet`} target="_blank" rel="noreferrer">View token <ExternalLink/></a></Button><Button asChild variant="outline"><a href={`https://explorer.solana.com/tx/${receipt.signature}?cluster=devnet`} target="_blank" rel="noreferrer">Check transaction <ExternalLink/></a></Button></div><p className="mt-4 text-xs text-muted-foreground">A saved receipt is not a confirmation. Check the transaction before starting another launch.</p>{error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}<Button variant="ghost" className="mt-6" onClick={() => { setReceipt(null); setConfirmed(false); setError(""); localStorage.removeItem("vyrai:last-launch"); }}>Create another token</Button></section> :
    <form onSubmit={submit} className="mt-10 grid gap-10 border-t border-border pt-8 md:grid-cols-[1fr_240px]">
      <div className="space-y-6"><label className="block text-sm font-medium">Token name<Input required maxLength={32} value={name} onChange={e => setName(e.target.value)} disabled={busy} placeholder="Nyra" className="mt-2 h-12"/></label><label className="block text-sm font-medium">Symbol<Input required maxLength={8} value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))} disabled={busy} placeholder="NYRA" className="mt-2 h-12 font-mono"/></label><label className="block text-sm font-medium">Total supply<Input required inputMode="numeric" value={supply} onChange={e => setSupply(e.target.value)} disabled={busy} className="mt-2 h-12 font-mono"/></label>
      <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"><input type="checkbox" checked={accepted} disabled={busy} onChange={e => setAccepted(e.target.checked)} className="mt-1.5 size-4 accent-primary"/>I understand this creates a devnet test token, pays test-network fees, and permanently revokes further minting. Tokens are delivered to my connected wallet.</label>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}{status && <p role="status" className="flex items-center gap-2 text-sm text-primary"><LoaderCircle className="size-4 animate-spin"/>{status}</p>}
      {address ? <Button type="submit" className="h-12 w-full" disabled={!accepted || busy}>{busy ? <LoaderCircle className="animate-spin"/> : <Rocket/>}{busy ? "Launching…" : "Launch token on devnet"}</Button> : <ConnectButton className="h-12 w-full"/>}</div>
      <aside className="space-y-6 text-sm"><div><p className="stat-label">Network</p><p className="mt-2">Solana devnet</p></div><div><p className="stat-label">Decimals</p><p className="mt-2 font-mono">6</p></div><div><p className="stat-label">Mint authority</p><p className="mt-2">Revoked at launch</p></div><div><p className="stat-label">Freeze authority</p><p className="mt-2">None</p></div><Button asChild variant="outline"><a href="https://faucet.solana.com/" target="_blank" rel="noreferrer">Get devnet SOL <ExternalLink/></a></Button><Button asChild variant="ghost"><Link to="/create">Create an AI persona</Link></Button></aside>
    </form>}
  </main></div>;
}