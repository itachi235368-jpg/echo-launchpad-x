import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Sparkles, Wallet } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Explore" },
  { to: "/studio", label: "Studio" },
  { to: "/create", label: "Create" },
] as const;

export function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="VYRAI home">
      <span className="grid size-8 place-items-center border border-primary/50 bg-primary text-sm font-black text-primary-foreground">
        V
      </span>
      <span className="font-display text-lg font-bold tracking-normal">VYRAI</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Brand />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 text-sm transition-colors ${pathname === link.to ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost">
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button asChild>
            <Link to="/create"><Sparkles /> Launch an AI</Link>
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
          <Menu />
        </Button>
      </div>
      {open && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="grid gap-1" aria-label="Mobile navigation">
            {links.map((link) => <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="px-3 py-3 text-sm text-foreground">{link.label}</Link>)}
            <Link to="/auth" className="mt-2 flex items-center gap-2 border-t border-border px-3 pt-4 text-sm text-foreground"><Wallet className="size-4" /> Sign in</Link>
          </nav>
        </div>
      )}
    </header>
  );
}