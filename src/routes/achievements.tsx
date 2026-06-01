import { createFileRoute } from "@tanstack/react-router";
import { Award } from "lucide-react";
import AppShell from "@/components/AppShell";
import ChildSwitcher from "@/components/ChildSwitcher";
import { useChildren, useAchievements, usePoints, useMounted, getLang } from "@/lib/store";
import { ACHIEVEMENTS } from "@/lib/wellness";

export const Route = createFileRoute("/achievements")({ component: AchievementsPage });

function AchievementsPage() {
  const mounted = useMounted();
  const { active } = useChildren();
  const { owned } = useAchievements();
  const { lifetime } = usePoints();
  const lang = getLang();

  if (!mounted) return <AppShell><div className="max-w-4xl mx-auto px-4 py-8" /></AppShell>;

  const unlocked = owned(active.id);
  const total = lifetime(active.id);

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-extrabold flex items-center gap-2"><Award className="w-7 h-7 text-primary" /> Achievements</h1>
          <p className="text-muted-foreground">Earned by {active.name} · Total points: <span className="font-bold text-primary-dark">{total} 🏆</span></p>
        </header>
        <ChildSwitcher />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((a) => {
            const isOwned = unlocked.includes(a.id);
            const tierColor = a.tier === "gold" ? "#EAB308" : a.tier === "silver" ? "#94A3B8" : "#B45309";
            return (
              <div key={a.id} className={`yasha-card p-5 ${isOwned ? "" : "opacity-50 grayscale"}`}
                   style={{ borderTop: `3px solid ${tierColor}` }}>
                <div className="flex items-start gap-3">
                  <div className="text-4xl">{a.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{a.name[lang]}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{a.desc[lang]}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: tierColor }}>
                        {a.tier}
                      </span>
                      <span className="text-xs font-semibold">+{a.points} pts</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
