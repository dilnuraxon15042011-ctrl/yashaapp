import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { getDailyFact } from "@/lib/wellness";
import { todayKey, getLang, useMounted } from "@/lib/store";

export default function FactCard() {
  const mounted = useMounted();
  const [copied, setCopied] = useState(false);
  const lang = getLang();
  const fact = getDailyFact(todayKey());

  if (!mounted) return <div className="yasha-card p-5 h-32" aria-hidden />;

  const labels = { uz: "Bilasizmi?", ru: "Вы знали?", en: "Did you know?" } as const;

  return (
    <div className="rounded-2xl p-5 shadow-md" style={{ background: "linear-gradient(135deg, #CCFBF1 0%, #FFFFFF 100%)" }}>
      <div className="flex items-start gap-4">
        <div className="text-4xl">{fact.emoji}</div>
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wider text-primary-dark font-semibold">{labels[lang]}</div>
          <p className="text-sm mt-1 leading-relaxed text-foreground/90">{fact.text[lang]}</p>
        </div>
      </div>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(`${fact.emoji} ${fact.text[lang]} — Yasha`);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch { /* ignore */ }
        }}
        className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary-dark font-semibold hover:underline"
      >
        {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Share2 className="w-3.5 h-3.5" /> Share this fact</>}
      </button>
    </div>
  );
}
