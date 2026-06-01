import { motion } from "framer-motion";
import { Droplet } from "lucide-react";
import { useChildren, useWaterToday, ageYears, useMounted } from "@/lib/store";
import { waterTargetFor } from "@/lib/wellness";

export default function WaterWidget() {
  const mounted = useMounted();
  const { active } = useChildren();
  const { glasses, set } = useWaterToday(active.id);
  const target = waterTargetFor(ageYears(active.dob));
  const cells = Math.max(target, 10);

  if (!mounted) return <div className="yasha-card p-5 h-32" aria-hidden />;

  const pct = Math.round((glasses / target) * 100);
  const onTarget = glasses >= target;

  return (
    <div className="yasha-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm text-muted-foreground">Water today</div>
          <div className="text-xl font-bold">{glasses} / {target} glasses</div>
        </div>
        <div className={`text-2xl ${onTarget ? "" : "opacity-60"}`}>{onTarget ? "🎉" : "💧"}</div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: cells }).map((_, i) => {
          const filled = i < glasses;
          const inTarget = i < target;
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.85 }}
              onClick={() => set(i + 1 === glasses ? glasses - 1 : i + 1)}
              aria-label={`Glass ${i + 1}`}
              className="w-8 h-10 grid place-items-center rounded-md transition-colors"
              style={{ backgroundColor: filled ? "#0EA5E9" : inTarget ? "rgba(14,165,233,0.12)" : "rgba(0,0,0,0.04)" }}
            >
              <Droplet className={`w-4 h-4 ${filled ? "text-white fill-white" : "text-sky-500/50"}`} />
            </motion.button>
          );
        })}
      </div>
      <div className="mt-2 text-xs text-muted-foreground">{pct}% of daily goal · tap a glass to log</div>
    </div>
  );
}
