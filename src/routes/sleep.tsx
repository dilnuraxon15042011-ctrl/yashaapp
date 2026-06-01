import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from "recharts";
import { Moon } from "lucide-react";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import ChildSwitcher from "@/components/ChildSwitcher";
import { useChildren, useSleepLog, usePoints, ageMonths, todayKey, getLang, useMounted } from "@/lib/store";
import { sleepTargetFor, computeSleepHours, POINT_VALUES, type SleepEntry } from "@/lib/wellness";

export const Route = createFileRoute("/sleep")({ component: SleepPage });

function SleepPage() {
  const mounted = useMounted();
  const { active } = useChildren();
  const { last7, save } = useSleepLog(active.id);
  const { award } = usePoints();
  const lang = getLang();
  const months = ageMonths(active.dob);
  const target = sleepTargetFor(months);

  const [bedtime, setBedtime] = useState("21:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [quality, setQuality] = useState<1|2|3|4|5>(4);
  const [notes, setNotes] = useState("");

  const duration = computeSleepHours(bedtime, wakeTime);

  const chartData = useMemo(() => last7.map(({ date, entry }) => ({
    day: new Date(date).toLocaleDateString(undefined, { weekday: "short" }),
    hours: entry?.durationHours ?? 0,
    quality: entry?.quality ?? 0,
  })), [last7]);

  const today = last7[last7.length - 1]?.entry;
  const status = today ? (today.durationHours >= target.min ? "good" : today.durationHours >= target.min - 1 ? "warn" : "low") : null;
  const statusColor = status === "good" ? "#10B981" : status === "warn" ? "#F59E0B" : status === "low" ? "#EF4444" : "#94A3B8";
  const streak = (() => {
    let s = 0;
    for (let i = last7.length - 1; i >= 0; i--) {
      const e = last7[i].entry;
      if (e && e.durationHours >= target.min) s++; else break;
    }
    return s;
  })();

  const submit = () => {
    if (!duration) { toast.error("Enter valid times"); return; }
    const entry: SleepEntry = { bedtime, wakeTime, durationHours: duration, quality, notes };
    save(todayKey(), entry);
    award(active.id, POINT_VALUES.sleepLogged);
    if (duration >= target.min) award(active.id, POINT_VALUES.sleepOnTarget);
    toast.success("Sleep logged ✓");
  };

  if (!mounted) return <AppShell><div className="max-w-3xl mx-auto px-4 py-8" /></AppShell>;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-extrabold flex items-center gap-2"><Moon className="w-7 h-7 text-primary" /> Sleep tracker</h1>
          <p className="text-muted-foreground">Track your child's sleep against WHO targets.</p>
        </header>
        <ChildSwitcher />

        <div className="yasha-card p-5 space-y-4">
          <div className="text-sm text-muted-foreground">Tonight's target: <span className="font-semibold text-foreground">{target.min}–{target.max}h</span> ({target.label[lang]})</div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <div className="text-xs text-muted-foreground mb-1">Bedtime</div>
              <input type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} className="w-full min-h-12 px-3 rounded-xl border border-border bg-background text-lg" />
            </label>
            <label className="block">
              <div className="text-xs text-muted-foreground mb-1">Wake time</div>
              <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className="w-full min-h-12 px-3 rounded-xl border border-border bg-background text-lg" />
            </label>
          </div>
          <div className="text-center text-2xl font-bold text-primary-dark">🌙 {Math.floor(duration)}h {Math.round((duration % 1) * 60)}m</div>
          <div>
            <div className="text-xs text-muted-foreground mb-2">Sleep quality</div>
            <div className="flex gap-2 justify-between">
              {[1,2,3,4,5].map((q) => (
                <motion.button key={q} whileTap={{ scale: 0.9 }} onClick={() => setQuality(q as 1|2|3|4|5)}
                  className={`flex-1 min-h-14 text-3xl rounded-xl border-2 transition-all ${quality === q ? "border-primary bg-primary/10 scale-105" : "border-border"}`}>
                  {["😴","😕","😐","😊","🌟"][q-1]}
                </motion.button>
              ))}
            </div>
          </div>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" className="w-full min-h-20 px-3 py-2 rounded-xl border border-border bg-background" />
          <button onClick={submit} className="w-full min-h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-dark">Save tonight</button>
        </div>

        {today && (
          <div className="yasha-card p-5 flex items-center gap-4" style={{ borderLeft: `4px solid ${statusColor}` }}>
            <div className="text-4xl">🌙</div>
            <div className="flex-1">
              <div className="text-2xl font-bold">{today.durationHours.toFixed(1)}h</div>
              <div className="text-sm text-muted-foreground">Last night · streak: 🔥 {streak} {streak === 1 ? "night" : "nights"}</div>
            </div>
          </div>
        )}

        <div className="yasha-card p-5">
          <div className="font-semibold mb-3">Last 7 nights</div>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <ReferenceArea y1={target.min} y2={target.max} fill="#10B981" fillOpacity={0.08} />
                <XAxis dataKey="day" />
                <YAxis domain={[0, Math.max(target.max + 2, 14)]} />
                <Tooltip />
                <Bar dataKey="hours" fill="#F97316" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
