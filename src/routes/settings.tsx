import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Trash2 } from "lucide-react";
import AppShell from "@/components/AppShell";
import ChildSwitcher from "@/components/ChildSwitcher";
import { useGrandparent, useMounted, STORE_KEYS } from "@/lib/store";
import LangSwitcher from "@/components/LangSwitcher";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const mounted = useMounted();
  const [gp, setGp] = useGrandparent();

  if (!mounted) return <AppShell><div className="max-w-2xl mx-auto px-4 py-8" /></AppShell>;

  const resetAll = () => {
    if (!confirm("Reset all Yasha data on this device? This cannot be undone.")) return;
    Object.values(STORE_KEYS).forEach((k) => localStorage.removeItem(k));
    toast.success("All data reset");
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-extrabold flex items-center gap-2"><SettingsIcon className="w-7 h-7 text-primary" /> Settings</h1>
        </header>

        <section className="yasha-card p-5 space-y-3">
          <h2 className="font-bold">Children</h2>
          <ChildSwitcher />
        </section>

        <section className="yasha-card p-5">
          <h2 className="font-bold mb-2">Language</h2>
          <LangSwitcher />
        </section>

        <section className="yasha-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bold">Grandparent mode</h2>
              <p className="text-sm text-muted-foreground mt-1">Larger text and simpler navigation for older family members.</p>
            </div>
            <button onClick={() => setGp(!gp)} role="switch" aria-checked={gp}
              className={`relative w-14 h-8 rounded-full transition-colors shrink-0 ${gp ? "bg-primary" : "bg-muted"}`}>
              <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${gp ? "translate-x-7" : "translate-x-1"}`} />
            </button>
          </div>
          {gp && (
            <div className="mt-3 rounded-lg bg-primary-light p-3 text-sm text-primary-dark">
              Grandparent mode is ON — larger touch targets across the app.
            </div>
          )}
        </section>

        <section className="yasha-card p-5">
          <h2 className="font-bold mb-2 text-danger">Danger zone</h2>
          <button onClick={resetAll} className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl bg-danger/10 text-danger font-semibold hover:bg-danger/20">
            <Trash2 className="w-4 h-4" /> Reset all data
          </button>
        </section>

        <p className="text-center text-xs text-muted-foreground">Yasha App · SheLeads Uzbekistan</p>
      </div>
    </AppShell>
  );
}
