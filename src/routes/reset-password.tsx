import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Brand } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Reset password — VYRAI" }, { name: "description", content: "Choose a new VYRAI account password." },
    { property: "og:title", content: "Reset password — VYRAI" }, { property: "og:description", content: "Choose a new VYRAI account password." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ]}), component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState(""); const navigate = useNavigate();
  async function submit(event: FormEvent) { event.preventDefault(); const { error } = await supabase.auth.updateUser({ password }); if (error) toast.error(error.message); else { toast.success("Password updated."); void navigate({ to: "/auth" }); } }
  return <main className="min-h-screen px-5 py-6"><Brand/><div className="mx-auto mt-28 max-w-sm"><p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">Account recovery</p><h1 className="mt-4 font-display text-4xl font-semibold">Set a new password.</h1><form onSubmit={submit} className="mt-8 space-y-4"><Input type="password" minLength={8} required value={password} onChange={(e)=>setPassword(e.target.value)} className="h-11" placeholder="New password"/><Button type="submit" className="h-11 w-full">Update password</Button></form><Link to="/auth" className="mt-6 block text-center text-xs text-muted-foreground">Back to sign in</Link></div></main>;
}