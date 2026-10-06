import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChevronLeft, ChevronRight, LoaderCircle, Sparkles, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/create")({
  head: () => ({ meta: [
    { title: "Create an AI Influencer — VYRAI" }, { name: "description", content: "Design an original AI influencer and prepare its token launch." },
    { property: "og:title", content: "Create an AI Influencer — VYRAI" }, { property: "og:description", content: "Design an original AI influencer and prepare its token launch." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: CreatePage,
});

const steps = ["Identity", "Personality", "Token", "Review"];

function CreatePage() {
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [step, setStep] = useState(0); const [saving, setSaving] = useState(false);
  const [name, setName] = useState(""); const [symbol, setSymbol] = useState(""); const [niche, setNiche] = useState("Fashion & design");
  const [bio, setBio] = useState(""); const [appearance, setAppearance] = useState(""); const [boldness, setBoldness] = useState([72]);
  const [treasury, setTreasury] = useState([40]); const creator = 40; const treasuryValue = treasury[0] ?? 40; const burn = 100 - treasuryValue - creator;
  useEffect(() => { void supabase.auth.getUser().then(({ data }) => { setUserId(data.user?.id ?? null); }); }, []);
  const slug = useMemo(() => name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), [name]);

  async function saveDraft() {
    if (!userId || !name || !symbol || !niche) return toast.error("Complete the identity and token fields first.");
    setSaving(true);
    const { error } = await supabase.from("personas").insert({ owner_id: userId, slug: `${slug}-${Date.now().toString().slice(-5)}`, name, symbol: symbol.toUpperCase(), niche, bio, appearance_prompt: appearance, personality: { boldness: boldness[0] }, status: "review" });
    if (error) toast.error(error.message); else toast.success("Persona saved for review.");
    setSaving(false);
  }

  if (userId === undefined) return <div className="grid min-h-screen place-items-center"><LoaderCircle className="animate-spin text-primary"/></div>;
  if (!userId) return <div className="min-h-screen"><SiteHeader/><main className="mx-auto max-w-xl px-5 py-28 text-center"><div className="mx-auto grid size-14 place-items-center border border-primary/30 bg-primary/10"><Sparkles className="text-primary"/></div><h1 className="mt-7 font-display text-4xl font-semibold">Your creator starts with an account.</h1><p className="mt-4 leading-7 text-muted-foreground">Sign in to save the persona, own its media, and securely link a launch wallet.</p><Button asChild className="mt-8"><Link to="/auth">Sign in to create</Link></Button></main></div>;

  return <div className="min-h-screen"><SiteHeader/><main className="mx-auto max-w-6xl px-5 py-10 sm:px-8"><div className="mb-10"><p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">Creator launch sequence</p><h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Build an original identity.</h1></div>
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <aside><ol className="grid grid-cols-4 border border-border lg:grid-cols-1">{steps.map((label,index)=><li key={label} className={`flex items-center gap-3 border-border px-3 py-4 text-xs lg:border-b ${index===step?'bg-primary/10 text-primary':'text-muted-foreground'}`}><span className={`grid size-6 place-items-center border font-mono ${index<step?'border-primary bg-primary text-primary-foreground':'border-border'}`}>{index<step?<Check className="size-3"/>:index+1}</span><span className="hidden sm:inline">{label}</span></li>)}</ol><div className="mt-5 border border-border p-4"><p className="text-[10px] uppercase text-muted-foreground">Draft safety</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Nothing launches or spends until you explicitly sign a wallet transaction.</p></div></aside>
      <section className="panel-glow border border-border bg-card p-5 sm:p-8">
        {step===0&&<div><h2 className="font-display text-2xl font-semibold">Who are you creating?</h2><p className="mt-2 text-sm text-muted-foreground">Start with the point of view. Visuals follow.</p><div className="mt-8 grid gap-5 sm:grid-cols-2"><label className="text-xs font-medium">Name<Input className="mt-2 h-11" value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g. Oria"/></label><label className="text-xs font-medium">Token symbol<Input className="mt-2 h-11 uppercase" maxLength={8} value={symbol} onChange={(e)=>setSymbol(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,""))} placeholder="ORIA"/></label><label className="text-xs font-medium sm:col-span-2">Niche<Input className="mt-2 h-11" value={niche} onChange={(e)=>setNiche(e.target.value)} /></label><label className="text-xs font-medium sm:col-span-2">One-line bio<Textarea className="mt-2 min-h-24" value={bio} onChange={(e)=>setBio(e.target.value)} placeholder="What does this creator notice that others miss?"/></label><label className="text-xs font-medium sm:col-span-2">Appearance direction<Textarea className="mt-2 min-h-28" value={appearance} onChange={(e)=>setAppearance(e.target.value)} placeholder="Describe face, styling, palette, camera language, and recurring visual signatures."/></label></div></div>}
        {step===1&&<div><h2 className="font-display text-2xl font-semibold">Give {name||"your creator"} a point of view.</h2><p className="mt-2 text-sm text-muted-foreground">These controls anchor how the agent writes and interprets trends.</p><div className="mt-10 space-y-10"><div><div className="mb-4 flex justify-between text-xs"><span>Measured</span><span className="font-mono text-primary">Boldness {boldness[0]}</span><span>Provocative</span></div><Slider value={boldness} onValueChange={setBoldness} max={100}/></div>{["Curious, never gullible","Opinionated, never hostile","Experimental, never deceptive","Synthetic identity always disclosed"].map((rule)=><div key={rule} className="flex items-center gap-3 border-b border-border pb-4 text-sm"><Check className="size-4 text-primary"/>{rule}</div>)}</div></div>}
        {step===2&&<div><h2 className="font-display text-2xl font-semibold">Set the token economy.</h2><p className="mt-2 text-sm text-muted-foreground">Fee terms become immutable at launch. Network begins on Solana devnet.</p><div className="mt-8 grid gap-5 sm:grid-cols-3"><div className="border border-border p-5"><p className="stat-label">AI treasury</p><p className="mt-3 font-mono text-3xl">{treasuryValue}%</p></div><div className="border border-border p-5"><p className="stat-label">Creator</p><p className="mt-3 font-mono text-3xl">{creator}%</p></div><div className="border border-border p-5"><p className="stat-label">Buy & burn</p><p className="mt-3 font-mono text-3xl">{burn}%</p></div></div><div className="mt-8"><div className="mb-4 flex justify-between text-xs"><span>Treasury fee allocation</span><span className="font-mono text-primary">{treasuryValue}%</span></div><Slider value={treasury} onValueChange={setTreasury} min={20} max={50}/></div><Button variant="outline" className="mt-10"><Wallet/> Connect Solana wallet</Button><p className="mt-3 text-xs text-muted-foreground">Wallet verification and token deployment will be activated after a launch provider is selected.</p></div>}
        {step===3&&<div><h2 className="font-display text-2xl font-semibold">Review the creator.</h2><div className="mt-8 grid gap-5 sm:grid-cols-2"><div className="border border-border p-5"><p className="stat-label">Identity</p><p className="mt-3 font-display text-2xl">{name||"Untitled"}</p><p className="mt-1 font-mono text-xs text-primary">${symbol||"TOKEN"}</p><p className="mt-5 text-sm leading-6 text-muted-foreground">{bio||"No biography yet."}</p></div><div className="border border-border p-5"><p className="stat-label">Launch terms</p><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">Network</dt><dd>Solana devnet</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Treasury</dt><dd>{treasuryValue}%</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Creator</dt><dd>{creator}%</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Buy & burn</dt><dd>{burn}%</dd></div></dl></div></div><div className="mt-5 border border-primary/30 bg-primary/5 p-4 text-xs leading-5 text-muted-foreground">Saving creates a private review draft. It does not deploy a token or charge a wallet.</div></div>}
        <div className="mt-10 flex justify-between border-t border-border pt-5"><Button variant="ghost" disabled={step===0} onClick={()=>setStep((v)=>v-1)}><ChevronLeft/> Back</Button>{step<3?<Button onClick={()=>setStep((v)=>v+1)} disabled={step===0&&(!name||!symbol)}>Continue <ChevronRight/></Button>:<Button onClick={saveDraft} disabled={saving}>{saving&&<LoaderCircle className="animate-spin"/>} Save review draft</Button>}</div>
      </section>
    </div>
  </main></div>;
}