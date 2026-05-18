import { createFileRoute, Link } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { sampleChild, vaccineSchedule } from "@/lib/mockData";
import { Apple, TrendingUp, Heart, Syringe, Eye, FileText, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function ageYears(dob: string) {
  const diff = Date.now() - new Date(dob).getTime();
  return (diff / (365.25 * 24 * 3600 * 1000)).toFixed(1);
}

function Dashboard() {
  const overdue = vaccineSchedule.filter((v) => !v.done).length;
  const modules = [
    { Icon: Apple, label: "Nutrition", to: "/nutrition", status: "attention", note: "Iron 62% of target today" },
    { Icon: TrendingUp, label: "Growth", to: "/growth", status: "good", note: "On the 50th percentile" },
    { Icon: Heart, label: "Deficiency", to: "/deficiency", status: "good", note: "No recent screening" },
    { Icon: Syringe, label: "Vaccination", to: "/vaccination", status: overdue ? "attention" : "good", note: `${overdue} upcoming` },
    { Icon: Eye, label: "Eye Health", to: "/screen-health", status: "good", note: "2.1h screen today" },
    { Icon: FileText, label: "Doctor PDF", to: "/report", status: "good", note: "Auto-compiled" },
  ];

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="text-3xl font-bold mt-1">Family dashboard</h1>
        </div>

        {/* Child profile */}
        <div className="yasha-card p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full yasha-hero-gradient text-primary-foreground grid place-items-center text-xl font-bold">
            {sampleChild.name[0]}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-lg">{sampleChild.name}</div>
            <div className="text-sm text-muted-foreground">
              {ageYears(sampleChild.dob)} yrs · {sampleChild.heightCm} cm · {sampleChild.weightKg} kg
            </div>
          </div>
          <button className="text-sm font-medium text-primary-dark min-h-11 px-3">+ Add child</button>
        </div>

        {/* Modules */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => {
            const Icon = m.Icon;
            const badge =
              m.status === "good"
                ? "bg-safe/15 text-safe"
                : m.status === "attention"
                  ? "bg-caution/20 text-caution-foreground"
                  : "bg-danger/15 text-danger";
            return (
              <Link key={m.to} to={m.to} className="yasha-card p-5 flex items-start gap-4 hover:shadow-lg transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-primary-light text-primary-dark grid place-items-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{m.label}</h3>
                    <span className={`text-[11px] uppercase tracking-wide px-2 py-1 rounded-full font-semibold ${badge}`}>
                      {m.status === "good" ? "Up to date" : "Attention"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{m.note}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground mt-3" />
              </Link>
            );
          })}
        </div>

        {/* Recent activity */}
        <div className="yasha-card p-5">
          <h2 className="font-semibold mb-3">Recent activity</h2>
          <ul className="text-sm divide-y divide-border">
            {[
              "Logged dinner — Jigar, Non, Pomegranate",
              "Marked MMR (1) as completed",
              "Growth update: 102 cm / 16.5 kg",
              "Screen time logged: 2.1h today",
            ].map((a, i) => (
              <li key={i} className="py-3 flex items-center justify-between">
                <span>{a}</span>
                <span className="text-xs text-muted-foreground">today</span>
              </li>
            ))}
          </ul>
        </div>

        <Link to="/report" className="block w-full text-center min-h-12 inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary-dark transition-colors px-6">
          Generate Doctor Report
        </Link>
      </div>
    </AppShell>
  );
}
