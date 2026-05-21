import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import AppShell from "@/components/AppShell";
import { ComposedChart, Line, Scatter, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from "recharts";
import { TrendingUp, AlertCircle, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { STORE_KEYS, useLocalState, useChild, ageMonths } from "@/lib/store";
import { getChartData, estimatePercentile, bmiCategory, type GrowthEntry } from "@/lib/who";

export const Route = createFileRoute("/growth")({ component: Growth });

function Growth() {
  const { t } = useTranslation();
  const [child, setChild] = useChild();
  const [history, setHistory] = useLocalState<GrowthEntry[]>(STORE_KEYS.growthLog, []);
  const [h, setH] = useState(child.heightCm ?? 100);
  const [w, setW] = useState(child.weightKg ?? 16);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const months = ageMonths(child.dob);
  const ageY = +(months / 12).toFixed(1);
  const percentile = estimatePercentile(child.sex, months, h);
  const bmi = +(w / Math.pow(h / 100, 2)).toFixed(1);
  const bmiCat = bmiCategory(bmi);
  const bmiStyle = bmiCat === "healthy"
    ? "bg-safe/15 text-safe border-safe/30"
    : bmiCat === "overweight" || bmiCat === "underweight"
      ? "bg-caution/20 text-caution-foreground border-caution/40"
      : "bg-destructive/15 text-destructive border-destructive/40";

  const ref = useMemo(() => getChartData(child.sex), [child.sex]);
  const chartData = ref.map((p) => ({
    ...p,
    child: Math.abs(p.ageM - months) < 3 ? h : undefined,
  }));

  // Add the most recent entries as scatter points
  const historyPoints = history.map((e) => {
    const m = Math.floor((new Date(e.date).getTime() - new Date(child.dob).getTime()) / (30.4375 * 86400000));
    return { ageM: m, ageY: +(m / 12).toFixed(1), child: e.height };
  });

  const below15 = percentile < 15;
  const lastH = history[history.length - 1]?.height;
  const delta = lastH !== undefined ? +(h - lastH).toFixed(1) : 0;

  const addEntry = () => {
    const entry: GrowthEntry = { date, height: h, weight: w };
    setHistory((p) => [...p, entry].sort((a, b) => a.date.localeCompare(b.date)));
    setChild((c) => ({ ...c, heightCm: h, weightKg: w }));
    toast.success(t("toast.saved"));
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">{t("growth.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("growth.subtitle")} · {child.name} · {ageY} yrs · {t(`growth.${child.sex === "male" ? "boy" : "girl"}`)}</p>
        </header>

        <div className="yasha-card p-5 grid sm:grid-cols-4 gap-3 items-end">
          <label className="text-sm font-medium block">{t("growth.height")}
            <input type="number" value={h} onChange={(e) => setH(+e.target.value)} className="mt-1 w-full min-h-11 px-3 rounded-xl border border-input bg-background" />
          </label>
          <label className="text-sm font-medium block">{t("growth.weight")}
            <input type="number" step={0.1} value={w} onChange={(e) => setW(+e.target.value)} className="mt-1 w-full min-h-11 px-3 rounded-xl border border-input bg-background" />
          </label>
          <label className="text-sm font-medium block">{t("growth.date")}
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full min-h-11 px-3 rounded-xl border border-input bg-background" />
          </label>
          <button onClick={addEntry}
            className="min-h-11 px-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary-dark inline-flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> {t("growth.add")}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <div className="yasha-card p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{t("growth.percentile")}</div>
            <div className="text-3xl font-extrabold text-primary-dark mt-1">P{percentile}</div>
            <div className="text-xs text-muted-foreground mt-1">{ageY} yrs</div>
          </div>
          <div className={`yasha-card p-4 border ${bmiStyle}`}>
            <div className="text-xs uppercase tracking-wide font-semibold">BMI · {bmiCat}</div>
            <div className="text-3xl font-extrabold mt-1 flex items-center gap-2">{bmi} <TrendingUp className="w-5 h-5" /></div>
          </div>
          <div className="yasha-card p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{t("growth.since")}</div>
            <div className="text-3xl font-extrabold mt-1">{delta >= 0 ? "+" : ""}{delta} cm</div>
          </div>
        </div>

        {below15 ? (
          <div className="rounded-2xl p-4 bg-caution/20 border border-caution/40 flex gap-3">
            <AlertCircle className="w-5 h-5 text-caution-foreground shrink-0 mt-0.5" />
            <p className="text-sm">{t("growth.below15")}</p>
          </div>
        ) : (
          <div className="rounded-2xl p-4 bg-safe/15 border border-safe/30 text-sm">{t("growth.goodGrowth")}</div>
        )}

        <div className="yasha-card p-5">
          <h2 className="font-semibold mb-3">Height for age · {t(`growth.${child.sex === "male" ? "boy" : "girl"}`)}</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="ageY" label={{ value: "Age (yrs)", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "cm", angle: -90, position: "insideLeft" }} domain={["dataMin - 5", "dataMax + 5"]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="p5" stroke="#94A3B8" dot={false} strokeWidth={1} />
                <Line type="monotone" dataKey="p15" stroke="#F59E0B" dot={false} strokeWidth={1} />
                <Line type="monotone" dataKey="p50" stroke="#0D9488" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="p85" stroke="#F59E0B" dot={false} strokeWidth={1} />
                <Line type="monotone" dataKey="p95" stroke="#94A3B8" dot={false} strokeWidth={1} />
                <Scatter data={historyPoints} dataKey="child" fill="#F97316" name={child.name} />
                <Scatter data={chartData.filter((d) => d.child)} dataKey="child" fill="#EA580C" name="Now" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="yasha-card p-5">
          <h2 className="font-semibold mb-3">{t("growth.history")}</h2>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("empty.growth")}</p>
          ) : (
            <ul className="divide-y divide-border">
              {history.slice().reverse().map((e, i) => (
                <li key={`${e.date}-${i}`} className="py-2 flex items-center justify-between text-sm">
                  <span className="font-medium">{e.date}</span>
                  <span className="text-muted-foreground">{e.height} cm · {e.weight} kg</span>
                  <button onClick={() => setHistory((p) => p.filter((x) => !(x.date === e.date && x.height === e.height && x.weight === e.weight)))}
                    className="min-h-9 min-w-9 grid place-items-center text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}
