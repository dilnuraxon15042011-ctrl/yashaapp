import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Check, Flame } from "lucide-react";
import AppShell from "@/components/AppShell";
import { exerciseData, type Lang } from "@/lib/exerciseData";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { toast } from "sonner";
import { STORE_KEYS, useLocalState, todayKey } from "@/lib/store";

export const Route = createFileRoute("/exercise")({ component: Exercise });

function Exercise() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) || "uz") as Lang;
  const [activeId, setActiveId] = useState(exerciseData[2].id);
  const active = exerciseData.find((g) => g.id === activeId)!;
  const today = todayKey();

  const [doneLog, setDoneLog] = useLocalState<Record<string, string[]>>(STORE_KEYS.exerciseLog + "_done", {});
  const [minutesLog, setMinutesLog] = useLocalState<Record<string, number>>(STORE_KEYS.exerciseLog, {});
  const [goal, setGoal] = useLocalState<number>(STORE_KEYS.exerciseGoal, 60);
  const done = new Set(doneLog[today] ?? []);

  const totalMins = useMemo(
    () => active.exercises.filter((e) => done.has(e.name.en)).reduce((a, e) => a + e.duration, 0),
    [done, active]
  );
  const goalPct = Math.min(100, (totalMins / goal) * 100);

  const weekData = useMemo(() => {
    const arr: { d: string; min: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      arr.push({ d: d.toLocaleDateString(lang === "uz" ? "uz-UZ" : lang === "ru" ? "ru-RU" : "en-US", { weekday: "short" }), min: minutesLog[k] ?? 0 });
    }
    return arr;
  }, [minutesLog, lang]);

  const streak = useMemo(() => {
    let s = 0; const d = new Date();
    for (;;) {
      const k = d.toISOString().slice(0, 10);
      if ((minutesLog[k] ?? 0) > 0) { s++; d.setDate(d.getDate() - 1); } else break;
    }
    return s;
  }, [minutesLog]);

  const toggleDone = (key: string, duration: number) => {
    const has = done.has(key);
    const next = new Set(done);
    if (has) next.delete(key); else { next.add(key); toast.success(t("toast.marked")); }
    setDoneLog((p) => ({ ...p, [today]: Array.from(next) }));
    setMinutesLog((p) => ({ ...p, [today]: Math.max(0, (p[today] ?? 0) + (has ? -duration : duration)) }));
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
