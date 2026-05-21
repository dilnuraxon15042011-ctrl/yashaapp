import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AppShell from "@/components/AppShell";
import { Download, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { STORE_KEYS, useChild, useLocalState, ageMonths, ageYears, todayKey, type Lang } from "@/lib/store";
import { VACCINE_SCHEDULE, statusOf, dueDate, type VaccineRecords } from "@/lib/vaccines";
import { sumDay, targetForAge, emptyDay, type NutritionLog } from "@/lib/foods";
import { estimatePercentile, bmiCategory } from "@/lib/who";
import { emptyScreenDay, type ScreenLog } from "@/lib/eyeData";

export const Route = createFileRoute("/report")({ component: Report });

function Report() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) || "uz") as Lang;
  const [child] = useChild();
  const [notes, setNotes] = useLocalState<string>(STORE_KEYS.reportNotes, "");
  const [records] = useLocalState<VaccineRecords>(STORE_KEYS.vaccineRecords, {});
  const [nutritionLog] = useLocalState<NutritionLog>(STORE_KEYS.nutritionLog, {});
  const [screenLog] = useLocalState<ScreenLog>(STORE_KEYS.screenLog, {});
  const [exerciseLog] = useLocalState<Record<string, number>>(STORE_KEYS.exerciseLog, {});
  const [exporting, setExporting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const months = ageMonths(child.dob);
  const years = ageYears(child.dob);
  const today = todayKey();

  const weeklyNutrition = useMemo(() => {
    const tot = { iron: 0, calcium: 0, vitD: 0, zinc: 0, protein: 0, calories: 0 };
    let n = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      const e = nutritionLog[k]; if (!e) continue;
      const s = sumDay(e); n++;
      for (const key of Object.keys(tot) as Array<keyof typeof tot>) tot[key] += s[key];
    }
    if (n === 0) n = 1;
    return Object.fromEntries(Object.entries(tot).map(([k, v]) => [k, +(v / n).toFixed(1)])) as typeof tot;
  }, [nutritionLog]);
  const target = targetForAge(years);

  const weeklyScreen = useMemo(() => {
    let total = 0, outdoor = 0, n = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const e = screenLog[d.toISOString().slice(0, 10)]; if (!e) continue;
      total += e.phone + e.tablet + e.tv + e.computer; outdoor += e.outdoor; n++;
    }
    if (n === 0) n = 1;
    return { screen: +(total / n).toFixed(1), outdoor: +(outdoor / n).toFixed(1) };
  }, [screenLog]);

  const weeklyExercise = useMemo(() => {
    let total = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      total += exerciseLog[d.toISOString().slice(0, 10)] ?? 0;
    }
    return total;
  }, [exerciseLog]);

  const percentile = child.heightCm ? estimatePercentile(child.sex, months, child.heightCm) : 0;
  const bmi = child.heightCm && child.weightKg ? +(child.weightKg / Math.pow(child.heightCm / 100, 2)).toFixed(1) : 0;
  const bmiCat = bmi ? bmiCategory(bmi) : "—";

  const handleDownload = async () => {
    if (!ref.current) return;
    setExporting(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf().from(ref.current).set({
        margin: 12, filename: `Yasha-${child.name}-${today}.pdf`,
        html2canvas: { scale: 2 }, jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }).save();
      toast.success(t("toast.saved"));
    } finally { setExporting(false); }
  };

  const handleWhatsApp = () => {
    const doneCount = VACCINE_SCHEDULE.filter((v) => statusOf(v, child.dob, records[v.id]) === "done").length;
    const summary = `*Yasha — ${child.name}*\n` +
      `DOB: ${child.dob} (${years}y)\n` +
      `Height/Weight: ${child.heightCm ?? "—"} cm / ${child.weightKg ?? "—"} kg\n` +
      `BMI: ${bmi} (${bmiCat}) · P${percentile}\n` +
      `Vaccines: ${doneCount}/${VACCINE_SCHEDULE.length}\n` +
      `7-day avg: ${weeklyNutrition.calories} kcal, Fe ${weeklyNutrition.iron}mg, screen ${weeklyScreen.screen}h\n` +
      (notes ? `\nNotes: ${notes}\n` : "");
    window.open(`https://wa.me/?text=${encodeURIComponent(summary)}`, "_blank");
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">{t("report.title")}</h1>
            <p className="text-muted-foreground mt-1">{t("report.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="min-h-11 px-3 rounded-xl border border-input bg-background">
              <option value="uz">O'zbekcha</option>
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
            <button onClick={handleDownload} disabled={exporting}
              className="min-h-11 px-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary-dark inline-flex items-center gap-2 disabled:opacity-60">
              <Download className="w-4 h-4" /> PDF
            </button>
            <button onClick={handleWhatsApp}
              className="min-h-11 px-4 rounded-xl bg-[#25D366] text-white font-medium hover:opacity-90 inline-flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </button>
          </div>
        </header>

        <div className="yasha-card p-5">
          <label className="text-sm font-medium">{t("report.notes")}</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
            placeholder="…"
            className="mt-2 w-full p-3 rounded-xl border border-input bg-background" />
        </div>

        <div ref={ref} className="bg-white text-black rounded-2xl shadow-md p-8 print:shadow-none" style={{ fontFamily: "Inter, sans-serif" }}>
          <div className="border-b border-gray-300 pb-4 mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold">{t("report.title")}</h2>
              <p className="text-xs text-gray-600 mt-1">Yasha · {new Date().toLocaleDateString()}</p>
            </div>
            <span className="text-orange-600 font-bold text-xl">Yasha</span>
          </div>

          <Section title={t("report.profile")}>
            <KV k="Name" v={child.name} />
            <KV k="DOB" v={`${child.dob} (${years} yrs)`} />
            <KV k="Sex" v={child.sex} />
          </Section>

          <Section title={t("report.growthSec")}>
            <KV k={t("growth.height")} v={`${child.heightCm ?? "—"} cm`} />
            <KV k={t("growth.weight")} v={`${child.weightKg ?? "—"} kg`} />
            <KV k="BMI" v={`${bmi} (${bmiCat})`} />
            <KV k={t("growth.percentile")} v={`P${percentile}`} />
          </Section>

          <Section title={t("report.nutrSec")}>
            <KV k="Iron" v={`${weeklyNutrition.iron} / ${target.iron} mg`} />
            <KV k="Calcium" v={`${weeklyNutrition.calcium} / ${target.calcium} mg`} />
            <KV k="Vitamin D" v={`${weeklyNutrition.vitD} / ${target.vitD} IU`} />
            <KV k="Zinc" v={`${weeklyNutrition.zinc} / ${target.zinc} mg`} />
            <KV k="Protein" v={`${weeklyNutrition.protein} / ${target.protein} g`} />
            <KV k="Calories" v={`${weeklyNutrition.calories} / ${target.calories} kcal`} />
          </Section>

          <Section title={t("report.screenSec")}>
            <KV k="Avg screen / day" v={`${weeklyScreen.screen} h`} />
            <KV k="Avg outdoor / day" v={`${weeklyScreen.outdoor} h`} />
          </Section>

          <Section title={t("report.exerciseSec")}>
            <KV k="Weekly total" v={`${weeklyExercise} min`} />
          </Section>

          <Section title={t("report.vacSec")}>
            <ul className="text-sm space-y-1">
              {VACCINE_SCHEDULE.map((v) => {
                const s = statusOf(v, child.dob, records[v.id]);
                const due = dueDate(child.dob, v).toLocaleDateString();
                const rec = records[v.id];
                return (
                  <li key={v.id} className="flex justify-between border-b border-dashed border-gray-200 py-1">
                    <span>{v.name} <span className="text-gray-500">({due})</span></span>
                    <span className={s === "done" ? "text-green-700" : s === "overdue" ? "text-red-700" : "text-amber-700"}>
                      {s === "done" ? `✓ ${rec?.doneDate}` : s}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Section>

          {notes && (
            <Section title={t("report.notes")}>
              <p className="text-sm whitespace-pre-wrap">{notes}</p>
            </Section>
          )}

          <p className="text-[10px] text-gray-500 border-t border-gray-300 pt-3 mt-6">
            {t("report.disclaimer")}
          </p>
        </div>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">{title}</h3>
      <div className="text-sm">{children}</div>
    </div>
  );
}
function KV({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="flex justify-between py-1 border-b border-dashed border-gray-200">
      <span className="text-gray-600">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
