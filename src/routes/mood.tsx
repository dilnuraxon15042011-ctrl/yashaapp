import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import ChildSwitcher from "@/components/ChildSwitcher";
import { useChildren, useMoodLog, usePoints, todayKey, getLang, useMounted } from "@/lib/store";
import { EMOTIONS, MOOD_RESPONSES, WELLBEING_TIPS, POINT_VALUES, type MoodEntry } from "@/lib/wellness";

export const Route = createFileRoute("/mood")({ component: MoodPage });

const MOOD_EMOJI = ["😢","😕","😐","🙂","😄"];

function MoodPage() {
  const mounted = useMounted();
  const { active } = useChildren();
  const { last30, save, entries } = useMoodLog(active.id);
  const { award } = usePoints();
  const lang = getLang();

  const today = entries[todayKey()];
  const [mood, setMood] = useState<1|2|3|4|5>(today?.mood ?? 4);
  const [tags, setTags] = useState<string[]>(today?.emotions ?? []);
  const [note, setNote] = useState(today?.note ?? "");
  const [response, setResponse] = useState<string | null>(null);

  const toggleTag = (id: string) => setTags((t) => t.includes(id) ? t.filter((x) => x !== id) : [...t, id]);

  const submit = () => {
    const entry: MoodEntry = { mood, emotions: tags, note };
    save(todayKey(), entry);
    award(active.id, POINT_VALUES.moodLogged);
    setResponse(MOOD_RESPONSES[mood][lang]);
    toast.success("Mood logged ✓");
  };

  const chartData = useMemo(() => last30.slice(-14).map(({ date, entry }) => ({
    day: new Date(date).toLocaleDateString(undefined, { month: "numeric", day: "numeric" }),
    mood: entry?.mood ?? null,
  })), [last30]);

  const tips = useMemo(() => {
    const all = new Set<string>();
    last30.slice(-7).forEach(({ entry }) => entry?.emotions.forEach((e) => all.add(e)));
    return Array.from(all).filter((e) => e in WELLBEING_TIPS).slice(0, 3);
  }, [last30]);

  if (!mounted) return <AppShell><div className="max-w-3xl mx-auto px-4 py-8" /></AppShell>;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-extrabold flex items-center gap-2"><Heart className="w-7 h-7 text-primary" /> Mood check-in</h1>
          <p className="text-muted-foreground">How is {active.name} feeling today?</p>
        </header>
        <ChildSwitcher />

        <div className="yasha-card p-5 space-y-5">
          <div className="flex gap-2 justify-between">
            {[1,2,3,4,5].map((m) => (
              <motion.button key={m} whileTap={{ scale: 0.88 }} onClick={() => setMood(m as 1|2|3|4|5)}
                animate={{ scale: mood === m ? 1.15 : 1 }}
                className={`flex-1 min-h-16 text-4xl rounded-2xl border-2 transition-colors ${mood === m ? "border-primary bg-primary/10" : "border-border"}`}>
                {MOOD_EMOJI[m-1]}
              </motion.button>
            ))}
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Positive emotions</div>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.filter((e) => e.positive).map((e) => (
                <button key={e.id} onClick={() => toggleTag(e.id)}
                  className={`px-3 py-2 rounded-full border-2 text-sm transition-colors ${tags.includes(e.id) ? "border-primary bg-primary/10 font-semibold" : "border-border"}`}>
                  {e.emoji} {e.label[lang]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Difficult emotions</div>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.filter((e) => !e.positive).map((e) => (
                <button key={e.id} onClick={() => toggleTag(e.id)}
                  className={`px-3 py-2 rounded-full border-2 text-sm transition-colors ${tags.includes(e.id) ? "border-primary bg-primary/10 font-semibold" : "border-border"}`}>
                  {e.emoji} {e.label[lang]}
                </button>
              ))}
            </div>
          </div>

          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="What happened? (optional)"
            className="w-full min-h-20 px-3 py-2 rounded-xl border border-border bg-background" />

          <button onClick={submit} className="w-full min-h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-dark">
            Save check-in
          </button>

          {response && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-4 bg-primary-light text-primary-dark">
              🐤 {response}
            </motion.div>
          )}
        </div>

        <div className="yasha-card p-5">
          <div className="font-semibold mb-2">Last 7 days</div>
          <div className="flex gap-2 justify-between mb-4">
            {last30.slice(-7).map(({ date, entry }) => (
              <div key={date} className="text-center">
                <div className="text-2xl">{entry ? MOOD_EMOJI[entry.mood - 1] : "·"}</div>
                <div className="text-[10px] text-muted-foreground">{new Date(date).toLocaleDateString(undefined, { weekday: "narrow" })}</div>
              </div>
            ))}
          </div>
          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis domain={[1, 5]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="mood" stroke="#F97316" strokeWidth={2.5} dot={{ r: 4 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {tips.length > 0 && (
          <div className="yasha-card p-5 space-y-3">
            <div className="font-semibold">Yasha's wellbeing tips</div>
            {tips.map((id) => (
              <div key={id} className="rounded-xl bg-muted p-3 text-sm">
                🐤 {WELLBEING_TIPS[id][lang]}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
