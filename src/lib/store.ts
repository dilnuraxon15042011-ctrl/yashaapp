// Persistent local state hooks + shared types for Yasha modules.
// Includes multi-child profile system. All data persists under stable keys.

import { useEffect, useState, useCallback } from "react";

export type ChildProfile = {
  id: string;
  name: string;
  dob: string; // ISO YYYY-MM-DD
  sex: "male" | "female";
  color: string; // hex
  heightCm?: number;
  weightKg?: number;
  createdAt: number;
};

export type Lang = "uz" | "ru" | "en";

export const CHILD_COLORS = ["#F97316", "#0D9488", "#8B5CF6", "#EC4899", "#10B981", "#3B82F6"];

export const STORE_KEYS = {
  lang: "yasha-lang",
  onboarded: "yasha-onboarded",
  child: "yasha-child", // legacy single child
  children: "yasha_children",
  activeChild: "yasha_active_child",
  grandparent: "yasha_grandparent_mode",
  points: "yasha_points", // { [childId]: { week: ISO, total: n, history: [{week,total}] } }
  achievements: "yasha_achievements", // { [childId]: string[] }
  challengeDone: "yasha_challenge_done", // { [dateKey]: { [childId]: true } }
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
  waterLog: "yasha_water_log", // { [childId]: { [dateKey]: glasses } }
  sleepLog: "yasha_sleep_log", // { [childId]: { [dateKey]: SleepEntry } }
  moodLog: "yasha_mood_log",   // { [childId]: { [dateKey]: MoodEntry } }
} as const;

export function todayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}
export function weekKey(d: Date = new Date()): string {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Monday=0
  x.setDate(x.getDate() - day);
  return x.toISOString().slice(0, 10);
}
export function ageMonths(dob: string): number {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return 0;
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / (30.4375 * 86400 * 1000)));
}
export function ageYears(dob: string): number {
  return +(ageMonths(dob) / 12).toFixed(1);
}

/** SSR-safe persisted state. Hydrates from localStorage after mount. */
export function useLocalState<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch { /* ignore */ }
    setHydrated(true);
  }, [key]);
  const set = useCallback((v: T | ((p: T) => T)) => {
    setValue((prev) => {
      const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [key]);
  return [value, set, hydrated];
}

/** Track post-hydration mount to avoid SSR text mismatches. */
export function useMounted(): boolean {
  const [m, sm] = useState(false);
  useEffect(() => { sm(true); }, []);
  return m;
}

const DEFAULT_CHILD: ChildProfile = {
  id: "default", name: "Amir", dob: "2019-03-15", sex: "male",
  color: "#F97316", heightCm: 102, weightKg: 16.5, createdAt: 0,
};

/** Multi-child list (auto-seeded from legacy single child once). */
export function useChildren(): {
  children: ChildProfile[];
  activeId: string;
  active: ChildProfile;
  setActiveId: (id: string) => void;
  add: (c: Omit<ChildProfile, "id" | "createdAt">) => string;
  update: (id: string, patch: Partial<ChildProfile>) => void;
  remove: (id: string) => void;
  hydrated: boolean;
} {
  const [list, setList, h1] = useLocalState<ChildProfile[]>(STORE_KEYS.children, [DEFAULT_CHILD]);
  const [activeId, setActiveId, h2] = useLocalState<string>(STORE_KEYS.activeChild, DEFAULT_CHILD.id);
  const safe = list.length ? list : [DEFAULT_CHILD];
  const active = safe.find((c) => c.id === activeId) ?? safe[0];
  return {
    children: safe,
    activeId: active.id,
    active,
    setActiveId,
    add: (c) => {
      const id = (typeof crypto !== "undefined" && "randomUUID" in crypto) ? crypto.randomUUID() : `c${Date.now()}`;
      setList((p) => [...p, { ...c, id, createdAt: Date.now() }]);
      setActiveId(id);
      return id;
    },
    update: (id, patch) => setList((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c))),
    remove: (id) => setList((p) => {
      const n = p.filter((c) => c.id !== id);
      if (n.length === 0) return [DEFAULT_CHILD];
      if (id === activeId) setActiveId(n[0].id);
      return n;
    }),
    hydrated: h1 && h2,
  };
}

/** Backwards-compatible single-child hook (returns active child). */
export function useChild(): [ChildProfile, (v: ChildProfile | ((p: ChildProfile) => ChildProfile)) => void, boolean] {
  const { active, update, hydrated } = useChildren();
  const setter = useCallback((v: ChildProfile | ((p: ChildProfile) => ChildProfile)) => {
    const next = typeof v === "function" ? (v as (p: ChildProfile) => ChildProfile)(active) : v;
    update(active.id, next);
  }, [active, update]);
  return [active, setter, hydrated];
}

export function getLang(): Lang {
  if (typeof window === "undefined") return "uz";
  const v = localStorage.getItem(STORE_KEYS.lang);
  if (v === "uz" || v === "ru" || v === "en") return v;
  return "uz";
}
