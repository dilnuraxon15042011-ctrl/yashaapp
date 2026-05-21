import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import AppShell from "@/components/AppShell";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { Plus, X, Sparkles, Search } from "lucide-react";
import { toast } from "sonner";
import { STORE_KEYS, useLocalState, useChild, ageYears, todayKey, type Lang } from "@/lib/store";
import { FOODS, targetForAge, emptyDay, sumDay, type NutritionLog, type DayMeals, type Nutrient } from "@/lib/foods";

export const Route = createFileRoute("/nutrition")({ component: Nutrition });

type Meal = keyof DayMeals;
const MEALS: Meal[] = ["breakfast", "lunch", "dinner", "snack"];

function Nutrition() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.slice(0, 2) || "uz") as Lang;
  const [child] = useChild();
  const years = ageYears(child.dob);
  const target = targetForAge(years);

  const [date, setDate] = useState(todayKey());
  const [log, setLog] = useLocalState<NutritionLog>(STORE_KEYS.nutritionLog, {});
  const day = log[date] ?? emptyDay();
  const setDay = (patch: (d: DayMeals) => DayMeals) =>
    setLog((prev) => ({ ...prev, [date]: patch(prev[date] ?? emptyDay()) }));

  const [search, setSearch] = useState("");
  const [pickerMeal, setPickerMeal] = useState<Meal>("breakfast");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return FOODS;
    return FOODS.filter((f) => f.name[lang].toLowerCase().includes(q));
  }, [search, lang]);

  const addFood = (foodId: number) => {
    setDay((d) => ({ ...d, [pickerMeal]: [...d[pickerMeal], { foodId, portion: 1 }] }));
    toast.success(t("toast.added"));
  };
  const removeAt = (meal: Meal, idx: number) =>
    setDay((d) => ({ ...d, [meal]: d[meal].filter((_, i) => i !== idx) }));
  const setPortion = (meal: Meal, idx: number, portion: number) =>
    setDay((d) => ({ ...d, [meal]: d[meal].map((e, i) => (i === idx ? { ...e, portion } : e)) }));

  const totals = sumDay(day);
  const nutrients: Nutrient[] = ["iron", "calcium", "vitD", "zinc", "protein", "calories"];
  const chartData = nutrients.map((k) => {
    const val = +totals[k].toFixed(1);
    const tgt = target[k];
    const pct = (val / tgt) * 100;
    const fill = pct >= 80 ? "#22C55E" : pct >= 40 ? "#F59E0B" : "#EF4444";
    return { name: k, value: val, target: tgt, fill, pct };
  });

  const weakest = [...chartData].sort((a, b) => a.pct - b.pct)[0];
  const suggestion = weakest && weakest.pct < 60
    ? { lang: { uz: `Bugun ${weakest.name} kam — jigar, kunjut yoki yashil sabzavotlar qo'shing.`, ru: `Сегодня мало ${weakest.name} — добавьте печень, кунжут или зелень.`, en: `Low on ${weakest.name} today — try liver, sesame, or leafy greens.` }[lang] }
    : null;

  // Streak (consecutive days with any logged food)
  const streak = useMemo(() => {
    let s = 0; const d = new Date();
    for (;;) {
      const k = d.toISOString().slice(0, 10);
      const entry = log[k];
      const has = entry && (entry.breakfast.length + entry.lunch.length + entry.dinner.length + entry.snack.length) > 0;
      if (has) { s++; d.setDate(d.getDate() - 1); } else break;
    }
    return s;
  }, [log]);

  // Weekly avg chart
  const week = useMemo(() => {
    const arr: { day: string; cal: number; iron: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      const e = log[k] ?? emptyDay();
      const s = sumDay(e);
      arr.push({
        day: d.toLocaleDateString(lang === "uz" ? "uz-UZ" : lang === "ru" ? "ru-RU" : "en-US", { weekday: "short" }),
        cal: +s.calories.toFixed(0),
        iron: +s.iron.toFixed(1),
      });
    }
    return arr;
  }, [log, lang]);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">{t("nutrition.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("nutrition.subtitle")}</p>
        </header>

        <div className="flex flex-wrap gap-3 items-center yasha-card p-4">
          <label className="text-sm font-medium">{t("nutrition.date")}</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="min-h-11 px-3 rounded-xl border border-input bg-background" />
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-2xl">🔥</span>
            <strong>{streak}</strong> {t("nutrition.streak")}
          </div>
        </div>

        {suggestion && (
          <div className="rounded-2xl p-4 bg-caution/20 border border-caution/40 flex gap-3 items-start">
            <Sparkles className="w-5 h-5 text-caution-foreground shrink-0 mt-0.5" />
            <p className="text-sm">{suggestion.lang}</p>
          </div>
        )}

        {/* Nutrient totals chart */}
        <div className="yasha-card p-5">
          <h2 className="font-semibold mb-3">{t("nutrition.today")} vs {t("nutrition.target")}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                {chartData.map((d) => (
                  <ReferenceLine key={d.name} y={d.target} stroke="#0D9488" strokeDasharray="4 4" />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mt-4">
            {chartData.map((d) => {
              const pct = Math.min(100, d.pct);
              const color = pct >= 80 ? "bg-safe" : pct >= 40 ? "bg-caution" : "bg-destructive";
              return (
                <div key={d.name} className="p-3 rounded-xl bg-muted">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{d.name}</div>
                  <div className="text-sm font-semibold mt-1">{d.value} / {d.target}</div>
                  <div className="mt-2 h-1.5 rounded-full bg-background overflow-hidden">
                    <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Meal sections */}
        <div className="grid md:grid-cols-2 gap-4">
          {MEALS.map((meal) => (
            <div key={meal} className="yasha-card p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold capitalize">{t(`nutrition.${meal}`)}</h3>
                <button onClick={() => setPickerMeal(meal)}
                  className={`min-h-9 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1 ${pickerMeal === meal ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-primary-light"}`}>
                  <Plus className="w-3.5 h-3.5" /> {t("nutrition.addToMeal")}
                </button>
              </div>
              {day[meal].length === 0 ? (
                <p className="text-xs text-muted-foreground py-3">{t("empty.nutrition")}</p>
              ) : (
                <ul className="space-y-2">
                  {day[meal].map((e, i) => {
                    const f = FOODS.find((x) => x.id === e.foodId)!;
                    return (
                      <li key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                        <span className="text-2xl">{f.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{f.name[lang]}</div>
                          <div className="text-[11px] text-muted-foreground">Fe {(f.iron * e.portion).toFixed(1)} · Ca {(f.calcium * e.portion).toFixed(0)} · kcal {(f.calories * e.portion).toFixed(0)}</div>
                        </div>
                        <input type="number" min={0.25} step={0.25} value={e.portion}
                          onChange={(ev) => setPortion(meal, i, Math.max(0.25, +ev.target.value))}
                          className="w-16 min-h-9 px-2 text-sm rounded-md border border-input bg-background" />
                        <button onClick={() => removeAt(meal, i)} aria-label="Remove"
                          className="min-h-9 min-w-9 grid place-items-center text-muted-foreground hover:text-destructive">
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Food picker */}
        <div className="yasha-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("nutrition.search")}
              className="flex-1 min-h-10 px-3 rounded-lg border border-input bg-background" />
            <span className="text-xs text-muted-foreground">→ {t(`nutrition.${pickerMeal}`)}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 max-h-80 overflow-auto">
            {filtered.map((f) => (
              <button key={f.id} onClick={() => addFood(f.id)}
                className="rounded-xl border border-border p-3 hover:bg-primary-light hover:border-primary text-left">
                <div className="text-3xl">{f.emoji}</div>
                <div className="text-sm font-medium mt-1 truncate">{f.name[lang]}</div>
                <div className="text-[10px] text-muted-foreground">{f.calories}kcal · Fe {f.iron}mg</div>
              </button>
            ))}
          </div>
        </div>

        {/* Week chart */}
        <div className="yasha-card p-5">
          <h2 className="font-semibold mb-3">{t("nutrition.week")}</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={week}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cal" name="kcal" fill="#F97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
