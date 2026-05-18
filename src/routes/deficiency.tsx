import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AppShell from "@/components/AppShell";
import { deficiencyQuestions, deficiencyFixes } from "@/lib/mockData";
import { Info, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/deficiency")({ component: Deficiency });

function Deficiency() {
  const { i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) || "en") as "en" | "uz" | "ru";
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const scores: Record<string, number> = {};
  deficiencyQuestions.forEach((q) => {
    if (answers[q.id]) q.maps.forEach((k) => (scores[k] = (scores[k] || 0) + 1));
  });

  const allKeys = Object.keys(deficiencyFixes);
  const results = allKeys.map((k) => {
    const score = scores[k] || 0;
    const level = score >= 3 ? "high" : score >= 1 ? "moderate" : "low";
    return { key: k, score, level, ...deficiencyFixes[k] };
  });

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Deficiency screener</h1>
          <p className="text-muted-foreground mt-1">12 quick questions. No login required.</p>
        </header>

        <div className="rounded-2xl p-4 bg-trust/10 border border-trust/30 flex gap-3">
          <Info className="w-5 h-5 text-trust shrink-0 mt-0.5" />
          <p className="text-sm">This is a screening tool only — not a medical diagnosis.</p>
        </div>

        {!submitted ? (
          <div className="yasha-card p-5 space-y-4">
            {deficiencyQuestions.map((q, i) => (
              <div key={q.id} className="py-3 border-b last:border-0 border-border">
                <p className="font-medium">{i + 1}. {q.q[lang] ?? q.q.en}</p>
                <div className="mt-3 flex gap-2">
                  {[
                    { v: true, l: lang === "uz" ? "Ha" : lang === "ru" ? "Да" : "Yes" },
                    { v: false, l: lang === "uz" ? "Yo'q" : lang === "ru" ? "Нет" : "No" },
                  ].map((b) => {
                    const active = answers[q.id] === b.v;
                    return (
                      <button
                        key={String(b.v)}
                        onClick={() => setAnswers((a) => ({ ...a, [q.id]: b.v }))}
                        className={`min-h-11 px-5 rounded-xl font-medium transition-colors ${
                          active
                            ? b.v
                              ? "bg-caution text-caution-foreground"
                              : "bg-safe text-safe-foreground"
                            : "bg-muted text-foreground hover:bg-accent"
                        }`}
                      >
                        {b.l}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <button
              onClick={() => setSubmitted(true)}
              className="w-full min-h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-dark transition-colors"
            >
              See results
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button onClick={() => setSubmitted(false)} className="text-sm text-primary-dark font-medium">← Edit answers</button>
            {results.map((r) => {
              const styles =
                r.level === "low"
                  ? { card: "bg-safe/10 border-safe/30", chip: "bg-safe text-safe-foreground", text: "Low risk" }
                  : r.level === "moderate"
                    ? { card: "bg-caution/15 border-caution/40", chip: "bg-caution text-caution-foreground", text: "Moderate — consider increasing these foods" }
                    : { card: "bg-danger/10 border-danger/40", chip: "bg-danger text-danger-foreground", text: "High — we recommend seeing a doctor" };
              return (
                <div key={r.key} className={`rounded-2xl p-5 border ${styles.card}`}>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-lg">{r.label}</h3>
                    <span className={`text-[11px] uppercase font-semibold px-2 py-1 rounded-full ${styles.chip}`}>{r.level}</span>
                  </div>
                  <p className="text-sm mt-1 text-foreground/80">{styles.text}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {r.foods.map((f) => (
                      <span key={f} className="text-xs px-3 py-1.5 rounded-full bg-card border border-border">{f}</span>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="rounded-2xl p-4 bg-muted flex gap-3 items-start">
              <ShieldCheck className="w-5 h-5 text-trust shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">Results based on symptom mapping only. Confirm with a blood test through your clinic.</p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
