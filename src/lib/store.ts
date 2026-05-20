// Lightweight localStorage state hook + shared types for Yasha modules.
// All data persists under stable keys, with safe SSR fallback.

import { useEffect, useState, useCallback } from "react";

export type ChildProfile = {
  name: string;
  dob: string; // ISO date YYYY-MM-DD
  sex: "male" | "female";
  heightCm?: number;
  weightKg?: number;
};

export type Lang = "uz" | "ru" | "en";

export const STORE_KEYS = {
  lang: "yasha-lang",
  onboarded: "yasha-onboarded",
  child: "yasha-child",
  nutritionLog: "yasha_nutrition_log",
  growthLog: "yasha_growth_log",
  deficiencyAnswers: "yasha_deficiency_answers",
  vaccineRecords: "yasha_vaccine_records",
  screenLog: "yasha_screen_log",
  exerciseLog: "yasha_exercise_log",
  exerciseGoal: "yasha_exercise_goal",
  eyeSymptoms: "yasha_eye_symptoms",
  eyeExerciseLog: "yasha_eye_exercise_log",
  twentyStreak: "yasha_20_20_20_streak",
  twentyHistory: "yasha_20_20_20_history",
  twentyEnabled: "yasha_20_20_20_enabled",
  reportNotes: "yasha_report_notes",
} as const;

export function todayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function ageMonths(dob: string): number {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return 0;
  const diff = Date.now() - d.getTime();
  return Math.max(0, Math.floor(diff / (30.4375 * 86400 * 1000)));
}
export function ageYears(dob: string): number {
  return +(ageMonths(dob) / 12).toFixed(1);
}

/** Hook: persisted state in localStorage with hydration-safe init. */
export function useLocalState<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [key]);

  const set = useCallback(
    (v: T | ((p: T) => T)) => {
      setValue((prev) => {
        const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [key],
  );

  return [value, set, hydrated];
}

/** Convenience hook for the active child profile. */
export function useChild(): [ChildProfile, (v: ChildProfile | ((p: ChildProfile) => ChildProfile)) => void, boolean] {
  return useLocalState<ChildProfile>(STORE_KEYS.child, {
    name: "Amir",
    dob: "2019-03-15",
    sex: "male",
    heightCm: 102,
    weightKg: 16.5,
  });
}

export function getLang(): Lang {
  if (typeof window === "undefined") return "uz";
  const v = localStorage.getItem(STORE_KEYS.lang);
  if (v === "uz" || v === "ru" || v === "en") return v;
  return "uz";
}
