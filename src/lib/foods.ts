// 30 Uzbek foods with full nutrient profile, and WHO-aligned daily targets by age band.

import type { Lang } from "./store";

export type Food = {
  id: number;
  name: Record<Lang, string>;
  emoji: string;
  iron: number; // mg per serving
  calcium: number; // mg
  vitD: number; // IU
  zinc: number; // mg
  protein: number; // g
  carbs: number; // g
  calories: number; // kcal
};

export const FOODS: Food[] = [
  { id: 1,  name: { uz: "Plov", ru: "Плов", en: "Plov" }, emoji: "🍚", iron: 2.1, calcium: 28, vitD: 0, zinc: 1.2, protein: 8.4, carbs: 35, calories: 280 },
  { id: 2,  name: { uz: "Jigar", ru: "Печень", en: "Liver" }, emoji: "🥩", iron: 6.5, calcium: 11, vitD: 49, zinc: 4.0, protein: 26, carbs: 4, calories: 175 },
  { id: 3,  name: { uz: "Somsa", ru: "Самса", en: "Samsa" }, emoji: "🥟", iron: 1.4, calcium: 30, vitD: 0, zinc: 0.9, protein: 9, carbs: 28, calories: 220 },
  { id: 4,  name: { uz: "Shurpa", ru: "Шурпа", en: "Shurpa soup" }, emoji: "🍲", iron: 1.8, calcium: 22, vitD: 0, zinc: 1.5, protein: 12, carbs: 12, calories: 145 },
  { id: 5,  name: { uz: "Anor", ru: "Гранат", en: "Pomegranate" }, emoji: "🍎", iron: 0.3, calcium: 10, vitD: 0, zinc: 0.4, protein: 1.7, carbs: 19, calories: 83 },
  { id: 6,  name: { uz: "Shpinat", ru: "Шпинат", en: "Spinach" }, emoji: "🥬", iron: 2.7, calcium: 99, vitD: 0, zinc: 0.5, protein: 2.9, carbs: 3.6, calories: 23 },
  { id: 7,  name: { uz: "Tuxum", ru: "Яйцо", en: "Egg" }, emoji: "🥚", iron: 1.2, calcium: 56, vitD: 41, zinc: 1.3, protein: 13, carbs: 1.1, calories: 143 },
  { id: 8,  name: { uz: "Yasmiq", ru: "Чечевица", en: "Lentils" }, emoji: "🫘", iron: 3.3, calcium: 19, vitD: 0, zinc: 1.3, protein: 9, carbs: 20, calories: 116 },
  { id: 9,  name: { uz: "Non", ru: "Лепёшка", en: "Non bread" }, emoji: "🫓", iron: 1.2, calcium: 26, vitD: 0, zinc: 0.6, protein: 6.5, carbs: 40, calories: 200 },
  { id: 10, name: { uz: "Manti", ru: "Манты", en: "Manti" }, emoji: "🥟", iron: 1.6, calcium: 25, vitD: 0, zinc: 1.1, protein: 10, carbs: 22, calories: 185 },
  { id: 11, name: { uz: "Lagman", ru: "Лагман", en: "Lagman" }, emoji: "🍜", iron: 2.0, calcium: 35, vitD: 0, zinc: 1.4, protein: 14, carbs: 38, calories: 260 },
  { id: 12, name: { uz: "Dimlama", ru: "Димлама", en: "Dimlama" }, emoji: "🫕", iron: 1.9, calcium: 40, vitD: 0, zinc: 1.3, protein: 11, carbs: 18, calories: 195 },
  { id: 13, name: { uz: "Mastava", ru: "Мастава", en: "Mastava" }, emoji: "🍲", iron: 1.5, calcium: 30, vitD: 0, zinc: 1.0, protein: 9, carbs: 25, calories: 160 },
  { id: 14, name: { uz: "Chuchvara", ru: "Чучвара", en: "Chuchvara" }, emoji: "🥟", iron: 1.3, calcium: 22, vitD: 0, zinc: 0.9, protein: 8, carbs: 20, calories: 155 },
  { id: 15, name: { uz: "Qovoq", ru: "Тыква", en: "Pumpkin" }, emoji: "🎃", iron: 0.8, calcium: 21, vitD: 0, zinc: 0.3, protein: 1, carbs: 7, calories: 26 },
  { id: 16, name: { uz: "Sut", ru: "Молоко", en: "Milk" }, emoji: "🥛", iron: 0.1, calcium: 120, vitD: 40, zinc: 0.5, protein: 3.4, carbs: 5, calories: 61 },
  { id: 17, name: { uz: "Tvorog", ru: "Творог", en: "Cottage cheese" }, emoji: "🧀", iron: 0.2, calcium: 83, vitD: 0, zinc: 0.4, protein: 11, carbs: 3, calories: 98 },
  { id: 18, name: { uz: "Baliq", ru: "Рыба", en: "Fish" }, emoji: "🐟", iron: 0.9, calcium: 20, vitD: 200, zinc: 0.6, protein: 20, carbs: 0, calories: 130 },
  { id: 19, name: { uz: "Tovuq go'shti", ru: "Курица", en: "Chicken" }, emoji: "🍗", iron: 1.0, calcium: 15, vitD: 5, zinc: 1.0, protein: 25, carbs: 0, calories: 165 },
  { id: 20, name: { uz: "Sabzi", ru: "Морковь", en: "Carrot" }, emoji: "🥕", iron: 0.3, calcium: 33, vitD: 0, zinc: 0.2, protein: 0.9, carbs: 10, calories: 41 },
  { id: 21, name: { uz: "Kartoshka", ru: "Картофель", en: "Potato" }, emoji: "🥔", iron: 0.8, calcium: 12, vitD: 0, zinc: 0.3, protein: 2, carbs: 17, calories: 77 },
  { id: 22, name: { uz: "Pomidor", ru: "Помидор", en: "Tomato" }, emoji: "🍅", iron: 0.3, calcium: 10, vitD: 0, zinc: 0.2, protein: 0.9, carbs: 4, calories: 18 },
  { id: 23, name: { uz: "Bodring", ru: "Огурец", en: "Cucumber" }, emoji: "🥒", iron: 0.3, calcium: 16, vitD: 0, zinc: 0.2, protein: 0.7, carbs: 4, calories: 15 },
  { id: 24, name: { uz: "O'rik", ru: "Абрикос", en: "Apricot" }, emoji: "🍑", iron: 0.4, calcium: 13, vitD: 0, zinc: 0.2, protein: 1.4, carbs: 11, calories: 48 },
  { id: 25, name: { uz: "Uzum", ru: "Виноград", en: "Grapes" }, emoji: "🍇", iron: 0.4, calcium: 10, vitD: 0, zinc: 0.1, protein: 0.7, carbs: 18, calories: 69 },
  { id: 26, name: { uz: "Yong'oq", ru: "Грецкий орех", en: "Walnuts" }, emoji: "🥜", iron: 2.9, calcium: 98, vitD: 0, zinc: 3.0, protein: 15, carbs: 14, calories: 654 },
  { id: 27, name: { uz: "Bodom", ru: "Миндаль", en: "Almonds" }, emoji: "🌰", iron: 3.7, calcium: 264, vitD: 0, zinc: 3.1, protein: 21, carbs: 22, calories: 579 },
  { id: 28, name: { uz: "Kunjut", ru: "Кунжут", en: "Sesame" }, emoji: "🌱", iron: 14.6, calcium: 975, vitD: 0, zinc: 7.8, protein: 18, carbs: 23, calories: 573 },
  { id: 29, name: { uz: "Limon", ru: "Лимон", en: "Lemon" }, emoji: "🍋", iron: 0.6, calcium: 26, vitD: 0, zinc: 0.1, protein: 1.1, carbs: 9, calories: 29 },
  { id: 30, name: { uz: "Halim", ru: "Халим", en: "Halim" }, emoji: "🍲", iron: 3.5, calcium: 42, vitD: 0, zinc: 2.2, protein: 18, carbs: 28, calories: 220 },
];

export type Nutrient = "iron" | "calcium" | "vitD" | "zinc" | "protein" | "calories";

export const TARGETS: Record<string, Record<Nutrient, number>> = {
  "1-3":  { iron: 7,  calcium: 700,  vitD: 600, zinc: 3,  protein: 13, calories: 1000 },
  "4-8":  { iron: 10, calcium: 1000, vitD: 600, zinc: 5,  protein: 19, calories: 1200 },
  "9-13": { iron: 8,  calcium: 1300, vitD: 600, zinc: 8,  protein: 34, calories: 1600 },
  "14-18":{ iron: 11, calcium: 1300, vitD: 600, zinc: 11, protein: 52, calories: 2000 },
};

export function targetForAge(years: number): Record<Nutrient, number> {
  if (years < 4) return TARGETS["1-3"];
  if (years < 9) return TARGETS["4-8"];
  if (years < 14) return TARGETS["9-13"];
  return TARGETS["14-18"];
}

export type MealEntry = { foodId: number; portion: number };
export type DayMeals = { breakfast: MealEntry[]; lunch: MealEntry[]; dinner: MealEntry[]; snack: MealEntry[] };
export type NutritionLog = Record<string, DayMeals>; // dateKey → meals

export function emptyDay(): DayMeals {
  return { breakfast: [], lunch: [], dinner: [], snack: [] };
}

export function sumDay(day: DayMeals): Record<Nutrient, number> {
  const acc: Record<Nutrient, number> = { iron: 0, calcium: 0, vitD: 0, zinc: 0, protein: 0, calories: 0 };
  const all = [...day.breakfast, ...day.lunch, ...day.dinner, ...day.snack];
  for (const e of all) {
    const f = FOODS.find((x) => x.id === e.foodId);
    if (!f) continue;
    acc.iron += f.iron * e.portion;
    acc.calcium += f.calcium * e.portion;
    acc.vitD += f.vitD * e.portion;
    acc.zinc += f.zinc * e.portion;
    acc.protein += f.protein * e.portion;
    acc.calories += f.calories * e.portion;
  }
  return acc;
}
