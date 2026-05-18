export const sampleChild = {
  name: "Amir",
  dob: "2019-03-15",
  sex: "male" as const,
  heightCm: 102,
  weightKg: 16.5,
};

export type Food = {
  name: string;
  iron: number;
  calcium: number;
  vitaminD: number;
  zinc: number;
  protein: number;
};

export const sampleFoods: Food[] = [
  { name: "Plov", iron: 2.1, calcium: 28, vitaminD: 0, zinc: 1.2, protein: 8.4 },
  { name: "Jigar (Liver)", iron: 6.5, calcium: 11, vitaminD: 49, zinc: 4.0, protein: 26 },
  { name: "Somsa", iron: 1.4, calcium: 30, vitaminD: 0, zinc: 0.9, protein: 9 },
  { name: "Shurpa", iron: 1.8, calcium: 22, vitaminD: 0, zinc: 1.5, protein: 12 },
  { name: "Pomegranate", iron: 0.3, calcium: 10, vitaminD: 0, zinc: 0.4, protein: 1.7 },
  { name: "Spinach", iron: 2.7, calcium: 99, vitaminD: 0, zinc: 0.5, protein: 2.9 },
  { name: "Egg", iron: 1.2, calcium: 56, vitaminD: 41, zinc: 1.3, protein: 13 },
  { name: "Lentils", iron: 3.3, calcium: 19, vitaminD: 0, zinc: 1.3, protein: 9 },
  { name: "Non (bread)", iron: 1.2, calcium: 26, vitaminD: 0, zinc: 0.6, protein: 6.5 },
  { name: "Manti", iron: 1.6, calcium: 25, vitaminD: 0, zinc: 1.1, protein: 10 },
  { name: "Lagman", iron: 1.9, calcium: 32, vitaminD: 0, zinc: 1.4, protein: 11 },
  { name: "Dimlama", iron: 1.5, calcium: 35, vitaminD: 0, zinc: 1.0, protein: 9.5 },
  { name: "Chuchvara", iron: 1.7, calcium: 22, vitaminD: 0, zinc: 1.2, protein: 10 },
  { name: "Norin", iron: 2.0, calcium: 18, vitaminD: 0, zinc: 1.6, protein: 14 },
  { name: "Mastava", iron: 1.6, calcium: 26, vitaminD: 0, zinc: 1.1, protein: 8 },
];

export const nutrientTargets = {
  iron: 10, calcium: 800, vitaminD: 600, zinc: 5, protein: 19,
};

export type Vaccine = { name: string; due: string; done: boolean; doneDate: string | null };

export const vaccineSchedule: Vaccine[] = [
  { name: "BCG", due: "birth", done: true, doneDate: "2019-03-15" },
  { name: "HepB (1)", due: "birth", done: true, doneDate: "2019-03-15" },
  { name: "HepB (2)", due: "2 months", done: true, doneDate: "2019-05-20" },
  { name: "DTP (1)", due: "2 months", done: true, doneDate: "2019-05-20" },
  { name: "Polio (1)", due: "2 months", done: true, doneDate: "2019-05-20" },
  { name: "DTP (2)", due: "4 months", done: true, doneDate: "2019-07-18" },
  { name: "Polio (2)", due: "4 months", done: true, doneDate: "2019-07-18" },
  { name: "HepB (3)", due: "4 months", done: true, doneDate: "2019-07-18" },
  { name: "DTP (3)", due: "6 months", done: true, doneDate: "2019-09-15" },
  { name: "Polio (3)", due: "6 months", done: true, doneDate: "2019-09-15" },
  { name: "MMR (1)", due: "12 months", done: true, doneDate: "2020-03-20" },
  { name: "DTP Booster", due: "18 months", done: false, doneDate: null },
  { name: "HepA", due: "24 months", done: false, doneDate: null },
  { name: "Typhoid", due: "3 years", done: false, doneDate: null },
  { name: "MMR (2)", due: "6 years", done: false, doneDate: null },
];

// WHO height-for-age (boys) percentile sample curves (cm) by age years
export const whoHeightBoys = Array.from({ length: 19 }).map((_, age) => {
  const base = 50 + age * 6.5 - age * age * 0.08;
  return {
    age,
    p5: +(base - 5).toFixed(1),
    p15: +(base - 3).toFixed(1),
    p50: +base.toFixed(1),
    p85: +(base + 3).toFixed(1),
    p95: +(base + 5).toFixed(1),
  };
});

export const deficiencyQuestions = [
  { id: "tired", q: { en: "Does your child seem unusually tired or pale?", uz: "Bolangiz juda charchagan yoki rangsiz ko'rinadimi?", ru: "Ребёнок выглядит уставшим или бледным?" }, maps: ["iron", "b12"] },
  { id: "colds", q: { en: "Do they get frequent colds?", uz: "Tez-tez shamollaydimi?", ru: "Часто простужается?" }, maps: ["vitD", "zinc"] },
  { id: "nails", q: { en: "Brittle nails or hair loss?", uz: "Tirnoqlari sinuvchanmi yoki sochi to'kiladimi?", ru: "Ломкие ногти или выпадение волос?" }, maps: ["iron", "zinc"] },
  { id: "mood", q: { en: "Often irritable without clear reason?", uz: "Sababsiz asabiymi?", ru: "Часто раздражителен без причины?" }, maps: ["b12", "iron"] },
  { id: "bone", q: { en: "Complains of bone or muscle pain?", uz: "Suyak yoki mushak og'rig'idan shikoyat qiladimi?", ru: "Жалуется на боль в костях/мышцах?" }, maps: ["vitD"] },
  { id: "appetite", q: { en: "Is their appetite poor?", uz: "Ishtahasi yomonmi?", ru: "Плохой аппетит?" }, maps: ["zinc", "iron"] },
  { id: "growth", q: { en: "Slower growth than peers?", uz: "Tengdoshlaridan sekin o'sadimi?", ru: "Растёт медленнее сверстников?" }, maps: ["iodine", "zinc"] },
  { id: "focus", q: { en: "Trouble concentrating at school?", uz: "Diqqatini jamlay olmaydimi?", ru: "Трудно сосредоточиться?" }, maps: ["iron", "iodine"] },
  { id: "tongue", q: { en: "Sore tongue or mouth?", uz: "Tili yoki og'zi og'riydimi?", ru: "Болит язык или рот?" }, maps: ["b12"] },
  { id: "sun", q: { en: "Less than 30 min outdoor sunlight daily?", uz: "Kuniga 30 daqiqadan kam quyoshda bo'ladimi?", ru: "Менее 30 мин на солнце в день?" }, maps: ["vitD"] },
  { id: "dairy", q: { en: "Rarely eats dairy or leafy greens?", uz: "Sut va ko'katlarni kam iste'mol qiladimi?", ru: "Редко ест молочное или зелень?" }, maps: ["calcium", "iron"] },
  { id: "meat", q: { en: "Rarely eats meat, liver, or eggs?", uz: "Go'sht, jigar yoki tuxumni kam yeydimi?", ru: "Редко ест мясо, печень, яйца?" }, maps: ["iron", "b12"] },
];

export const deficiencyFixes: Record<string, { label: string; foods: string[] }> = {
  iron: { label: "Iron", foods: ["Jigar (liver)", "Pomegranate", "Spinach", "Lentils", "Red meat"] },
  vitD: { label: "Vitamin D", foods: ["Sunlight 20+ min/day", "Egg yolk", "Fortified milk", "Fatty fish"] },
  iodine: { label: "Iodine", foods: ["Iodized salt", "Dairy", "Eggs"] },
  zinc: { label: "Zinc", foods: ["Manti (lamb)", "Lentils", "Pumpkin seeds", "Egg"] },
  b12: { label: "Vitamin B12", foods: ["Jigar", "Eggs", "Dairy", "Beef"] },
  calcium: { label: "Calcium", foods: ["Yogurt", "Cheese (suzma)", "Spinach", "Milk"] },
};
