// Eye-health module data: symptoms checklist, eye exercises, and age guidelines.

import type { Lang } from "./store";

export const EYE_SYMPTOMS = [
  { id: "dry",       weight: 1, label: { uz: "Ko'z quruqligi yoki achishishi", ru: "Сухость или жжение глаз", en: "Dry or burning eyes" } },
  { id: "squint",    weight: 2, label: { uz: "Ko'zni qisinqirash", ru: "Прищуривание", en: "Squinting to see clearly" } },
  { id: "headache",  weight: 2, label: { uz: "Ko'z atrofida bosh og'rig'i", ru: "Головная боль вокруг глаз", en: "Headaches around the eyes" } },
  { id: "blur",      weight: 3, label: { uz: "Xiralashgan ko'rish", ru: "Размытое зрение", en: "Blurry vision" } },
  { id: "rub",       weight: 1, label: { uz: "Ko'zni tez-tez ishqalash", ru: "Частое трение глаз", en: "Frequent eye rubbing" } },
  { id: "sensitive", weight: 2, label: { uz: "Yorug'likka sezgirlik", ru: "Чувствительность к свету", en: "Sensitivity to light" } },
  { id: "double",    weight: 3, label: { uz: "Qo'sh ko'rish", ru: "Двоение в глазах", en: "Double vision" } },
  { id: "distance",  weight: 3, label: { uz: "Uzoqdagi narsalarni ko'rish qiyinligi", ru: "Трудности с видением вдаль", en: "Difficulty seeing distant objects" } },
] as const;

export type EyeExercise = {
  id: string;
  duration: number; // seconds
  icon: string;
  name: Record<Lang, string>;
  steps: Record<Lang, string[]>;
};

export const EYE_EXERCISES: EyeExercise[] = [
  {
    id: "palming", duration: 120, icon: "🤲",
    name: { uz: "Palming", ru: "Пальминг", en: "Palming" },
    steps: {
      uz: ["Qo'llaringizni ishqalab isilting", "Ko'zlaringizni yoping", "Iliq kaftlaringizni ko'zlaringizga qo'ying", "2 daqiqa qorong'ida dam oling"],
      ru: ["Разогрейте ладони, потерев их друг о друга", "Закройте глаза", "Приложите тёплые ладони к глазам", "Отдыхайте в темноте 2 минуты"],
      en: ["Rub your hands together to warm them", "Close your eyes", "Cup your warm palms over your eyes", "Rest in darkness for 2 minutes"],
    },
  },
  {
    id: "rolling", duration: 60, icon: "👁",
    name: { uz: "Ko'z aylantirilishi", ru: "Вращение глаз", en: "Eye rolling" },
    steps: {
      uz: ["Ko'zlaringizni sekin soat yo'nalishi bo'yicha aylantiring", "5 marta takrorlang", "Teskari yo'nalishda 5 marta aylantiring"],
      ru: ["Медленно вращайте глазами по часовой стрелке", "Повторите 5 раз", "Вращайте против часовой стрелки 5 раз"],
      en: ["Slowly rotate your eyes clockwise", "Repeat 5 times", "Rotate counter-clockwise 5 times"],
    },
  },
  {
    id: "focus", duration: 60, icon: "🎯",
    name: { uz: "Uzoq-yaqin fokus", ru: "Фокус вдаль-вблизь", en: "Near-far focus" },
    steps: {
      uz: ["Barmog'ingizni 25 sm masofada ushlab turing", "Barmog'ingizga 5 soniya qarang", "Keyin uzoqqa 5 soniya qarang", "10 marta takrorlang"],
      ru: ["Держите палец в 25 см от лица", "Смотрите на палец 5 секунд", "Затем смотрите вдаль 5 секунд", "Повторите 10 раз"],
      en: ["Hold your finger 25 cm from your face", "Focus on your finger for 5 seconds", "Then focus on something far away for 5 seconds", "Repeat 10 times"],
    },
  },
  {
    id: "blinking", duration: 30, icon: "😑",
    name: { uz: "Ko'p marta qirpillatish", ru: "Частое моргание", en: "Blinking exercise" },
    steps: {
      uz: ["30 soniya tez-tez qirpillating", "Ko'zni nam saqlaydi", "Ekran oldida har 20 daqiqada bajaring"],
      ru: ["Быстро моргайте 30 секунд", "Увлажняет глаза", "Выполняйте каждые 20 минут у экрана"],
      en: ["Blink rapidly for 30 seconds", "This lubricates your eyes", "Do this every 20 minutes at a screen"],
    },
  },
];

export const AGE_SCREEN_GUIDELINES: Array<{ id: string; emoji: string; age: Record<Lang, string>; limit: Record<Lang, string>; color: string }> = [
  { id: "under2", emoji: "👶", color: "#EF4444", age: { uz: "2 yoshgacha", ru: "до 2 лет", en: "Under 2" }, limit: { uz: "Ekran vaqti yo'q", ru: "Без экрана", en: "No screen time" } },
  { id: "2to5",   emoji: "🧒", color: "#F59E0B", age: { uz: "2–5 yosh", ru: "2–5 лет", en: "2–5 years" }, limit: { uz: "Kuniga 1 soat", ru: "1 час в день", en: "1 hour per day" } },
  { id: "6to12",  emoji: "👦", color: "#22C55E", age: { uz: "6–12 yosh", ru: "6–12 лет", en: "6–12 years" }, limit: { uz: "Kuniga 2 soat", ru: "2 часа в день", en: "2 hours per day" } },
  { id: "teens",  emoji: "🧑", color: "#0D9488", age: { uz: "13–18 yosh", ru: "13–18 лет", en: "13–18 years" }, limit: { uz: "Muvozanatli foydalanish", ru: "Сбалансированно", en: "Balanced use" } },
];

export type ScreenLog = Record<string, { phone: number; tablet: number; tv: number; computer: number; outdoor: number }>;
export function emptyScreenDay() { return { phone: 0, tablet: 0, tv: 0, computer: 0, outdoor: 0 }; }
