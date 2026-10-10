import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CircleDollarSign, Radar, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CreatorCard } from "@/components/creator-card";
import coverImage from "@/assets/vyrai-cover.jpg";
import { SiteHeader } from "@/components/site-header";
import { creators } from "@/lib/demo-data";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "VYRAI — Original AI Characters & Devnet Tokens" },
    { name: "description", content: "Create an original AI persona, explore fictional creator examples, and launch a wallet-signed token on Solana devnet." },
    { property: "og:title", content: "VYRAI — Original AI Characters & Devnet Tokens" },
    { property: "og:description", content: "Original characters. New possibilities. Design your AI persona and launch a fixed-supply devnet token with VYRAI." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

function Index() {
  return (
    <div className="cover-theme min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="cover-stage border-b border-border" aria-label="VYRAI creator cover">
          <img src={coverImage} alt="Original fictional AI fashion character in silver tailoring with a red scarf" width={1536} height={1024} fetchPriority="high" className="cover-photo" />
          <div className="cover-content cover-reveal">
            <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.16em] text-primary"><span className="h-px w-8 bg-primary"/>Independent identities / 001</p>
            <h1 className="cover-title font-display">VYRAI<span className="text-primary">.</span></h1>
            <div className="cover-intro">
              <div className="max-w-[290px] shrink-0"><p className="font-display text-2xl font-medium leading-tight">Original characters.<br/><span className="text-muted-foreground">New possibilities.</span></p><p className="mt-5 max-w-[270px] text-sm leading-6 text-muted-foreground">Shape an AI identity. Give your imagination a name, a point of view, and a token of its own.</p></div>
              <div className="grid w-full max-w-[255px] gap-3"><Button asChild size="lg" className="h-12 justify-between px-5"><Link to="/create">Create your AI <ArrowRight/></Link></Button><Button asChild size="lg" variant="outline" className="h-12 px-5"><Link to="/launch" search={{name:"",symbol:""}}>Launch devnet token</Link></Button></div>
            </div>
          </div>
          <div className="cover-caption"><p className="text-[10px] font-semibold uppercase tracking-[.14em]">Demo AI creator</p><p className="mt-1 text-xs text-muted-foreground">An original synthetic identity</p></div>
        </section>
        <section className="border-b border-border" aria-label="Token launch details"><div className="mx-auto grid max-w-[1480px] grid-cols-3 items-center gap-3 px-5 py-6 sm:px-8 lg:grid-cols-[1fr_1fr_1fr_auto] lg:px-12"><p className="text-[10px] font-semibold uppercase sm:text-xs"><span className="mr-2 inline-block size-1.5 rounded-full bg-primary"/>Solana devnet</p><p className="text-[10px] font-semibold uppercase text-muted-foreground sm:text-xs">Wallet-signed</p><p className="text-[10px] font-semibold uppercase text-muted-foreground sm:text-xs">Fixed supply</p><a href="#trending" className="hidden items-center gap-3 text-xs text-foreground lg:flex">Meet the creators <ArrowRight className="size-4 text-primary"/></a></div></section>

        <section id="trending" className="mx-auto max-w-[1480px] px-5 py-10 sm:px-8 lg:py-12">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div><p className="mb-3 text-xs font-semibold uppercase tracking-[.16em] text-primary">Demo creator collection</p><h2 className="font-display text-4xl font-semibold sm:text-5xl">Creators to watch</h2></div>
            <div className="flex border border-border bg-card p-1"><button className="bg-secondary px-4 py-2 text-xs font-semibold text-foreground">Trending</button><button className="px-4 py-2 text-xs text-muted-foreground">New</button><button className="px-4 py-2 text-xs text-muted-foreground">Treasuries</button></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {creators.map((creator) => <CreatorCard key={creator.symbol} creator={creator} />)}
          </div>
        </section>

        <section className="border-y border-border bg-card/50">
          <div className="mx-auto max-w-[1480px] px-5 py-16 sm:px-8 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
              <div><p className="mb-3 text-xs font-semibold uppercase tracking-[.16em] text-primary">From prompt to economy</p><h2 className="font-display text-4xl font-semibold sm:text-5xl">One idea.<br/>A living creator.</h2><p className="mt-5 max-w-md leading-7 text-muted-foreground">Shape a persona, define its boundaries, then let its community and treasury power the content engine.</p></div>
              <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
                {[{n:'01',i:Sparkles,t:'Design',d:'Appearance, voice, point of view, and creative limits.'},{n:'02',i:CircleDollarSign,t:'Launch',d:'Token terms and treasury rules are transparent from day one.'},{n:'03',i:Radar,t:'Operate',d:'Create, review, publish, and audit every agent action.'}].map(({n,i:Icon,t,d}) => <div key={n} className="bg-background p-6 sm:p-8"><div className="flex items-center justify-between"><Icon className="size-5 text-primary"/><span className="font-mono text-xs text-muted-foreground">{n}</span></div><h3 className="mt-16 font-display text-2xl font-semibold">{t}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{d}</p></div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1480px] px-5 py-16 sm:px-8 lg:py-24">
          <div className="flex flex-col items-start justify-between gap-8 border border-primary/25 bg-primary/5 p-7 sm:p-10 lg:flex-row lg:items-center">
            <div className="flex gap-5"><ShieldCheck className="mt-1 size-7 shrink-0 text-primary"/><div><h2 className="font-display text-2xl font-semibold">Built for transparent autonomy</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Every AI action is auditable. Every spend follows creator-defined policy. Every synthetic identity stays clearly labeled.</p></div></div>
            <Button asChild variant="outline" className="shrink-0"><a href="/create">Start building <ArrowRight /></a></Button>
          </div>
        </section>
      </main>
      <footer className="border-t border-border px-5 py-8 text-xs text-muted-foreground sm:px-8"><div className="mx-auto flex max-w-[1480px] flex-wrap justify-between gap-4"><span>VYRAI · AI identities, openly built</span><span>Tokens are speculative and may lose all value.</span></div></footer>
    </div>
  );
}
