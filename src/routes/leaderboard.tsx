import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Trophy } from "lucide-react";
import AppShell from "@/components/AppShell";
import { useChildren, usePoints, useAchievements, useMounted } from "@/lib/store";
import { ACHIEVEMENTS } from "@/lib/wellness";

export const Route = createFileRoute("/leaderboard")({ component: LeaderboardPage });

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0,2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

function LeaderboardPage() {
  const mounted = useMounted();
  const { children } = useChildren();
  const { weeklyTotal } = usePoints();
  const { owned } = useAchievements();

  const ranked = useMemo(() => {
    return [...children].map((c) => ({ child: c, points: weeklyTotal(c.id), badges: owned(c.id) }))
      .sort((a, b) => b.points - a.points);
  }, [children, weeklyTotal, owned]);

  if (!mounted) return <AppShell><div className="max-w-3xl mx-auto px-4 py-8" /></AppShell>;

  const podium = ranked.slice(0, 3);
  const podiumOrder = [podium[1], podium[0], podium[2]].filter(Boolean);
  const heights = [110, 140, 90];

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-extrabold flex items-center justify-center gap-2"><Trophy className="w-7 h-7 text-primary" /> Family leaderboard</h1>
          <p className="text-muted-foreground">Who's winning this week in the family?</p>
        </header>

        {ranked.length >= 1 && (
          <div className="flex items-end justify-center gap-4 py-6">
            {podiumOrder.map((p, idx) => {
              const rank = p === podium[0] ? 1 : p === podium[1] ? 2 : 3;
              const h = heights[idx];
              return (
                <div key={p.child.id} className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full grid place-items-center text-white font-bold text-lg"
                       style={{ backgroundColor: p.child.color }}>
                    {initials(p.child.name)}
                  </div>
                  <div className="text-sm font-semibold">{p.child.name}</div>
                  <div className="text-xs text-muted-foreground">{p.points} pts</div>
                  <div className={`rounded-t-xl w-20 grid place-items-center text-2xl font-extrabold text-white ${rank === 1 ? "bg-gradient-to-b from-yellow-400 to-yellow-600" : rank === 2 ? "bg-gradient-to-b from-slate-300 to-slate-500" : "bg-gradient-to-b from-orange-300 to-orange-500"}`}
                       style={{ height: h }}>
                    {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="yasha-card divide-y divide-border">
          {ranked.map((r, i) => (
            <div key={r.child.id} className="flex items-center gap-3 p-4">
              <div className="w-8 text-center text-lg font-bold text-muted-foreground">#{i + 1}</div>
              <div className="w-10 h-10 rounded-full grid place-items-center text-white font-bold" style={{ backgroundColor: r.child.color }}>
                {initials(r.child.name)}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{r.child.name}</div>
                <div className="text-xs text-muted-foreground">{r.badges.length} badges earned</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary-dark">{r.points}</div>
                <div className="text-xs text-muted-foreground">this week</div>
              </div>
            </div>
          ))}
        </div>

        <Link to="/achievements" className="block text-center min-h-12 rounded-xl bg-primary text-primary-foreground font-semibold leading-[3rem] hover:bg-primary-dark">
          See achievements →
        </Link>

        <p className="text-center text-xs text-muted-foreground">Total achievements available: {ACHIEVEMENTS.length}</p>
      </div>
    </AppShell>
  );
}
