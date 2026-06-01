import { motion } from "framer-motion";
import { CheckCircle2, Trophy } from "lucide-react";
import { useChildren, useChallengeDone, usePoints, todayKey, getLang, useMounted } from "@/lib/store";
import { getDailyChallenge, POINT_VALUES } from "@/lib/wellness";
import { toast } from "sonner";

export default function ChallengeCard() {
  const mounted = useMounted();
  const { active } = useChildren();
  const { done, mark } = useChallengeDone(active.id);
  const { award } = usePoints();
  const lang = getLang();
  const ch = getDailyChallenge(todayKey());

  if (!mounted) return <div className="yasha-card p-5 h-36" aria-hidden />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 text-white shadow-lg"
      style={{ background: done ? "linear-gradient(135deg, #10B981 0%, #059669 100%)" : "linear-gradient(135deg, #F97316 0%, #EA580C 100%)" }}
    >
      <div className="flex items-start gap-4">
        <div className="text-5xl">{ch.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="text-xs uppercase tracking-wider opacity-90 flex items-center gap-1">
            <Trophy className="w-3 h-3" /> Today's challenge · {ch.points} pts
          </div>
          <div className="font-bold text-lg leading-snug mt-1">{ch.title[lang]}</div>
          <div className="text-sm opacity-90 mt-1">{ch.description[lang]}</div>
        </div>
      </div>
      <button
        disabled={done}
        onClick={() => {
          mark();
          award(active.id, POINT_VALUES.challengeCompleted);
          toast.success(`+${POINT_VALUES.challengeCompleted} points!`);
        }}
        className="mt-4 w-full min-h-11 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur font-semibold transition-colors disabled:opacity-100 flex items-center justify-center gap-2"
      >
        {done ? (<><CheckCircle2 className="w-5 h-5" /> Done! +{ch.points} points</>) : "Mark complete"}
      </button>
    </motion.div>
  );
}
