import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import AppShell from "@/components/AppShell";
import { sampleChild, vaccineSchedule } from "@/lib/mockData";
import { Apple, TrendingUp, Heart, Syringe, Eye, FileText, Activity, ChevronRight, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function ageYears(dob: string) {
  const diff = Date.now() - new Date(dob).getTime();
  return (diff / (365.25 * 24 * 3600 * 1000)).toFixed(1);
}

type Child = { name: string; dob: string; sex: "male" | "female"; heightCm?: number; weightKg?: number };

function HealthRing({ pct, size = 140 }: { pct: number; size?: number }) {
  const r = (size - 16) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--muted)" strokeWidth="10" fill="none" />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        stroke="url(#yashaGrad)" strokeWidth="10" strokeLinecap="round" fill="none"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
      <defs>
        <linearGradient id="yashaGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Dashboard() {
  const { t } = useTranslation();
  const [children, setChildren] = useState<Child[]>([sampleChild]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("yasha-child");
    if (stored) {
      try {
        const c = JSON.parse(stored) as Child;
        setChildren([{ ...sampleChild, ...c }]);
      } catch { /* ignore */ }
    }
  }, []);

  const child = children[selected];
  const overdue = vaccineSchedule.filter((v) => !v.done).length;
  const doneCount = vaccineSchedule.filter((v) => v.done).length;
  const vaccinePct = Math.round((doneCount / vaccineSchedule.length) * 100);

  const modules = useMemo(() => [
    { Icon: Apple, key: "nutrition", to: "/nutrition", status: "attention", accent: "#F97316", note: "Iron 62% of target" },
    { Icon: TrendingUp, key: "growth", to: "/growth", status: "good", accent: "#0D9488", note: "50th percentile" },
    { Icon: Activity, key: "exercise", to: "/exercise", status: "good", accent: "#22C55E", note: "60 min today" },
    { Icon: Heart, key: "deficiency", to: "/deficiency", status: "good", accent: "#EF4444", note: "Not screened recently" },
    { Icon: Syringe, key: "vaccination", to: "/vaccination", status: overdue ? "attention" : "good", accent: "#F59E0B", note: `${doneCount}/${vaccineSchedule.length}` },
    { Icon: Eye, key: "screen", to: "/screen-health", status: "good", accent: "#0D9488", note: "2.1h today" },
    { Icon: FileText, key: "report", to: "/report", status: "good", accent: "#F97316", note: "Auto-compiled" },
  ], [overdue, doneCount]);

  // health score = avg of 4 metrics (vaccine %, nutrition mock 62, exercise mock 100, screen mock 80)
  const healthScore = Math.round((vaccinePct + 62 + 100 + 80) / 4);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Greeting banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="yasha-card p-6 bg-gradient-to-br from-primary-light to-accent"
        >
          <p className="text-sm text-primary-dark/80">{t("dashboard.welcome")}</p>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-1 text-primary-dark">
            {t("dashboard.greeting")}, {child.name}! 👋
          </h1>
        </motion.div>

        {/* Child switcher */}
        <div className="flex items-center gap-3 overflow-x-auto -mx-4 px-4 pb-2">
          {children.map((c, i) => (
            <button
              key={c.name + i}
              onClick={() => setSelected(i)}
              className="flex flex-col items-center gap-1 shrink-0"
            >
              <div className={`w-14 h-14 rounded-full grid place-items-center font-bold text-lg text-primary-foreground ${i === selected ? "ring-4 ring-primary" : ""}`}
                style={{ background: "linear-gradient(135deg,#F97316,#EA580C)" }}
              >
                {c.name[0]?.toUpperCase()}
              </div>
              <span className="text-xs font-medium">{c.name}</span>
            </button>
          ))}
          <button
            onClick={() => {
              const name = prompt(t("dashboard.addChild"));
              if (name) setChildren((cs) => [...cs, { name, dob: new Date().toISOString().slice(0, 10), sex: "male" }]);
            }}
            className="w-14 h-14 rounded-full border-2 border-dashed border-border grid place-items-center text-muted-foreground hover:border-primary hover:text-primary"
            aria-label={t("dashboard.addChild")}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Health ring + child summary */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="yasha-card p-5 flex items-center gap-5">
            <div className="relative">
              <HealthRing pct={healthScore} />
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-primary-dark">{healthScore}%</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("dashboard.overallHealth")}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 yasha-card p-5">
            <div className="font-semibold text-lg">{child.name}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {ageYears(child.dob)} yrs · {child.heightCm ?? sampleChild.heightCm} cm · {child.weightKg ?? sampleChild.weightKg} kg
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <Stat label="Vaccines" value={`${doneCount}/${vaccineSchedule.length}`} />
              <Stat label="Streak" value="🔥 5" />
              <Stat label="Updated" value="Today" />
            </div>
          </div>
        </div>

        {/* Module grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m, i) => {
            const Icon = m.Icon;
            const badge =
              m.status === "good"
                ? "bg-safe/15 text-safe"
                : m.status === "attention"
                  ? "bg-caution/20 text-caution-foreground"
                  : "bg-danger/15 text-danger";
            return (
              <motion.div
                key={m.to}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  to={m.to}
                  className="yasha-card p-5 flex items-start gap-4 hover:shadow-lg transition-shadow group border-l-4"
                  style={{ borderLeftColor: m.accent }}
                >
                  <div className="w-11 h-11 rounded-xl grid place-items-center text-primary-foreground" style={{ backgroundColor: m.accent }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold">{t(`modules.${m.key}`)}</h3>
                      <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full font-semibold ${badge}`}>
                        {m.status === "good" ? t("status.good") : t("status.attention")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{m.note}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground mt-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <Link to="/report" className="block w-full text-center min-h-12 inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary-dark transition-colors px-6">
          {t("dashboard.generateReport")}
        </Link>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted p-3 text-center">
      <div className="font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
