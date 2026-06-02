import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import AppShell from "@/components/AppShell";
import ChildSwitcher from "@/components/ChildSwitcher";
import WaterWidget from "@/components/WaterWidget";
import ChallengeCard from "@/components/ChallengeCard";
import FactCard from "@/components/FactCard";
import { Apple, TrendingUp, Heart, Syringe, Eye, FileText, Activity, Moon, Smile, Trophy, ChevronRight } from "lucide-react";
import { STORE_KEYS, useChild, useLocalState, ageMonths, ageYears, todayKey, usePoints, useChildren, useMounted } from "@/lib/store";
import { VACCINE_SCHEDULE, statusOf, type VaccineRecords } from "@/lib/vaccines";
import { sumDay, targetForAge, emptyDay, type NutritionLog } from "@/lib/foods";
import { estimatePercentile } from "@/lib/who";
import { emptyScreenDay, type ScreenLog } from "@/lib/eyeData";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function HealthRing({ pct, size = 140 }: { pct: number; size?: number }) {
  const r = (size - 16) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="hsl(var(--muted))" strokeWidth="10" fill="none" />
      <motion.circle cx={size / 2} cy={size / 2} r={r} stroke="url(#yashaGrad)" strokeWidth="10" strokeLinecap="round" fill="none"
        strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1.1, ease: "easeOut" }} />
      <defs><linearGradient id="yashaGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F97316" /><stop offset="100%" stopColor="#EA580C" /></linearGradient></defs>
    </svg>
  );
}

function Dashboard() {
  const { t } = useTranslation();
  const [child] = useChild();
  const [records] = useLocalState<VaccineRecords>(STORE_KEYS.vaccineRecords, {});
  const [nutritionLog] = useLocalState<NutritionLog>(STORE_KEYS.nutritionLog, {});
  const [screenLog] = useLocalState<ScreenLog>(STORE_KEYS.screenLog, {});
  const [exerciseLog] = useLocalState<Record<string, number>>(STORE_KEYS.exerciseLog, {});

  const today = todayKey();
  const months = ageMonths(child.dob);
  const years = ageYears(child.dob);

  const { vaccinePct, vaccineDone, overdueCount } = useMemo(() => {
    let d = 0, o = 0;
    for (const v of VACCINE_SCHEDULE) {
      const s = statusOf(v, child.dob, records[v.id]);
      if (s === "done") d++;
      if (s === "overdue") o++;
    }
    return { vaccineDone: d, vaccinePct: Math.round((d / VACCINE_SCHEDULE.length) * 100), overdueCount: o };
  }, [child.dob, records]);

  const nutritionPct = useMemo(() => {
    const day = nutritionLog[today] ?? emptyDay();
    const totals = sumDay(day);
    const tgt = targetForAge(years);
    const items: Array<keyof typeof totals> = ["iron", "calcium", "protein"];
    const avg = items.reduce((a, k) => a + Math.min(100, (totals[k] / tgt[k]) * 100), 0) / items.length;
    return Math.round(avg);
  }, [nutritionLog, today, years]);

  const screenPct = useMemo(() => {
    const d = screenLog[today] ?? emptyScreenDay();
    const total = d.phone + d.tablet + d.tv + d.computer;
    const limit = years < 2 ? 0.1 : years <= 5 ? 1 : years <= 12 ? 2 : 3;
    if (total === 0) return 100;
    return Math.max(0, Math.round((1 - Math.max(0, total - limit) / Math.max(limit, 1)) * 100));
  }, [screenLog, today, years]);

  const exerciseMin = exerciseLog[today] ?? 0;
  const exercisePct = Math.min(100, Math.round((exerciseMin / 60) * 100));

  const healthScore = Math.round((vaccinePct + nutritionPct + screenPct + exercisePct) / 4);
  const percentile = child.heightCm ? estimatePercentile(child.sex, months, child.heightCm) : 50;

  const modules = [
    { Icon: Apple, key: "nutrition", to: "/nutrition", accent: "#F97316", note: `${nutritionPct}%`, status: nutritionPct >= 70 ? "good" : "attention" },
    { Icon: TrendingUp, key: "growth", to: "/growth", accent: "#0D9488", note: `P${percentile}`, status: percentile >= 15 ? "good" : "attention" },
    { Icon: Activity, key: "exercise", to: "/exercise", accent: "#22C55E", note: `${exerciseMin} min`, status: exerciseMin >= 30 ? "good" : "attention" },
    { Icon: Moon, key: "sleep", to: "/sleep", accent: "#6366F1", note: "Log tonight", status: "good" },
    { Icon: Smile, key: "mood", to: "/mood", accent: "#EC4899", note: "Check in", status: "good" },
    { Icon: Heart, key: "deficiency", to: "/deficiency", accent: "#EF4444", note: "Screening", status: "good" },
    { Icon: Syringe, key: "vaccination", to: "/vaccination", accent: "#F59E0B", note: `${vaccineDone}/${VACCINE_SCHEDULE.length}`, status: overdueCount ? "attention" : "good" },
    { Icon: Eye, key: "screen", to: "/screen-health", accent: "#0D9488", note: `${screenPct}%`, status: screenPct >= 60 ? "good" : "attention" },
    { Icon: Trophy, key: "leaderboard", to: "/leaderboard", accent: "#EAB308", note: "Family rankings", status: "good" },
    { Icon: FileText, key: "report", to: "/report", accent: "#F97316", note: "PDF", status: "good" },
  ] as const;

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="yasha-card p-6 bg-gradient-to-br from-primary-light to-accent">
          <p className="text-sm text-primary-dark/80">{t("dashboard.welcome")}</p>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-1 text-primary-dark">
            {t("dashboard.greeting")}, {child.name}! 👋
          </h1>
        </motion.div>

        <ChildSwitcher />

        <ChallengeCard />

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
              {years} yrs · {child.heightCm ?? "—"} cm · {child.weightKg ?? "—"} kg
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              <Stat label="Vaccines" value={`${vaccineDone}/${VACCINE_SCHEDULE.length}`} />
              <Stat label="Today kcal" value={`${Math.round(sumDay(nutritionLog[today] ?? emptyDay()).calories)}`} />
              <Stat label="Exercise" value={`${exerciseMin}m`} />
              <PointsStat />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <WaterWidget />
          <FactCard />
        </div>


        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m, i) => {
            const Icon = m.Icon;
            const badge = m.status === "good" ? "bg-safe/15 text-safe" : "bg-caution/20 text-caution-foreground";
            return (
              <motion.div key={m.to} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }} whileHover={{ y: -4 }}>
                <Link to={m.to} className="yasha-card p-5 flex items-start gap-4 hover:shadow-lg transition-shadow group border-l-4" style={{ borderLeftColor: m.accent }}>
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

function PointsStat() {
  const mounted = useMounted();
  const { active } = useChildren();
  const { weeklyTotal } = usePoints();
  const pts = mounted ? weeklyTotal(active.id) : 0;
  return <Stat label="Points" value={`${pts} 🏆`} />;
}
