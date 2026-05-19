export type Lang = "uz" | "ru" | "en";

export type Exercise = {
  name: Record<Lang, string>;
  duration: number;
  icon: string;
  description: Record<Lang, string>;
};

export type AgeGroup = {
  id: string;
  label: Record<Lang, string>;
  description: Record<Lang, string>;
  exercises: Exercise[];
};

export const exerciseData: AgeGroup[] = [
  {
    id: "0-2",
    label: { uz: "0–2 yosh", ru: "0–2 года", en: "0–2 years" },
    description: {
      uz: "Bu yoshdagi bolalar uchun erkin harakat va o'yin eng yaxshi mashq.",
      ru: "Лучшая тренировка — свободное движение и игра.",
      en: "Free movement and active play is the best exercise.",
    },
    exercises: [
      { name: { uz: "Erkin o'yin", ru: "Свободная игра", en: "Free play" }, duration: 30, icon: "🧸", description: { uz: "Xona bo'ylab erkin harakat", ru: "Свободное движение по комнате", en: "Free movement around the room" } },
      { name: { uz: "Qornida yotish", ru: "На животике", en: "Tummy time" }, duration: 15, icon: "👶", description: { uz: "Bola qornida yotib bosh ko'taradi", ru: "Ребёнок лежит на животе", en: "Baby lies on tummy and lifts head" } },
    ],
  },
  {
    id: "3-5",
    label: { uz: "3–5 yosh", ru: "3–5 лет", en: "3–5 years" },
    description: {
      uz: "Kuniga kamida 3 soat faol o'yin tavsiya etiladi.",
      ru: "Не менее 3 часов активных игр в день.",
      en: "At least 3 hours of active play daily.",
    },
    exercises: [
      { name: { uz: "Sakrash", ru: "Прыжки", en: "Jumping" }, duration: 15, icon: "🦘", description: { uz: "Yerda sakrash, arqon", ru: "Прыжки на месте, со скакалкой", en: "Jumping in place, jump rope" } },
      { name: { uz: "Yugurish", ru: "Бег", en: "Running" }, duration: 20, icon: "🏃", description: { uz: "Bog'da yugurish o'yinlari", ru: "Беговые игры в парке", en: "Running games in the park" } },
      { name: { uz: "Raqs", ru: "Танец", en: "Dancing" }, duration: 15, icon: "💃", description: { uz: "Musiqa ostida raqs", ru: "Танцы под музыку", en: "Free dancing to music" } },
    ],
  },
  {
    id: "6-9",
    label: { uz: "6–9 yosh", ru: "6–9 лет", en: "6–9 years" },
    description: {
      uz: "Kuniga 60 daqiqa o'rtacha yoki intensiv faollik (WHO).",
      ru: "60 минут умеренной или интенсивной активности в день (ВОЗ).",
      en: "60 minutes of moderate to vigorous activity per day (WHO).",
    },
    exercises: [
      { name: { uz: "Velosiped", ru: "Велосипед", en: "Cycling" }, duration: 30, icon: "🚴", description: { uz: "Ko'chada velosiped", ru: "Езда на велосипеде", en: "Outdoor cycling" } },
      { name: { uz: "Suzish", ru: "Плавание", en: "Swimming" }, duration: 30, icon: "🏊", description: { uz: "Basseynda suzish", ru: "Плавание в бассейне", en: "Pool swimming" } },
      { name: { uz: "Futbol", ru: "Футбол", en: "Football" }, duration: 40, icon: "⚽", description: { uz: "Do'stlar bilan futbol", ru: "Футбол с друзьями", en: "Football with friends" } },
      { name: { uz: "Yoga (bolalar)", ru: "Детская йога", en: "Kids yoga" }, duration: 20, icon: "🧘", description: { uz: "Oddiy yoga pozalari", ru: "Простые позы йоги", en: "Simple yoga poses" } },
    ],
  },
  {
    id: "10-13",
    label: { uz: "10–13 yosh", ru: "10–13 лет", en: "10–13 years" },
    description: {
      uz: "Kuniga 60 daqiqa. Kuch mashqlari haftada 3 marta.",
      ru: "60 минут в день. Силовые 3 раза в неделю.",
      en: "60 minutes daily. Strength training 3x per week.",
    },
    exercises: [
      { name: { uz: "Basketbol", ru: "Баскетбол", en: "Basketball" }, duration: 45, icon: "🏀", description: { uz: "Komanda o'yini", ru: "Командная игра", en: "Team sport" } },
      { name: { uz: "Push-up", ru: "Отжимания", en: "Push-ups" }, duration: 10, icon: "💪", description: { uz: "Kuniga 10–15 ta", ru: "10–15 в день", en: "10–15 daily" } },
      { name: { uz: "Yugurish", ru: "Бег", en: "Running" }, duration: 20, icon: "🏃", description: { uz: "Masofa yoki sprint", ru: "На дистанцию или спринт", en: "Distance or sprints" } },
      { name: { uz: "Cho'zilish", ru: "Растяжка", en: "Stretching" }, duration: 15, icon: "🤸", description: { uz: "Mashqdan keyin cho'zilish", ru: "Растяжка после тренировки", en: "Post-exercise stretching" } },
    ],
  },
  {
    id: "14-18",
    label: { uz: "14–18 yosh", ru: "14–18 лет", en: "14–18 years" },
    description: {
      uz: "Aerob va anaerob mashqlarni birlashtiring. Dam olish ham muhim.",
      ru: "Сочетайте аэробику и силовые. Отдых тоже важен.",
      en: "Combine aerobic and strength. Rest days matter too.",
    },
    exercises: [
      { name: { uz: "Og'irlik mashqlari", ru: "Силовые", en: "Strength training" }, duration: 40, icon: "🏋️", description: { uz: "Zalda yoki uyda", ru: "В зале или дома", en: "Gym or home" } },
      { name: { uz: "5 km yugurish", ru: "Бег 5 км", en: "5 km run" }, duration: 30, icon: "🏃", description: { uz: "Erta tong yoki kechqurun", ru: "Утром или вечером", en: "Morning or evening" } },
      { name: { uz: "Suzish", ru: "Плавание", en: "Swimming" }, duration: 45, icon: "🏊", description: { uz: "To'liq tana mashqi", ru: "Полная тренировка тела", en: "Full body workout" } },
      { name: { uz: "Yoga / Meditatsiya", ru: "Йога / Медитация", en: "Yoga / Meditation" }, duration: 20, icon: "🧘", description: { uz: "Aqliy salomatlik uchun", ru: "Для психики", en: "For mental wellness" } },
    ],
  },
];
