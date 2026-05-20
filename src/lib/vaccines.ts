// Uzbekistan national immunisation schedule + status helpers.

import type { Lang } from "./store";

export type Vaccine = {
  id: string;
  name: string;
  targetAge: number;
  targetUnit: "days" | "months";
  description: Record<Lang, string>;
};

export const VACCINE_SCHEDULE: Vaccine[] = [
  { id: "bcg",    name: "BCG",          targetAge: 0,  targetUnit: "days",   description: { uz: "Sil kasalligidan himoya", ru: "Защита от туберкулёза", en: "Protection against tuberculosis" } },
  { id: "hepb1",  name: "HepB (1)",     targetAge: 0,  targetUnit: "days",   description: { uz: "Gepatit B, 1-doza", ru: "Гепатит B, доза 1", en: "Hepatitis B, dose 1" } },
  { id: "hepb2",  name: "HepB (2)",     targetAge: 2,  targetUnit: "months", description: { uz: "Gepatit B, 2-doza", ru: "Гепатит B, доза 2", en: "Hepatitis B, dose 2" } },
  { id: "dtp1",   name: "DTP (1)",      targetAge: 2,  targetUnit: "months", description: { uz: "Difteriya, Ko'kyo'tal, Qoqshol", ru: "Дифтерия, Коклюш, Столбняк", en: "Diphtheria, Pertussis, Tetanus" } },
  { id: "polio1", name: "Polio (1)",    targetAge: 2,  targetUnit: "months", description: { uz: "Poliomielit, 1-doza", ru: "Полиомиелит, доза 1", en: "Polio, dose 1" } },
  { id: "dtp2",   name: "DTP (2)",      targetAge: 4,  targetUnit: "months", description: { uz: "AKD, 2-doza", ru: "АКДС, доза 2", en: "DTP, dose 2" } },
  { id: "polio2", name: "Polio (2)",    targetAge: 4,  targetUnit: "months", description: { uz: "Poliomielit, 2-doza", ru: "Полиомиелит, доза 2", en: "Polio, dose 2" } },
  { id: "hepb3",  name: "HepB (3)",     targetAge: 4,  targetUnit: "months", description: { uz: "Gepatit B, 3-doza", ru: "Гепатит B, доза 3", en: "Hepatitis B, dose 3" } },
  { id: "dtp3",   name: "DTP (3)",      targetAge: 6,  targetUnit: "months", description: { uz: "AKD, 3-doza", ru: "АКДС, доза 3", en: "DTP, dose 3" } },
  { id: "polio3", name: "Polio (3)",    targetAge: 6,  targetUnit: "months", description: { uz: "Poliomielit, 3-doza", ru: "Полиомиелит, доза 3", en: "Polio, dose 3" } },
  { id: "mmr1",   name: "MMR (1)",      targetAge: 12, targetUnit: "months", description: { uz: "Qizamiq, Epidemik parotit, Qizilcha", ru: "Корь, Паротит, Краснуха", en: "Measles, Mumps, Rubella" } },
  { id: "dtp4",   name: "DTP booster",  targetAge: 18, targetUnit: "months", description: { uz: "AKD kuchaytiruvchi doza", ru: "Ревакцинация АКДС", en: "DTP booster dose" } },
  { id: "hepa",   name: "HepA",         targetAge: 24, targetUnit: "months", description: { uz: "Gepatit A emlashi", ru: "Гепатит A", en: "Hepatitis A vaccine" } },
  { id: "typhoid",name: "Typhoid",      targetAge: 36, targetUnit: "months", description: { uz: "Tif emlashi", ru: "Брюшной тиф", en: "Typhoid vaccine" } },
  { id: "mmr2",   name: "MMR (2)",      targetAge: 72, targetUnit: "months", description: { uz: "QQQ, 2-doza (6 yosh)", ru: "КПК, доза 2 (6 лет)", en: "MMR, dose 2 (age 6)" } },
];

export type VaccineRecord = { doneDate?: string; clinic?: string; notes?: string };
export type VaccineRecords = Record<string, VaccineRecord>;

export type VaccineStatus = "done" | "overdue" | "upcoming" | "future";

export function dueDate(dob: string, v: Vaccine): Date {
  const d = new Date(dob);
  if (v.targetUnit === "days") d.setDate(d.getDate() + v.targetAge);
  else d.setMonth(d.getMonth() + v.targetAge);
  return d;
}

export function statusOf(v: Vaccine, dob: string, record?: VaccineRecord, today = new Date()): VaccineStatus {
  if (record?.doneDate) return "done";
  const due = dueDate(dob, v);
  const days = Math.floor((due.getTime() - today.getTime()) / 86400000);
  if (days < 0) return "overdue";
  if (days <= 30) return "upcoming";
  return "future";
}
