import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { sampleFoods, nutrientTargets, type Food } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, CartesianGrid } from "recharts";
import { Plus, X, Sparkles } from "lucide-react";

export const Route = createFileRoute("/nutrition")({ component: Nutrition });

function Nutrition() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [log, setLog] = useState<Food[]>([sampleFoods[0], sampleFoods[6]]);
  const [pick, setPick] = useState("");

  const totals = useMemo(() => {
    const acc = { iron: 0, calcium: 0, vitaminD: 0, zinc: 0, protein: 0 };
    log.forEach((f) => {
      acc.iron += f.iron; acc.calcium += f.calcium; acc.vitaminD += f.vitaminD;
      acc.zinc += f.zinc; acc.protein += f.protein;
    });
    return acc;
  }, [log]);

  const chartData = (Object.keys(nutrientTargets) as Array<keyof typeof nutrientTargets>).map((k) => {
    const target = nutrientTargets[k];
    const val = totals[k];
    const pct = (val / target) * 100;
    const fill = pct >= 80 ? "#22C55E" : pct >= 40 ? "#F59E0B" : "#EF4444";
    return { name: k, value: +val.toFixed(1), target, fill };
  });

  const lowest = chartData.reduce((a, b) => (a.value / a.target < b.value / b.target ? a : b));
  const suggestion =
    lowest.value / lowest.target < 0.6
      ? `Your child is low in ${lowest.name} today — try ${
          lowest.name === "iron" ? "jigar or pomegranate" : lowest.name === "calcium" ? "suzma or yogurt" : lowest.name === "vitaminD" ? "egg yolk or sunlight" : "lentils or eggs"
        } for dinner.`
      : null;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Nutrition log</h1>
          <p className="text-muted-foreground mt-1">Tap a dish to add it to today's intake.</p>
        </header>

        <div className="yasha-card p-5 flex flex-wrap gap-3 items-center">
          <label className="text-sm font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="min-h-11 px-3 rounded-xl border border-input bg-background"
          />
          <div className="flex-1" />
          <select
            value={pick}
            onChange={(e) => {
              const f = sampleFoods.find((x) => x.name === e.target.value);
              if (f) setLog((l) => [...l, f]);
              setPick("");
            }}
            className="min-h-11 px-3 rounded-xl border border-input bg-background"
          >
            <option value="">+ Add Uzbek dish…</option>
            {sampleFoods.map((f) => (
              <option key={f.name} value={f.name}>{f.name}</option>
            ))}
          </select>
        </div>

        {suggestion && (
          <div className="rounded-2xl p-4 bg-caution/20 border border-caution/40 text-foreground flex gap-3 items-start">
            <Sparkles className="w-5 h-5 text-caution shrink-0 mt-0.5" />
            <p className="text-sm">{suggestion}</p>
          </div>
        )}

        <div className="yasha-card p-5">
          <h2 className="font-semibold mb-3">Today's intake vs WHO targets</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                {chartData.map((d) => (
                  <ReferenceLine key={d.name} y={d.target} stroke="#0D9488" strokeDasharray="4 4" />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
            {chartData.map((d) => {
              const pct = Math.min(100, (d.value / d.target) * 100);
              const color = pct >= 80 ? "bg-safe" : pct >= 40 ? "bg-caution" : "bg-danger";
              return (
                <div key={d.name} className="p-3 rounded-xl bg-muted">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{d.name}</div>
                  <div className="font-semibold mt-1">{d.value} / {d.target}</div>
                  <div className="mt-2 h-2 rounded-full bg-background overflow-hidden">
                    <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="yasha-card p-5">
          <h2 className="font-semibold mb-3">Today's foods</h2>
          {log.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing logged yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {log.map((f, i) => (
                <li key={i} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{f.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Fe {f.iron}mg · Ca {f.calcium}mg · D {f.vitaminD}IU · Zn {f.zinc}mg · P {f.protein}g
                    </div>
                  </div>
                  <button
                    onClick={() => setLog((l) => l.filter((_, j) => j !== i))}
                    aria-label="Remove"
                    className="min-h-11 min-w-11 grid place-items-center text-muted-foreground hover:text-danger"
                  >
                    <X className="w-4 h-4" />
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
