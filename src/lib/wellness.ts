// Wellness data: water, sleep, mood, challenges, achievements, health facts.
// Consolidated to keep the module surface small.

import type { Lang } from "./store";

// ============ WATER ============
export const WATER_TARGETS: Record<string, number> = { "1-3": 5, "4-8": 6, "9-13": 8, "14-18": 10 };
export function waterTargetFor(years: number): number {
  if (years < 4) return WATER_TARGETS["1-3"];
  if (years < 9) return WATER_TARGETS["4-8"];
  if (years < 14) return WATER_TARGETS["9-13"];
  return WATER_TARGETS["14-18"];
}

// ============ SLEEP ============
export type SleepEntry = { bedtime: string; wakeTime: string; durationHours: number; quality: 1|2|3|4|5; notes?: string };
export type SleepBand = { key: string; minMonths: number; maxMonths: number; min: number; max: number; label: Record<Lang, string> };
export const SLEEP_BANDS: SleepBand[] = [
  { key: "0-3m",  minMonths: 0,   maxMonths: 4,    min: 14, max: 17, label: { uz: "0–3 oy", ru: "0–3 мес", en: "0–3 months" } },
  { key: "4-11m", minMonths: 4,   maxMonths: 12,   min: 12, max: 15, label: { uz: "4–11 oy", ru: "4–11 мес", en: "4–11 months" } },
  { key: "1-2y",  minMonths: 12,  maxMonths: 36,   min: 11, max: 14, label: { uz: "1–2 yosh", ru: "1–2 года", en: "1–2 years" } },
  { key: "3-5y",  minMonths: 36,  maxMonths: 72,   min: 10, max: 13, label: { uz: "3–5 yosh", ru: "3–5 лет", en: "3–5 years" } },
  { key: "6-12y", minMonths: 72,  maxMonths: 156,  min: 9,  max: 11, label: { uz: "6–12 yosh", ru: "6–12 лет", en: "6–12 years" } },
  { key: "13-18y",minMonths: 156, maxMonths: 1000, min: 8,  max: 10, label: { uz: "13–18 yosh", ru: "13–18 лет", en: "13–18 years" } },
];
export function sleepTargetFor(months: number): SleepBand {
  return SLEEP_BANDS.find((b) => months >= b.minMonths && months < b.maxMonths) ?? SLEEP_BANDS[3];
}
export function computeSleepHours(bedtime: string, wakeTime: string): number {
  const [bh, bm] = bedtime.split(":").map(Number);
  const [wh, wm] = wakeTime.split(":").map(Number);
  if ([bh, bm, wh, wm].some((n) => Number.isNaN(n))) return 0;
  let mins = (wh * 60 + wm) - (bh * 60 + bm);
  if (mins <= 0) mins += 24 * 60;
  return +(mins / 60).toFixed(2);
}

// ============ MOOD ============
export type MoodEntry = { mood: 1|2|3|4|5; emotions: string[]; note?: string };
export type Emotion = { id: string; emoji: string; label: Record<Lang, string>; positive: boolean };
export const EMOTIONS: Emotion[] = [
  { id: "happy",     emoji: "😄", positive: true,  label: { uz: "Xursand",    ru: "Счастливый",    en: "Happy" } },
  { id: "excited",   emoji: "🤩", positive: true,  label: { uz: "Hayajonli",  ru: "Взволнованный", en: "Excited" } },
  { id: "calm",      emoji: "😌", positive: true,  label: { uz: "Tinch",      ru: "Спокойный",     en: "Calm" } },
  { id: "proud",     emoji: "🦁", positive: true,  label: { uz: "Mag'rur",    ru: "Гордый",        en: "Proud" } },
  { id: "loved",     emoji: "🥰", positive: true,  label: { uz: "Sevimli",    ru: "Любимый",       en: "Loved" } },
  { id: "energetic", emoji: "⚡", positive: true,  label: { uz: "Energiyali", ru: "Энергичный",    en: "Energetic" } },
  { id: "sad",       emoji: "😢", positive: false, label: { uz: "Xafa",       ru: "Грустный",      en: "Sad" } },
  { id: "anxious",   emoji: "😰", positive: false, label: { uz: "Xavotirli",  ru: "Тревожный",     en: "Anxious" } },
  { id: "tired",     emoji: "😴", positive: false, label: { uz: "Charchagan", ru: "Уставший",      en: "Tired" } },
  { id: "angry",     emoji: "😠", positive: false, label: { uz: "G'azablangan", ru: "Злой",        en: "Angry" } },
  { id: "lonely",    emoji: "🫂", positive: false, label: { uz: "Yolg'iz",    ru: "Одинокий",      en: "Lonely" } },
  { id: "scared",    emoji: "😨", positive: false, label: { uz: "Qo'rqqan",   ru: "Испуганный",    en: "Scared" } },
];
export const MOOD_RESPONSES: Record<number, Record<Lang, string>> = {
  5: { uz: "Zo'r! Bugun baxtli kunlardansiz! 🌟", ru: "Здорово! Сегодня счастливый день! 🌟", en: "Amazing! Keep that energy! 🌟" },
  4: { uz: "Yaxshi kayfiyat! Davom eting 😊", ru: "Хорошее настроение! Так держать 😊", en: "Good mood today — keep going 😊" },
  3: { uz: "Oddiy kun — bu ham yaxshi 🌤", ru: "Обычный день — это нормально 🌤", en: "An ordinary day — that's okay 🌤" },
  2: { uz: "Bugun qiyin tuyulyapti. Yasha siz bilan 🤗", ru: "Сегодня непросто. Яша рядом 🤗", en: "Today feels tough — Yasha is with you 🤗" },
  1: { uz: "Og'ir kun. Yaqinlaringiz bilan gaplashing 💙", ru: "Тяжёлый день. Поговорите с близкими 💙", en: "Hard day. Talking with someone you trust can help 💙" },
};
export const WELLBEING_TIPS: Record<string, Record<Lang, string>> = {
  anxious: { uz: "Xavotir paytida: 4 soniya nafas, 4 ushlab, 4 chiqaring (box breathing).", ru: "При тревоге: вдох 4 сек, задержка 4, выдох 4 (box breathing).", en: "Try box breathing: in 4s, hold 4s, out 4s." },
  tired:   { uz: "Charchaganda: 20 daqiqalik qisqa uyqu yordam beradi.", ru: "Усталость: 20-минутный сон помогает.", en: "Tired? A 20-minute power nap helps." },
  sad:     { uz: "Xafa bo'lganda: yaqin odam bilan gaplashing yoki tashqarida yuring.", ru: "Грустно: поговорите с близким или прогуляйтесь.", en: "Sad? Talk to someone close, or take a walk." },
  angry:   { uz: "G'azab paytida: 10 gacha sanang, jismoniy harakat g'azabni kamaytiradi.", ru: "Злость: считайте до 10, активность снижает агрессию.", en: "Angry? Count to 10. Movement reduces anger." },
};

// ============ DAILY CHALLENGES ============
export type Challenge = { id: string; emoji: string; points: number; category: string; title: Record<Lang, string>; description: Record<Lang, string> };
export const CHALLENGES: Challenge[] = [
  { id: "c1", emoji: "🥦", points: 25, category: "nutrition", title: { uz: "Bugun 3 xil sabzavot ye", ru: "Съешьте 3 разных овоща", en: "Eat 3 different vegetables today" }, description: { uz: "Ovqatlanish bo'limida belgilang", ru: "Отметьте в разделе Питание", en: "Log them in Nutrition" } },
  { id: "c2", emoji: "🌳", points: 25, category: "exercise",  title: { uz: "30 daqiqa tashqarida o'yna", ru: "30 минут игр на улице", en: "Play outside for 30 minutes" }, description: { uz: "Mashqlar bo'limida", ru: "В разделе Упражнения", en: "In Exercise" } },
  { id: "c3", emoji: "💧", points: 25, category: "water",     title: { uz: "Kunlik suv maqsadiga yet", ru: "Достигните дневной нормы воды", en: "Hit your water goal today" }, description: { uz: "Dashboard'da qoldiqlarni to'ldiring", ru: "Заполните капли на главной", en: "Fill all drops on dashboard" } },
  { id: "c4", emoji: "🌙", points: 25, category: "sleep",     title: { uz: "Bugun o'z vaqtida yot", ru: "Лечь спать вовремя", en: "Go to bed on time tonight" }, description: { uz: "Uyqu vaqtingizni kiriting", ru: "Введите время сна", en: "Log your bedtime" } },
  { id: "c5", emoji: "👁", points: 25, category: "eyes",     title: { uz: "20-20-20 ni 3 marta baja", ru: "Правило 20-20-20 три раза", en: "Do 20-20-20 three times today" }, description: { uz: "Ko'z salomatligi", ru: "В разделе Зрения", en: "In Eye Health" } },
  { id: "c6", emoji: "😊", points: 25, category: "mood",      title: { uz: "Bugun kayfiyatingizni belgilang", ru: "Отметьте настроение", en: "Log your mood today" }, description: { uz: "Kayfiyat bo'limi", ru: "Раздел Настроение", en: "Mood section" } },
  { id: "c7", emoji: "🧘", points: 25, category: "exercise",  title: { uz: "Bitta ko'z mashqi baja", ru: "Сделайте глазное упражнение", en: "Complete one eye exercise" }, description: { uz: "Ko'z mashqlari", ru: "Упражнения для глаз", en: "Eye Exercises" } },
  { id: "c8", emoji: "🍳", points: 25, category: "nutrition", title: { uz: "Ertangi nonushta kiriting", ru: "Запишите завтрак", en: "Log breakfast today" }, description: { uz: "Kunni sog'lom boshla", ru: "Начните день здорово", en: "Start the day healthy" } },
  { id: "c9", emoji: "🏃", points: 25, category: "exercise",  title: { uz: "15 daqiqa yugur yoki yur", ru: "15 минут бега или ходьбы", en: "15 minutes of running or walking" }, description: { uz: "Har qanday tezlik", ru: "В любом темпе", en: "Any pace counts" } },
  { id: "c10", emoji: "🥛", points: 25, category: "nutrition", title: { uz: "Sut mahsuloti iste'mol qil", ru: "Съешьте молочное", en: "Have a dairy product today" }, description: { uz: "Sut, tvorog, kefir", ru: "Молоко, творог, кефир", en: "Milk, yogurt, cottage cheese" } },
];
export function getDailyChallenge(dateKey: string): Challenge {
  const seed = parseInt(dateKey.replace(/-/g, ""), 10) % CHALLENGES.length;
  return CHALLENGES[seed];
}

// ============ ACHIEVEMENTS ============
export type Achievement = { id: string; emoji: string; tier: "bronze" | "silver" | "gold"; points: number; name: Record<Lang, string>; desc: Record<Lang, string> };
export const ACHIEVEMENTS: Achievement[] = [
  { id: "a1",  emoji: "🍽", tier: "bronze", points: 10, name: { uz: "Birinchi qadam", ru: "Первый шаг", en: "First Step" }, desc: { uz: "Birinchi ovqatni kiriting", ru: "Запишите первую еду", en: "Log your first meal" } },
  { id: "a2",  emoji: "🥗", tier: "silver", points: 30, name: { uz: "Ovqat ustasi", ru: "Мастер питания", en: "Meal Master" }, desc: { uz: "7 kun ketma-ket log", ru: "7 дней подряд", en: "Log meals 7 days in a row" } },
  { id: "a3",  emoji: "🏆", tier: "gold",   points: 75, name: { uz: "Ovqatlanish chempioni", ru: "Чемпион питания", en: "Nutrition Champion" }, desc: { uz: "30 kun ketma-ket", ru: "30 дней подряд", en: "Log meals 30 days in a row" } },
  { id: "a4",  emoji: "🌙", tier: "bronze", points: 10, name: { uz: "Yaxshi uyqu", ru: "Хороший сон", en: "Good Sleep" }, desc: { uz: "Birinchi uyquni kiriting", ru: "Запишите первый сон", en: "Log first sleep" } },
  { id: "a5",  emoji: "⭐", tier: "silver", points: 30, name: { uz: "Uyqu yulduzi", ru: "Звезда сна", en: "Sleep Star" }, desc: { uz: "5 kun maqsadga", ru: "5 ночей в норме", en: "5 nights within target" } },
  { id: "a6",  emoji: "🏃", tier: "bronze", points: 10, name: { uz: "Harakatni boshladi", ru: "Начал двигаться", en: "Got Moving" }, desc: { uz: "Birinchi mashq", ru: "Первая тренировка", en: "Complete first exercise" } },
  { id: "a7",  emoji: "💪", tier: "silver", points: 30, name: { uz: "Sport qahramoni", ru: "Спортивный герой", en: "Sport Hero" }, desc: { uz: "7 kun mashq", ru: "7 дней тренировок", en: "Exercise 7 days in a row" } },
  { id: "a8",  emoji: "💧", tier: "bronze", points: 10, name: { uz: "Suv ichuvchi", ru: "Любитель воды", en: "Water Drinker" }, desc: { uz: "Birinchi suv maqsadi", ru: "Первая водная цель", en: "Hit water goal first time" } },
  { id: "a9",  emoji: "🌊", tier: "gold",   points: 75, name: { uz: "Suv chempioni", ru: "Чемпион воды", en: "Hydration Champion" }, desc: { uz: "14 kun ketma-ket", ru: "14 дней подряд", en: "14 days in a row" } },
  { id: "a10", emoji: "💉", tier: "silver", points: 50, name: { uz: "Himoyalangan", ru: "Защищённый", en: "Protected" }, desc: { uz: "Barcha emlash bajarildi", ru: "Все прививки сделаны", en: "All vaccines up to date" } },
  { id: "a11", emoji: "😊", tier: "silver", points: 30, name: { uz: "Kayfiyat ustasi", ru: "Мастер настроения", en: "Mood Master" }, desc: { uz: "7 kun kayfiyat kiritildi", ru: "7 дней настроения", en: "Log mood 7 days" } },
  { id: "a12", emoji: "🌟", tier: "gold",   points: 100, name: { uz: "Yasha Superstar", ru: "Суперзвезда Яши", en: "Yasha Superstar" }, desc: { uz: "500 ball to'plang", ru: "Наберите 500 очков", en: "Earn 500 total points" } },
];

// ============ HEALTH FACTS ============
export type Fact = { emoji: string; text: Record<Lang, string> };
export const FACTS: Fact[] = [
  { emoji: "🧠", text: { uz: "Bolalar uyquda o'sadi — o'sish gormoni asosan tunda ishlab chiqariladi!", ru: "Дети растут во сне — гормон роста вырабатывается ночью!", en: "Children grow during sleep — growth hormone is released at night!" } },
  { emoji: "🦴", text: { uz: "Bodom, shpinat va kunjutda ham ko'p kalsiy bor.", ru: "В миндале, шпинате и кунжуте много кальция.", en: "Almonds, spinach and sesame are rich in calcium." } },
  { emoji: "☀️", text: { uz: "Kuniga 15 daqiqa quyosh — D vitamini uchun.", ru: "15 минут солнца в день — для витамина D.", en: "15 minutes of sun a day gives vitamin D." } },
  { emoji: "💧", text: { uz: "Bola tanasining 75% suvdan iborat.", ru: "75% тела ребёнка — вода.", en: "75% of a child's body is water." } },
  { emoji: "🍎", text: { uz: "Limon temir so'rilishini 3x oshiradi.", ru: "Лимон повышает усвоение железа в 3 раза.", en: "Lemon triples iron absorption." } },
  { emoji: "🧬", text: { uz: "Yod miya rivojlanishi uchun muhim — yodlangan tuz iste'mol qiling.", ru: "Йод важен для мозга — используйте йодированную соль.", en: "Iodine is vital for brain development — use iodized salt." } },
  { emoji: "👁", text: { uz: "Ko'z ham mushak — 4 ta mashq charchoqni 60% kamaytiradi.", ru: "Глаза — мышцы; 4 упражнения снижают усталость на 60%.", en: "Eyes are muscles — 4 exercises cut fatigue by 60%." } },
  { emoji: "🦷", text: { uz: "Suyaklar 25 yoshgacha rivojlanadi.", ru: "Кости формируются до 25 лет.", en: "Bones develop until age 25." } },
  { emoji: "🏃", text: { uz: "30 daqiqa o'yin miya qon oqimini 15% oshiradi.", ru: "30 минут игр улучшают кровоток в мозге на 15%.", en: "30 minutes of play boosts brain blood flow 15%." } },
  { emoji: "😴", text: { uz: "Yaxshi uyqlagan bola 3x kamroq kasallanadi.", ru: "Выспавшийся ребёнок болеет в 3 раза реже.", en: "Well-rested kids get sick 3x less often." } },
  { emoji: "🥦", text: { uz: "Brokkoli vitamin C va K manbai — immunitetni mustahkamlaydi.", ru: "Брокколи — источник витаминов C и K.", en: "Broccoli is rich in vitamin C and K." } },
  { emoji: "🍳", text: { uz: "Tuxum sariq qismida xolin bor — miya uchun foydali.", ru: "В желтке яйца есть холин — полезен для мозга.", en: "Egg yolks contain choline — great for the brain." } },
  { emoji: "🥕", text: { uz: "Sabzi A vitamini manbai — ko'rishni yaxshilaydi.", ru: "Морковь даёт витамин A — улучшает зрение.", en: "Carrots provide vitamin A for vision." } },
  { emoji: "🐟", text: { uz: "Baliqdagi Omega-3 miya rivojlanishi uchun zarur.", ru: "Омега-3 в рыбе важна для мозга.", en: "Omega-3 in fish supports brain growth." } },
  { emoji: "🥜", text: { uz: "Yong'oqlar magniy bilan boy — asab tizimini tinchlantiradi.", ru: "Орехи богаты магнием — успокаивают нервы.", en: "Nuts are rich in magnesium — calms nerves." } },
];
export function getDailyFact(dateKey: string): Fact {
  const seed = parseInt(dateKey.replace(/-/g, ""), 10);
  return FACTS[seed % FACTS.length];
}

// ============ POINTS (per child, per week) ============
export type PointsState = Record<string, { week: string; total: number; history: { week: string; total: number }[] }>;
export const POINT_VALUES = {
  mealLogged: 5, growthLogged: 10, vaccineMarked: 20, exerciseDone: 8,
  sleepLogged: 5, sleepOnTarget: 10, moodLogged: 3, waterTarget: 10,
  challengeCompleted: 25, streakBonus: 15,
} as const;
