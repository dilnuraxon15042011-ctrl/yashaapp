import { createFileRoute, Link } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";

export const Route = createFileRoute("/register")({ component: Register });

function Register() {
  return (
    <AppShell>
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="yasha-card p-6">
          <h1 className="text-2xl font-bold">Create your family account</h1>
          <p className="text-sm text-muted-foreground mt-1">Free forever. Bilingual.</p>
          <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <label className="block text-sm font-medium">Parent email
              <input type="email" required className="mt-1 w-full min-h-11 px-3 rounded-xl border border-input bg-background" />
            </label>
            <label className="block text-sm font-medium">Password
              <input type="password" required className="mt-1 w-full min-h-11 px-3 rounded-xl border border-input bg-background" />
            </label>
            <div className="pt-2 border-t border-border">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Child profile</p>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-medium col-span-2">Name
                  <input className="mt-1 w-full min-h-11 px-3 rounded-xl border border-input bg-background" />
                </label>
                <label className="block text-sm font-medium">Date of birth
                  <input type="date" className="mt-1 w-full min-h-11 px-3 rounded-xl border border-input bg-background" />
                </label>
                <label className="block text-sm font-medium">Sex
                  <select className="mt-1 w-full min-h-11 px-3 rounded-xl border border-input bg-background">
                    <option>Male</option><option>Female</option>
                  </select>
                </label>
              </div>
            </div>
            <button className="w-full min-h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-dark">
              Create account
            </button>
          </form>
          <p className="mt-4 text-sm text-center">
            Already have an account? <Link to="/login" className="text-trust font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </AppShell>
  );
}
