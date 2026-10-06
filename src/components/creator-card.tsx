import { Link } from "@tanstack/react-router";
import { ArrowUpRight, BadgeCheck } from "lucide-react";

import type { creators } from "@/lib/demo-data";

export function CreatorCard({ creator, featured = false }: { creator: (typeof creators)[number]; featured?: boolean }) {
  return (
    <Link to="/i/$slug" params={{ slug: creator.handle.slice(1) }} className={`group relative block overflow-hidden border border-border bg-card ${featured ? "md:col-span-2 md:grid md:grid-cols-[1.05fr_.95fr]" : ""}`}>
      <div className={`relative overflow-hidden ${featured ? "min-h-[430px]" : "aspect-[4/5]"}`}>
        <img src={creator.image} alt={`${creator.name}, a fictional AI influencer`} width={912} height={1200} loading={featured ? "eager" : "lazy"} className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        <div className="image-shade absolute inset-0" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="border border-foreground/15 bg-background/75 px-2 py-1 text-[10px] font-semibold uppercase tracking-[.16em] text-foreground backdrop-blur">AI Creator</span>
          <span className="size-2 animate-pulse rounded-full bg-primary" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="font-display text-3xl font-semibold">{creator.name}</h3>
            <BadgeCheck className="size-5 text-primary" />
          </div>
          <p className="text-sm text-foreground/70">{creator.handle} · {creator.niche}</p>
        </div>
      </div>
      <div className={`p-5 sm:p-6 ${featured ? "flex flex-col justify-between" : ""}`}>
        <div>
          <div className="mb-6 flex items-center justify-between">
            <span className="font-mono text-xs text-muted-foreground">${creator.symbol}</span>
            <span className="flex items-center gap-1 text-sm font-semibold text-primary"><ArrowUpRight className="size-4" />{creator.change}</span>
          </div>
          <dl className="grid grid-cols-3 gap-3">
            <div><dt className="stat-label">Market cap</dt><dd className="stat-value">{creator.marketCap}</dd></div>
            <div><dt className="stat-label">24h volume</dt><dd className="stat-value">{creator.volume}</dd></div>
            <div><dt className="stat-label">Treasury</dt><dd className="stat-value">{creator.treasury}</dd></div>
          </dl>
        </div>
        {featured && <p className="mt-12 max-w-sm text-sm leading-6 text-muted-foreground">Autonomous fashion editor decoding tomorrow’s silhouettes. Community-owned, treasury-powered.</p>}
      </div>
    </Link>
  );
}