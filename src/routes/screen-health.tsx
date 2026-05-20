import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from "recharts";
import { Eye, Sun, Check, Play, Pause, RotateCcw, Bell, BellOff, Smartphone, Tablet, Tv, Monitor } from "lucide-react";
import { STORE_KEYS, useLocalState, useChild, ageYears, todayKey, type Lang } from "@/lib/store";
import { EYE_EXERCISES, EYE_SYMPTOMS, AGE_SCREEN_GUIDELINES, emptyScreenDay, type ScreenLog } from "@/lib/eyeData";

export const Route = createFileRoute("/screen-health")({ component: ScreenHealth });

const DEVICES = [
  { id: "phone", icon: Smartphone },
  { id: "tablet", icon: Tablet },
  { id: "tv", icon: Tv },
  { id: "computer", icon: Monitor },
] as const;

function recommendedHours(years: number): number {
  if (years < 2) return 0;
  if (years <= 5) return 1;
  if (years <= 12) return 2;
  return 3;
}

function ScreenHealth() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) || "uz") as Lang;
  const [child] = useChild();
  const today = todayKey();
  const years = ageYears(child.dob);
  const recHours = recommendedHours(years);

  const [log, setLog] = useLocalState<ScreenLog>(STORE_KEYS.screenLog, {});
  const day = log[today] ?? emptyScreenDay();
  const setDay = (patch: Partial<typeof day>) =>
    setLog((prev) => ({ ...prev, [today]: { ...emptyScreenDay(), ...prev[today], ...patch } }));

  const [symptoms, setSymptoms] = useLocalState<Record<string, Record<string, boolean>>>(STORE_KEYS.eyeSymptoms, {});
  const todaySym = symptoms[today] ?? {};
  const toggleSym = (id: string) =>
    setSymptoms((p) => ({ ...p, [today]: { ...(p[today] ?? {}), [id]: !(p[today]?.[id]) } }));

  const symScore = EYE_SYMPTOMS.reduce((a, s) => a + (todaySym[s.id] ? s.weight : 0), 0);

  // 20-20-20
  const [history, setHistory] = useLocalState<string[]>(STORE_KEYS.twentyHistory, []);
  const [enabled, setEnabled] = useLocalState<boolean>(STORE_KEYS.twentyEnabled, false);
  const doneToday = history.includes(today);
  const streak = useMemo(() => {
    let s = 0;
    const d = new Date();
    for (;;) {
      const k = d.toISOString().slice(0, 10);
      if (history.includes(k)) {
        s++;
        d.setDate(d.getDate() - 1);
      } else if (k === today) {
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return s;
  }, [history, today]);

  // 20-min reminder
  const [secsLeft, setSecsLeft] = useState(20 * 60);
  const [look, setLook] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!enabled) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setSecsLeft((s) => {
        if (s <= 1) {
          setLook(true);
          toast.info(t("screen.look"));
          setTimeout(() => setLook(false), 20_000);
          return 20 * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [enabled, t]);

  // Eye exercises log
  const [exLog, setExLog] = useLocalState<Record<string, string[]>>(STORE_KEYS.eyeExerciseLog, {});
  const doneEx = exLog[today] ?? [];
  const [running, setRunning] = useState<string | null>(null);
  const [exSec, setExSec] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setExSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const startEx = (id: string) => { setRunning(id); setExSec(0); };
  const finishEx = (id: string) => {
    setRunning(null); setExSec(0);
    setExLog((p) => ({ ...p, [today]: Array.from(new Set([...(p[today] ?? []), id])) }));
    toast.success(t("toast.marked"));
  };

  // Weekly chart
  const weekData = useMemo(() => {
    const arr: { name: string; screen: number; outdoor: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      const e = log[k] ?? emptyScreenDay();
      arr.push({
        name: d.toLocaleDateString(lang === "uz" ? "uz-UZ" : lang === "ru" ? "ru-RU" : "en-US", { weekday: "short" }),
        screen: +(e.phone + e.tablet + e.tv + e.computer).toFixed(1),
        outdoor: +e.outdoor.toFixed(1),
      });
    }
    return arr;
  }, [log, lang]);

  const totalScreen = +(day.phone + day.tablet + day.tv + day.computer).toFixed(1);
  const screenOver = totalScreen > recHours && recHours > 0;
  const outdoorLow = day.outdoor < 1;

  const mm = String(Math.floor(secsLeft / 60)).padStart(2, "0");
  const ss = String(secsLeft % 60).padStart(2, "0");

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">{t("screen.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("screen.subtitle")}</p>
        </header>

        {(screenOver || outdoorLow) && (
          <div className="space-y-2">
            {screenOver && (
              <div className="rounded-xl p-3 bg-caution/20 border border-caution/40 text-sm">⚠️ {t("screen.alertScreen")}</div>
            )}
            {outdoorLow && (
              <div className="rounded-xl p-3 bg-primary-light border border-primary/30 text-sm">☀️ {t("screen.alertOutdoor")}</div>
            )}
          </div>
        )}

        {/* Screen time logger */}
        <div className="yasha-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{t("screen.logTitle")}</h2>
            <span className="text-sm text-muted-foreground">
              {t("screen.total")}: <strong className={screenOver ? "text-caution" : "text-foreground"}>{totalScreen}h</strong>
              {recHours > 0 && <span> / {recHours}h</span>}
            </span>
          </div>
          {DEVICES.map((d) => {
            const Icon = d.icon;
            const v = day[d.id as keyof typeof day] as number;
            return (
              <div key={d.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center gap-2"><Icon className="w-4 h-4" /> {d.id}</span>
                  <span className="font-semibold">{v.toFixed(1)}h</span>
                </div>
                <input
                  type="range" min={0} max={8} step={0.1} value={v}
                  onChange={(e) => setDay({ [d.id]: +e.target.value } as Partial<typeof day>)}
                  className="w-full accent-primary"
                />
              </div>
            );
          })}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center gap-1"><Sun className="w-4 h-4" /> {t("screen.outdoor")}</span>
              <span className="font-semibold">{day.outdoor.toFixed(1)}h</span>
            </div>
            <input type="range" min={0} max={8} step={0.1} value={day.outdoor} onChange={(e) => setDay({ outdoor: +e.target.value })} className="w-full accent-safe" />
          </div>
        </div>

        {/* Weekly balance */}
        <div className="yasha-card p-5">
          <h2 className="font-semibold mb-3">{t("screen.title")} — 7d</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="screen" name={t("screen.total")} fill="#F97316" radius={[8, 8, 0, 0]} />
                <Bar dataKey="outdoor" name={t("screen.outdoor")} fill="#22C55E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 20-20-20 */}
        <div className="yasha-card p-5">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-14 h-14 rounded-full bg-primary-light grid place-items-center text-primary-dark font-bold text-xl">
              {streak}
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="font-semibold">{t("screen.twenty")}</div>
              <div className="text-sm text-muted-foreground">{t("screen.twentySub")}</div>
              <div className="text-xs text-muted-foreground mt-1">{streak} {t("screen.streak")}</div>
            </div>
            <button
              onClick={() => {
                if (doneToday) return;
                setHistory((h) => [...h, today]);
                toast.success(t("toast.marked"));
              }}
              disabled={doneToday}
              className={`min-h-11 px-4 rounded-xl font-medium ${doneToday ? "bg-safe text-safe-foreground" : "bg-primary text-primary-foreground hover:bg-primary-dark"}`}
            >
              {doneToday ? <span className="inline-flex items-center gap-1"><Check className="w-4 h-4" /> {t("screen.doneToday")}</span> : t("screen.markToday")}
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => { setEnabled(!enabled); setSecsLeft(20 * 60); }}
              className={`min-h-11 px-4 rounded-xl font-medium inline-flex items-center gap-2 ${enabled ? "bg-caution text-caution-foreground" : "bg-muted hover:bg-muted/70"}`}
            >
              {enabled ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              {enabled ? t("screen.disable") : t("screen.enable")}
            </button>
            {enabled && (
              <div className="font-mono text-lg tabular-nums">{mm}:{ss}</div>
            )}
            {look && <span className="text-sm font-medium text-primary-dark animate-pulse">{t("screen.look")}</span>}
          </div>
        </div>

        {/* Symptoms */}
        <div className="yasha-card p-5">
          <h2 className="font-semibold mb-3 flex items-center gap-2"><Eye className="w-5 h-5" /> {t("screen.symTitle")}</h2>
          <div className="flex flex-wrap gap-2">
            {EYE_SYMPTOMS.map((s) => {
              const on = !!todaySym[s.id];
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSym(s.id)}
                  className={`min-h-11 px-4 rounded-full border text-sm transition-colors ${on ? "bg-caution text-caution-foreground border-caution" : "bg-card border-border hover:bg-muted"}`}
                >
                  {s.label[lang]}
                </button>
              );
            })}
          </div>
          <div className={`mt-4 rounded-xl p-3 text-sm border ${
            symScore === 0 ? "bg-safe/20 border-safe/40" :
            symScore <= 3 ? "bg-primary-light border-primary/30" :
            symScore <= 6 ? "bg-caution/20 border-caution/40" : "bg-destructive/15 border-destructive/40"
          }`}>
            {symScore === 0 ? t("screen.resultLow") : symScore <= 6 ? t("screen.resultMid") : t("screen.resultHigh")}
          </div>
        </div>

        {/* Eye exercises */}
        <div className="yasha-card p-5">
          <h2 className="font-semibold mb-3">{t("screen.exTitle")}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {EYE_EXERCISES.map((ex) => {
              const isRunning = running === ex.id;
              const isDone = doneEx.includes(ex.id);
              const pct = Math.min(100, Math.round((exSec / ex.duration) * 100));
              return (
                <div key={ex.id} className={`rounded-xl border p-4 ${isDone ? "bg-safe/10 border-safe/40" : "border-border"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{ex.icon}</span>
                    <div className="font-semibold flex-1">{ex.name[lang]}</div>
                    <span className="text-xs text-muted-foreground">{ex.duration}s</span>
                  </div>
                  <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-0.5 mb-3">
                    {ex.steps[lang].map((s, i) => <li key={i}>{s}</li>)}
                  </ol>
                  {isRunning && (
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  )}
                  <div className="flex gap-2">
                    {!isRunning ? (
                      <button
                        onClick={() => startEx(ex.id)}
                        className="min-h-10 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-dark inline-flex items-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5" /> {t("screen.exStart")}
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setRunning(null)}
                          className="min-h-10 px-3 rounded-lg bg-muted text-sm font-medium hover:bg-muted/70 inline-flex items-center gap-1"
                        >
                          <Pause className="w-3.5 h-3.5" /> {exSec}s
                        </button>
                        <button
                          onClick={() => finishEx(ex.id)}
                          className="min-h-10 px-3 rounded-lg bg-safe text-safe-foreground text-sm font-medium inline-flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> {t("screen.exDone")}
                        </button>
                      </>
                    )}
                    {isDone && !isRunning && (
                      <button
                        onClick={() => setExLog((p) => ({ ...p, [today]: (p[today] ?? []).filter((x) => x !== ex.id) }))}
                        className="min-h-10 px-3 rounded-lg border border-border text-sm hover:bg-muted inline-flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Age guidelines */}
        <div className="yasha-card p-5">
          <h2 className="font-semibold mb-3">{t("screen.guideTitle")}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {AGE_SCREEN_GUIDELINES.map((g) => (
              <div key={g.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <div className="text-3xl">{g.emoji}</div>
                <div>
                  <div className="font-semibold">{g.age[lang]}</div>
                  <div className="text-sm" style={{ color: g.color }}>{g.limit[lang]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
