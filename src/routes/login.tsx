import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  };

  const onGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { setBusy(false); return toast.error(result.error.message ?? "Google sign-in failed"); }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  };

  return (
    <AppShell>
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="yasha-card p-6">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back to Yasha.</p>
          <button onClick={onGoogle} disabled={busy} className="mt-6 w-full min-h-12 rounded-xl border border-input bg-background font-medium hover:bg-muted flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          <div className="my-4 flex items-center gap-2 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border"/>or<div className="h-px flex-1 bg-border"/></div>
          <form className="space-y-4" onSubmit={onEmail}>
            <label className="block text-sm font-medium">Email
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full min-h-11 px-3 rounded-xl border border-input bg-background" />
            </label>
            <label className="block text-sm font-medium">Password
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full min-h-11 px-3 rounded-xl border border-input bg-background" />
            </label>
            <button disabled={busy} className="w-full min-h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-dark disabled:opacity-60">
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <div className="mt-4 flex items-center justify-between text-sm">
            <Link to="/register" className="text-trust font-medium">Create account</Link>
            <Link to="/dashboard" className="text-primary-dark font-medium">Continue as guest</Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
