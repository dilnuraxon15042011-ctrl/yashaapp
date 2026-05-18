import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import { whoHeightBoys, sampleChild } from "@/lib/mockData";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend, Scatter, ComposedChart } from "recharts";
import { TrendingUp, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/growth")({ component: Growth });

function Growth() {
  const [h, setH] = useState(sampleChild.heightCm);
  const [w, setW] = useState(sampleChild.weightKg);
  const ageYears = (Date.now() - new Date(sampleChild.dob).getTime()) / (365.25 * 86400 * 1000);
  const childPoint = { age: +ageYears.toFixed(1), child: h };

  const data = whoHeightBoys.map((d) =>
    d.age === Math.round(childPoint.age) ? { ...d, child: childPoint.child } : d
  );

  const bmi = +(w / Math.pow(h / 100, 2)).toFixed(1);
  const bmiBadge = bmi < 14 ? { c: "bg-caution/20 text-caution-foreground", l: "Low" } : bmi > 18 ? { c: "bg-caution/20 text-caution-foreground", l: "High" } : { c: "bg-safe/15 text-safe", l: "Healthy" };

  const below15 = h < (whoHeightBoys[Math.round(ageYears)]?.p15 ?? 0);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Growth tracker</h1>
          <p className="text-muted-foreground mt-1">WHO percentile chart for {sampleChild.name}.</p>
        </header>

        <div className="yasha-card p-5 grid sm:grid-cols-3 gap-4 items-end">
          <label className="text-sm font-medium block">Height (cm)
            <input type="number" value={h} onChange={(e) => setH(+e.target.value)} className="mt-1 w-full min-h-11 px-3 rounded-xl border border-input bg-background" />
          </label>
          <label className="text-sm font-medium block">Weight (kg)
            <input type="number" value={w} onChange={(e) => setW(+e.target.value)} className="mt-1 w-full min-h-11 px-3 rounded-xl border border-input bg-background" />
          </label>
          <div className={`rounded-xl px-4 py-3 ${bmiBadge.c}`}>
            <div className="text-xs uppercase tracking-wide font-semibold">BMI · {bmiBadge.l}</div>
            <div className="text-2xl font-bold mt-1 flex items-center gap-2">
              {bmi} <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        {below15 && (
          <div className="rounded-2xl p-4 bg-caution/20 border border-caution/40 flex gap-3">
            <AlertCircle className="w-5 h-5 text-caution shrink-0 mt-0.5" />
            <p className="text-sm">Growth is below the 15th percentile — consider consulting your paediatrician.</p>
          </div>
        )}

        <div className="yasha-card p-5">
          <h2 className="font-semibold mb-3">Height for age (boys, 0–18 yrs)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="age" label={{ value: "Age (yrs)", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "cm", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="p5" stroke="#94A3B8" dot={false} strokeWidth={1} />
                <Line type="monotone" dataKey="p15" stroke="#F59E0B" dot={false} strokeWidth={1} />
                <Line type="monotone" dataKey="p50" stroke="#0D9488" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="p85" stroke="#F59E0B" dot={false} strokeWidth={1} />
                <Line type="monotone" dataKey="p95" stroke="#94A3B8" dot={false} strokeWidth={1} />
                <Scatter dataKey="child" fill="#F97316" name="Amir" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
