import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import AppShell from "@/components/AppShell";
import { vaccineSchedule as initialSchedule, type Vaccine } from "@/lib/mockData";
import { Check, AlertTriangle } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";

export const Route = createFileRoute("/vaccination")({ component: Vaccination });

function Vaccination() {
  const [list, setList] = useState<Vaccine[]>(initialSchedule);
  const done = list.filter((v) => v.done).length;
  const pct = Math.round((done / list.length) * 100);
  const overdue = list.filter((v) => !v.done && /months|year/i.test(v.due));
  const celebrated = useRef(false);

  useEffect(() => {
    if (done === list.length && !celebrated.current) {
      celebrated.current = true;
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 }, colors: ["#F97316", "#22C55E", "#0D9488"] });
    }
  }, [done, list.length]);

  const toggle = (i: number) => {
    setList((l) => l.map((x, j) => j === i ? { ...x, done: !x.done, doneDate: x.done ? null : new Date().toISOString().slice(0, 10) } : x));
    toast.success("Saved ✓");
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Vaccination tracker</h1>
          <p className="text-muted-foreground mt-1">Uzbekistan national immunisation calendar.</p>
        </header>

        <div className="yasha-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Schedule progress</span>
            <span className="font-bold text-primary-dark">{pct}%</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div className="h-full yasha-hero-gradient transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{done} of {list.length} vaccines completed</p>
        </div>

        {overdue.length > 0 && (
          <div className="rounded-2xl p-4 bg-danger/10 border border-danger/40 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
            <p className="text-sm">{overdue.length} vaccine(s) are upcoming or overdue — please contact your clinic.</p>
          </div>
        )}

        <div className="yasha-card divide-y divide-border">
          {list.map((v, i) => {
            const status: "good" | "upcoming" | "overdue" = v.done ? "good" : "overdue";
            const styles = v.done
              ? "bg-safe text-safe-foreground"
              : status === "overdue"
                ? "bg-danger text-danger-foreground"
                : "bg-caution text-caution-foreground";
            return (
              <div key={i} className="p-4 flex items-center gap-3">
                <button
                  onClick={() => toggle(i)}
                  className={`w-11 h-11 rounded-full grid place-items-center transition-colors ${v.done ? "bg-safe text-safe-foreground" : "bg-muted text-muted-foreground hover:bg-primary-light"}`}
                  aria-label="Mark done"
                >
                  <Check className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{v.name}</div>
                  <div className="text-xs text-muted-foreground">Due: {v.due}{v.doneDate ? ` · Given ${v.doneDate}` : ""}</div>
                </div>
                <span className={`text-[11px] uppercase tracking-wide font-semibold px-2 py-1 rounded-full ${styles}`}>
                  {v.done ? "Done" : status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
