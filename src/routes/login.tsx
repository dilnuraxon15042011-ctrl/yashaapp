import { createFileRoute, Link } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <AppShell>
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="yasha-card p-6">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back to Yasha.</p>
          <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <label className="block text-sm font-medium">Email
              <input type="email" required className="mt-1 w-full min-h-11 px-3 rounded-xl border border-input bg-background" />
            </label>
            <label className="block text-sm font-medium">Password
              <input type="password" required className="mt-1 w-full min-h-11 px-3 rounded-xl border border-input bg-background" />
            </label>
            <button className="w-full min-h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-dark">
              Continue
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
