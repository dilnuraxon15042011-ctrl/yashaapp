import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Check, Flame } from "lucide-react";
import AppShell from "@/components/AppShell";
import { exerciseData, type Lang } from "@/lib/exerciseData";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/exercise")({ component: Exercise });

function Exercise() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) || "uz") as Lang;
  const [activeId, setActiveId] = useState(exerciseData[2].id);
  const active = exerciseData.find((g) => g.id === activeId)!;
  const [done, setDone] = useState<Set<string>>(new Set());
  const [goal, setGoal] = useState(60);
  const [streak] = useState(4);

  const totalMins = useMemo(
    () => active.exercises.filter((e) => done.has(e.name.en)).reduce((a, e) => a + e.duration, 0),
    [done, active]
  );
  const goalPct = Math.min(100, (totalMins / goal) * 100);

  const weekData = [
    { d: "Mon", min: 45 },
    { d: "Tue", min: 60 },
    { d: "Wed", min: 30 },
    { d: "Thu", min: 75 },
    { d: "Fri", min: 50 },
    { d: "Sat", min: 90 },
    { d: "Sun", min: totalMins },
  ];

  const toggleDone = (key: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
        toast.success(t("toast.marked"));
      }
      return next;
    });
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">{t("exercise.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("exercise.subtitle")}</p>
        </header>

        {/* Age picker */}
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex gap-2 min-w-max">
            {exerciseData.map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveId(g.id)}
                className={`min-h-11 px-4 rounded-full font-medium text-sm transition-colors ${
                  g.id === activeId ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-primary-light"
                }`}
              >
                {g.label[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Description + goal */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 yasha-card p-5 border-l-4 border-trust">
            <h2 className="font-semibold text-lg">{active.label[lang]}</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{active.description[lang]}</p>
          </div>
          <div className="yasha-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t("exercise.goal")}</span>
              <span className="font-bold text-primary-dark">{goal} {t("exercise.mins")}</span>
            </div>
            <input
              type="range" min={15} max={120} step={5}
              value={goal} onChange={(e) => setGoal(+e.target.value)}
              className="w-full mt-2 accent-[color:var(--primary)]"
            />
            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-safe"
                initial={{ width: 0 }}
                animate={{ width: `${goalPct}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{totalMins} / {goal} {t("exercise.mins")}</div>
          </div>
        </div>

        {/* Exercises */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {active.exercises.map((ex, i) => {
            const isDone = done.has(ex.name.en);
            return (
              <motion.div
                key={ex.name.en}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className="yasha-card p-5 flex flex-col"
              >
                <div className="text-5xl">{ex.icon}</div>
                <h3 className="mt-3 font-semibold">{ex.name[lang]}</h3>
                <span className="inline-block self-start mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-light text-primary-dark">
                  {ex.duration} {t("exercise.mins")}
                </span>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{ex.description[lang]}</p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleDone(ex.name.en)}
                  className={`mt-4 min-h-11 rounded-xl font-medium transition-colors inline-flex items-center justify-center gap-2 ${
                    isDone ? "bg-safe text-safe-foreground" : "bg-primary text-primary-foreground hover:bg-primary-dark"
                  }`}
                >
                  {isDone ? <><Check className="w-4 h-4" />{t("exercise.doneToday")}</> : t("exercise.markDone")}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Streak + week chart */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="yasha-card p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-caution/20 text-caution-foreground grid place-items-center">
              <Flame className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-bold">{streak}</div>
              <div className="text-xs text-muted-foreground">{t("exercise.streakLabel")}</div>
            </div>
          </div>
          <div className="md:col-span-2 yasha-card p-5">
            <h2 className="font-semibold mb-3">{t("exercise.weekChart")}</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="d" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="min" fill="#F97316" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
