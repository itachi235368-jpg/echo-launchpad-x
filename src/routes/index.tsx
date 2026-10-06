import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CircleDollarSign, Radar, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CreatorCard } from "@/components/creator-card";
import { MarketChart } from "@/components/market-chart";
import { SiteHeader } from "@/components/site-header";
import { creators } from "@/lib/demo-data";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Explore AI Creators — VYRAI" },
    { name: "description", content: "Discover token-powered AI creators, live treasuries, and original media on VYRAI." },
    { property: "og:title", content: "Explore AI Creators — VYRAI" },
    { property: "og:description", content: "Discover token-powered AI creators, live treasuries, and original media on VYRAI." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-[1480px] lg:grid-cols-[1.05fr_.95fr]">
            <div className="flex min-h-[560px] flex-col justify-between px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
              <div>
                <div className="mb-10 flex items-center gap-3 text-xs font-semibold uppercase tracking-[.16em] text-primary"><span className="h-px w-9 bg-primary" /> The creator economy, autonomous</div>
                <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[.94] sm:text-7xl lg:text-[5.6rem]">
                  Create the face.<br/><span className="text-primary">Launch the future.</span>
                </h1>
                <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Design an original AI influencer, give it a voice, and launch a community-owned token that funds every new idea.</p>
              </div>
              <div className="mt-12 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="h-12 px-6"><a href="/create"><Sparkles /> Create your AI</a></Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-6"><a href="#trending">Explore creators <ArrowRight /></a></Button>
              </div>
            </div>
            <div className="relative min-h-[430px] overflow-hidden border-t border-border lg:min-h-[560px] lg:border-l lg:border-t-0">
              <img src={creators[0].image} alt="NYRA, a fictional AI fashion creator" width={912} height={1200} className="absolute inset-0 size-full object-cover object-top" />
              <div className="image-shade absolute inset-0" />
              <div className="absolute left-5 top-5 border border-foreground/15 bg-background/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[.14em] backdrop-blur">Live creator · $NYRA</div>
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                <div className="mb-4 flex items-end justify-between"><div><p className="font-display text-4xl font-semibold">NYRA</p><p className="mt-1 text-sm text-foreground/70">Future fashion, rendered daily</p></div><p className="font-mono text-xl font-semibold text-primary">+28.4%</p></div>
                <MarketChart compact />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-card/40">
          <div className="mx-auto grid max-w-[1480px] grid-cols-2 divide-x divide-border lg:grid-cols-4">
            {[['$3.72M','Creator market cap'],['$592K','24h volume'],['$102K','AI treasuries'],['18.4K','Active collectors']].map(([value,label]) => <div key={label} className="px-5 py-7 sm:px-8"><p className="font-mono text-xl font-semibold sm:text-2xl">{value}</p><p className="mt-1 text-xs uppercase text-muted-foreground">{label}</p></div>)}
          </div>
        </section>

        <section id="trending" className="mx-auto max-w-[1480px] px-5 py-16 sm:px-8 lg:py-24">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div><p className="mb-3 text-xs font-semibold uppercase tracking-[.16em] text-primary">Live on VYRAI</p><h2 className="font-display text-4xl font-semibold sm:text-5xl">Creators to watch</h2></div>
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
