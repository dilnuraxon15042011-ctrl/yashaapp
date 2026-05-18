import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  uz: {
    translation: {
      brand: "Yasha",
      tagline: "Yasha — Sog'lom Yashang",
      subhead: "Har bir o'zbek oilasi uchun bepul oilaviy sog'liq monitoringi",
      nav: { home: "Bosh sahifa", dashboard: "Boshqaruv", nutrition: "Ovqatlanish", growth: "O'sish", deficiency: "Skrining", vaccination: "Emlash", screen: "Ekran sog'lig'i", report: "Hisobot", login: "Kirish", more: "Ko'proq" },
      hero: { cta: "Bepul boshlash", secondary: "Skrining (login kerak emas)" },
      footer: { disclaimer: "Yasha App faqat sog'liq haqida ma'lumot beradi. Tibbiy tashxis yoki davolanish o'rnini bosmaydi." },
      roles: { parent: "Ota-ona", doctor: "Shifokor", individual: "Shaxsiy" },
      modules: { nutrition: "Ovqatlanish", growth: "O'sish", deficiency: "Yetishmovchilik", vaccination: "Emlash", screen: "Ko'z sog'lig'i", report: "Shifokor PDF" },
      status: { good: "Yaxshi", attention: "E'tibor kerak", overdue: "Muddati o'tgan", upcoming: "Yaqinda" },
    },
  },
  ru: {
    translation: {
      brand: "Yasha",
      tagline: "Yasha — Живите здорово",
      subhead: "Бесплатный мониторинг здоровья для каждой узбекской семьи",
      nav: { home: "Главная", dashboard: "Панель", nutrition: "Питание", growth: "Рост", deficiency: "Скрининг", vaccination: "Прививки", screen: "Зрение", report: "Отчёт", login: "Войти", more: "Ещё" },
      hero: { cta: "Начать бесплатно", secondary: "Скрининг (без входа)" },
      footer: { disclaimer: "Yasha App предоставляет только справочную информацию о здоровье. Это не замена медицинской консультации." },
      roles: { parent: "Родитель", doctor: "Врач", individual: "Личный" },
      modules: { nutrition: "Питание", growth: "Рост", deficiency: "Дефициты", vaccination: "Прививки", screen: "Зрение", report: "PDF для врача" },
      status: { good: "Хорошо", attention: "Внимание", overdue: "Просрочено", upcoming: "Скоро" },
    },
  },
  en: {
    translation: {
      brand: "Yasha",
      tagline: "Yasha — Live Healthy",
      subhead: "Free family health monitoring for every Uzbek family",
      nav: { home: "Home", dashboard: "Dashboard", nutrition: "Nutrition", growth: "Growth", deficiency: "Screening", vaccination: "Vaccines", screen: "Eye Health", report: "Report", login: "Sign in", more: "More" },
      hero: { cta: "Get started free", secondary: "Try screener (no login)" },
      footer: { disclaimer: "Yasha App provides health information only. It is not a substitute for medical advice, diagnosis, or treatment." },
      roles: { parent: "Parent", doctor: "Doctor", individual: "Individual" },
      modules: { nutrition: "Nutrition", growth: "Growth", deficiency: "Deficiency", vaccination: "Vaccination", screen: "Eye Health", report: "Doctor PDF" },
      status: { good: "Up to date", attention: "Needs attention", overdue: "Overdue", upcoming: "Upcoming" },
    },
  },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: typeof window !== "undefined" ? localStorage.getItem("yasha-lang") || "uz" : "uz",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}

export default i18n;
