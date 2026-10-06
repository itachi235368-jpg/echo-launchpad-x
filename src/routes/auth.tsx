import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Chrome, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Brand } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Sign in — VYRAI" },
    { name: "description", content: "Sign in or create your VYRAI creator account." },
    { property: "og:title", content: "Sign in — VYRAI" },
    { property: "og:description", content: "Sign in or create your VYRAI creator account." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        void navigate({ to: "/create", replace: true });
      }
    });
  }, [navigate]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin, data: { display_name: displayName } },
      });
      if (error) toast.error(error.message);
      else if (!data.session) toast.success("Check your email to confirm your account.");
      else void navigate({ to: "/create" });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else void navigate({ to: "/create" });
    }
    setLoading(false);
  }

  async function handleGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) toast.error(result.error.message);
    else if (!result.redirected) void navigate({ to: "/create" });
  }

  async function forgotPassword() {
    if (!email) {
      toast.error("Enter your email first.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if (error) toast.error(error.message); else toast.success("Password reset link sent.");
  }

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[.9fr_1.1fr]">
      <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-14">
        <Brand />
        <div className="my-auto w-full max-w-md py-16">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[.16em] text-primary">Creator access</p>
          <h1 className="font-display text-4xl font-semibold">{mode === "signin" ? "Welcome back." : "Build your first AI."}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Your account owns personas, media, schedules, and linked wallets. Private keys never touch VYRAI.</p>
          <Button variant="outline" className="mt-8 h-11 w-full" onClick={handleGoogle}><Chrome /> Continue with Google</Button>
          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border"/>or continue with email<span className="h-px flex-1 bg-border"/></div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && <label className="block text-xs font-medium">Display name<Input required value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-2 h-11" placeholder="Your creator name" /></label>}
            <label className="block text-xs font-medium">Email<Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 h-11" placeholder="you@example.com" /></label>
            <label className="block text-xs font-medium">Password<div className="relative mt-2"><Input required minLength={8} type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 pr-11" placeholder="At least 8 characters"/><Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1" onClick={() => setShowPassword((value) => !value)} aria-label="Toggle password visibility">{showPassword ? <EyeOff/> : <Eye/>}</Button></div></label>
            {mode === "signin" && <button type="button" onClick={forgotPassword} className="text-xs text-primary hover:underline">Forgot password?</button>}
            <Button type="submit" className="h-11 w-full" disabled={loading}>{loading && <LoaderCircle className="animate-spin"/>}{mode === "signin" ? "Sign in" : "Create account"}</Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">{mode === "signin" ? "New to VYRAI?" : "Already have an account?"} <button type="button" className="font-semibold text-foreground hover:text-primary" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>{mode === "signin" ? "Create account" : "Sign in"}</button></p>
          <Link to="/" className="mt-8 block text-center text-xs text-muted-foreground hover:text-foreground">Return to Explore</Link>
        </div>
      </section>
      <section className="relative hidden overflow-hidden border-l border-border lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_35%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_32%)]" />
        <div className="chart-grid absolute inset-0 opacity-25" />
        <div className="absolute inset-x-14 bottom-14 border border-border bg-background/75 p-8 backdrop-blur-xl"><p className="font-mono text-xs text-primary">CREATOR PRINCIPLE 01</p><blockquote className="mt-4 font-display text-3xl font-medium leading-tight">“The creator sets the rules. The agent makes within them.”</blockquote></div>
      </section>
    </main>
  );
}