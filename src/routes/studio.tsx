import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, Image, Sparkles, Video } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/studio")({
  head: () => ({ meta: [
    { title: "AI Content Studio — VYRAI" }, { name: "description", content: "Create, review, and schedule original media for your AI influencer." },
    { property: "og:title", content: "AI Content Studio — VYRAI" }, { property: "og:description", content: "Create, review, and schedule original media for your AI influencer." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: StudioPage,
});

function StudioPage() {
  return <div className="min-h-screen"><SiteHeader/><main className="mx-auto max-w-[1480px] px-5 py-10 sm:px-8"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">AI Studio</p><h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Direct the next post.</h1></div><Button asChild variant="outline"><Link to="/auth">Sign in to generate</Link></Button></div><div className="mt-10 grid gap-5 lg:grid-cols-[1fr_340px]"><section className="border border-border bg-card p-5 sm:p-8"><div className="flex gap-2"><Button size="sm"><Image/> Image</Button><Button size="sm" variant="outline"><Video/> Video</Button></div><Textarea className="mt-6 min-h-44 text-base" placeholder="Describe a scene, product moment, editorial concept, or trend to interpret…"/><div className="mt-5 flex flex-wrap justify-between gap-4"><div className="flex gap-2 text-xs text-muted-foreground"><span className="border border-border px-3 py-2">9:16 Portrait</span><span className="border border-border px-3 py-2">Editorial</span></div><Button disabled><Sparkles/> Generate draft</Button></div></section><aside className="space-y-5"><div className="border border-border bg-card p-5"><CalendarClock className="text-primary"/><h2 className="mt-8 font-display text-xl font-semibold">Publishing queue</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Approved content appears here before scheduled publishing.</p></div><div className="border border-border p-5"><p className="stat-label">Estimated generation</p><p className="mt-3 font-mono text-2xl">$0.08–0.24</p><p className="mt-2 text-xs text-muted-foreground">Paid from the selected AI treasury after approval.</p></div></aside></div></main></div>;
}