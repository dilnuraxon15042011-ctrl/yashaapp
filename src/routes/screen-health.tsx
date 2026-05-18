import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from "recharts";
import { Eye, Sun, Check } from "lucide-react";

export const Route = createFileRoute("/screen-health")({ component: ScreenHealth });

const devices = ["Phone", "Tablet", "TV", "Computer"] as const;
const symptoms = ["Dry eyes", "Squinting", "Headaches", "Blurry vision", "Eye rubbing"] as const;

function ScreenHealth() {
  const [hours, setHours] = useState<Record<string, number>>({ Phone: 1.2, Tablet: 0.5, TV: 0.4, Computer: 0 });
  const [outdoor, setOutdoor] = useState(1.0);
  const [streak, setStreak] = useState(4);
  const [doneToday, setDoneToday] = useState(false);
  const [sym, setSym] = useState<Record<string, boolean>>({});

  const total = devices.reduce((a, d) => a + (hours[d] || 0), 0);
  const data = [{ name: "Today", screen: +total.toFixed(1), outdoor: +outdoor.toFixed(1) }];
  const symCount = Object.values(sym).filter(Boolean).length;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Screen & eye health</h1>
          <p className="text-muted-foreground mt-1">Daily balance, 20-20-20 streak, and symptoms.</p>
        </header>

        <div className="yasha-card p-5 space-y-4">
          <h2 className="font-semibold">Screen time by device (hours)</h2>
          {devices.map((d) => (
            <div key={d}>
              <div className="flex justify-between text-sm mb-1">
                <span>{d}</span>
                <span className="font-semibold">{hours[d].toFixed(1)}h</span>
              </div>
              <input
                type="range" min={0} max={6} step={0.1}
                value={hours[d]}
                onChange={(e) => setHours((h) => ({ ...h, [d]: +e.target.value }))}
                className="w-full accent-primary"
              />
            </div>
          ))}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center gap-1"><Sun className="w-4 h-4" /> Outdoor</span>
              <span className="font-semibold">{outdoor.toFixed(1)}h</span>
            </div>
            <input type="range" min={0} max={6} step={0.1} value={outdoor} onChange={(e) => setOutdoor(+e.target.value)} className="w-full accent-safe" />
          </div>
        </div>

        <div className="yasha-card p-5">
          <h2 className="font-semibold mb-3">Screen vs outdoor balance</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="screen" fill="#F97316" radius={[8,8,0,0]} />
                <Bar dataKey="outdoor" fill="#22C55E" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="yasha-card p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-light grid place-items-center text-primary-dark font-bold text-xl">{streak}</div>
          <div className="flex-1">
            <div className="font-semibold">20-20-20 rule streak</div>
            <div className="text-sm text-muted-foreground">Every 20 min, look 20 feet away for 20 seconds.</div>
          </div>
          <button
            onClick={() => { if (!doneToday) { setStreak((s) => s + 1); setDoneToday(true); } }}
            disabled={doneToday}
            className={`min-h-11 px-4 rounded-xl font-medium ${doneToday ? "bg-safe text-safe-foreground" : "bg-primary text-primary-foreground hover:bg-primary-dark"}`}
          >
            {doneToday ? <span className="inline-flex items-center gap-1"><Check className="w-4 h-4" /> Done</span> : "Mark today"}
          </button>
        </div>

        <div className="yasha-card p-5">
          <h2 className="font-semibold mb-3 flex items-center gap-2"><Eye className="w-5 h-5" /> Eye symptoms today</h2>
          <div className="flex flex-wrap gap-2">
            {symptoms.map((s) => {
              const on = sym[s];
              return (
                <button
                  key={s}
                  onClick={() => setSym((x) => ({ ...x, [s]: !x[s] }))}
                  className={`min-h-11 px-4 rounded-full border text-sm transition-colors ${on ? "bg-caution text-caution-foreground border-caution" : "bg-card border-border hover:bg-muted"}`}
                >
                  {s}
                </button>
              );
            })}
          </div>
          {symCount >= 2 && (
            <div className="mt-4 rounded-xl p-3 bg-caution/20 border border-caution/40 text-sm">
              Consider an eye check-up with an optometrist.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
