import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const uz = {
  brand: "Yasha",
  tagline: "Yasha — Sog'lom Yashang",
  subhead: "Har bir o'zbek oilasi uchun bepul oilaviy sog'liq monitoringi",
  nav: { home: "Bosh sahifa", dashboard: "Boshqaruv", nutrition: "Ovqatlanish", growth: "O'sish", deficiency: "Skrining", vaccination: "Emlash", exercise: "Mashqlar", screen: "Ko'z sog'lig'i", report: "Hisobot", login: "Kirish", more: "Ko'proq" },
  hero: { cta: "Bepul boshlash", secondary: "Skrining (login kerak emas)" },
  footer: { disclaimer: "Yasha App faqat ma'lumot beradi. Bu tibbiy maslahat, tashxis yoki davolash o'rnini bosa olmaydi." },
  roles: { parent: "Ota-ona", doctor: "Shifokor", individual: "Shaxsiy" },
  modules: { nutrition: "Ovqatlanish", growth: "O'sish", deficiency: "Yetishmovchilik", vaccination: "Emlash", exercise: "Mashqlar", screen: "Ko'z sog'lig'i", report: "Shifokor PDF" },
  status: { good: "Yaxshi", attention: "E'tibor kerak", overdue: "Muddati o'tgan", upcoming: "Yaqinda", done: "Bajarildi", future: "Kelajakda", action: "Chora kerak" },
  dashboard: { greeting: "Salom", welcome: "Xush kelibsiz", overallHealth: "Umumiy salomatlik", addChild: "Farzand qo'shish", lastUpdated: "Yangilangan", recent: "So'nggi faollik", generateReport: "Shifokor hisobotini yaratish" },
  exercise: { title: "Mashq tavsiyalari", subtitle: "Yosh va maqsadga mos kunlik mashqlar", ageGroup: "Yosh guruhi", duration: "davomiyligi", mins: "daqiqa", markDone: "Bajarildi belgilash", doneToday: "Bugun bajarildi ✓", streakLabel: "kun ketma-ket", goal: "Bugungi maqsad", progress: "Bugungi progress", weekChart: "Haftalik mashq daqiqalari", start: "Boshlash", timerDone: "Bajarildi 🎉", customName: "Mashq nomi", customAdd: "Qo'shish" },
  nutrition: { title: "Ovqatlanish jurnali", subtitle: "Bugungi taomlarni qo'shing va vitaminlarni kuzating", date: "Sana", search: "Taom qidirish…", breakfast: "Nonushta", lunch: "Tushlik", dinner: "Kechki ovqat", snack: "Yengil taom", portion: "Hajm", addToMeal: "Qo'shish", today: "Bugun", week: "Hafta", target: "Maqsad", insight: "Bugungi maslahat", streak: "Kun ketma-ket" },
  growth: { title: "O'sish kuzatuvi", subtitle: "WHO standartlariga muvofiq farzandingizning o'sishi", height: "Bo'y (sm)", weight: "Vazn (kg)", date: "O'lchov sanasi", sex: "Jinsi", boy: "O'g'il", girl: "Qiz", percentile: "Persentil", bmi: "BMI", since: "o'tgan o'lchovdan beri", history: "Tarix", add: "Qo'shish", below15: "Bo'y 15-persentildan past — pediatrga murojaat qiling", goodGrowth: "Yaxshi o'syapti! 🎉" },
  deficiency: { title: "Yetishmovchilik skriningi", subtitle: "12 ta tezkor savol. Login kerak emas.", info: "Bu faqat skrining vositasi — tibbiy tashxis emas.", reset: "Qaytadan boshlash", low: "Past xavf", moderate: "O'rtacha — bu mahsulotlarni ko'paytiring", high: "Yuqori — shifokorga murojaat qiling", tip: "Maslahat" },
  vaccination: { title: "Emlash kuzatuvi", subtitle: "O'zbekiston milliy emlash jadvali", complete: "bajarildi", filterAll: "Hammasi", filterDone: "Bajarildi", filterUpcoming: "Yaqinda", filterOverdue: "Muddati o'tgan", dateGiven: "Berilgan sana", clinic: "Klinika nomi", notes: "Izohlar", markDone: "Bajarildi belgilash", undo: "Bekor qilish", hotline: "Sog'liqni saqlash vazirligi ishonch telefoni: 1080" },
  screen: { title: "Ko'z va ekran sog'lig'i", subtitle: "Kunlik muvozanat, 20-20-20 va simptomlar", logTitle: "Ekran vaqti (soatda)", outdoor: "Tashqarida", total: "Jami ekran", twenty: "20-20-20 qoidasi", twentySub: "Har 20 daqiqada 20 soniya 6 metr uzoqlikka qarang", enable: "Eslatmani yoqish", disable: "O'chirish", reminderActive: "Eslatma faol", markToday: "Bugunni belgilash", doneToday: "Bugun ✓", streak: "kun ketma-ket", look: "👁 Uzoqqa qarang! 6 metr narida 20 soniya", symTitle: "Ko'z simptomlari", resultLow: "Ko'zlar sog'lom ko'rinadi! Ekran odatlarini saqlang.", resultMid: "Ba'zi simptomlar — ekran vaqtini kamaytiring va kuzating.", resultHigh: "Bir nechta simptom — optometrist bilan ko'rik tavsiya etamiz.", addReport: "Hisobotga qo'shish", exTitle: "Ko'z mashqlari", exStart: "Boshlash", exDone: "Bajarildi ✓", guideTitle: "Yosh bo'yicha ekran vaqti tavsiyalari", alertScreen: "Bugungi ekran vaqti tavsiyadan oshib ketdi", alertOutdoor: "Bugun 1 soatdan kam vaqt tashqarida bo'lgansiz" },
  report: { title: "Shifokor uchun PDF hisobot", subtitle: "Avtomatik tuzilgan. Chop etishga tayyor.", preview: "Ko'rib chiqish", download: "PDF yuklab olish", share: "WhatsApp orqali", notes: "Ota-ona izohlari", profile: "Bola profili", growthSec: "O'sish", nutrSec: "Ovqatlanish (haftalik o'rtacha)", defSec: "Yetishmovchilik skriningi", vacSec: "Emlash", screenSec: "Ekran va ko'z sog'lig'i", exerciseSec: "Mashqlar", disclaimer: "Yasha App faqat ma'lumot beradi. Bu tibbiy maslahat, tashxis yoki davolash o'rnini bosa olmaydi." },
  chatbot: { name: "Yasha", greeting: "Salom! Men Yasha — sizning sog'liq yordamchingizman 🌟", placeholder: "Savolingizni yozing...", send: "Yuborish", open: "Yasha chat", close: "Yopish", quick: { iron: "🥗 Temirga boy taomlar", vaccine: "💉 Emlash jadvali", screen: "👁 20-20-20 qoidasi", exercise: "🏃 Yosh uchun mashqlar", growth: "📈 O'sish maslahatlari", nutrition: "🥗 Ovqatlanish maslahatlari", eye: "👁 Ko'z salomatligi" }, fallback: "Bu savolni shifokoringizga bering — men faqat umumiy ma'lumot bera olaman! 😊" },
  toast: { saved: "Saqlandi ✓", marked: "Belgilandi ✓", reminder: "Eslatma", added: "Qo'shildi ✓", removed: "O'chirildi" },
  onboarding: { skip: "O'tkazib yuborish", next: "Keyingi", start: "Boshlash", s1Title: "Yasha'ga xush kelibsiz", s1Sub: "Oilangiz salomatligi uchun bepul yordamchi", s2Title: "Farzandingiz haqida", s2Name: "Ismi", s2Dob: "Tug'ilgan sana", s2Sex: "Jinsi", s2Male: "O'g'il", s2Female: "Qiz", s3Title: "Tilni tanlang" },
  common: { yes: "Ha", no: "Yo'q", close: "Yopish", share: "Ulashish", download: "Yuklab olish", save: "Saqlash", cancel: "Bekor", all: "Hammasi" },
  empty: { nutrition: "Hali ovqat qo'shilmagan — birinchisini qo'shing", vaccination: "Hali emlash kiritilmagan", growth: "O'sish ma'lumotlari yo'q", default: "Hali ma'lumot yo'q" },
};

const ru = {
  brand: "Yasha",
  tagline: "Yasha — Живите здорово",
  subhead: "Бесплатный мониторинг здоровья для каждой узбекской семьи",
  nav: { home: "Главная", dashboard: "Панель", nutrition: "Питание", growth: "Рост", deficiency: "Скрининг", vaccination: "Прививки", exercise: "Упражнения", screen: "Зрение", report: "Отчёт", login: "Войти", more: "Ещё" },
  hero: { cta: "Начать бесплатно", secondary: "Скрининг (без входа)" },
  footer: { disclaimer: "Приложение Yasha предоставляет только информацию. Оно не заменяет медицинскую консультацию, диагноз или лечение." },
  roles: { parent: "Родитель", doctor: "Врач", individual: "Личный" },
  modules: { nutrition: "Питание", growth: "Рост", deficiency: "Дефициты", vaccination: "Прививки", exercise: "Упражнения", screen: "Зрение", report: "PDF для врача" },
  status: { good: "Хорошо", attention: "Внимание", overdue: "Просрочено", upcoming: "Скоро", done: "Готово", future: "В будущем", action: "Требует действий" },
  dashboard: { greeting: "Привет", welcome: "Добро пожаловать", overallHealth: "Общее здоровье", addChild: "Добавить ребёнка", lastUpdated: "Обновлено", recent: "Последняя активность", generateReport: "Создать отчёт для врача" },
  exercise: { title: "Рекомендации по упражнениям", subtitle: "Ежедневные упражнения по возрасту и цели", ageGroup: "Возрастная группа", duration: "продолжительность", mins: "минут", markDone: "Отметить готово", doneToday: "Выполнено сегодня ✓", streakLabel: "дней подряд", goal: "Цель на сегодня", progress: "Прогресс сегодня", weekChart: "Минуты упражнений за неделю", start: "Начать", timerDone: "Готово 🎉", customName: "Название упражнения", customAdd: "Добавить" },
  nutrition: { title: "Дневник питания", subtitle: "Добавляйте блюда и отслеживайте витамины", date: "Дата", search: "Поиск блюд…", breakfast: "Завтрак", lunch: "Обед", dinner: "Ужин", snack: "Перекус", portion: "Порция", addToMeal: "Добавить", today: "Сегодня", week: "Неделя", target: "Цель", insight: "Совет дня", streak: "дней подряд" },
  growth: { title: "Трекер роста", subtitle: "Рост по стандартам ВОЗ", height: "Рост (см)", weight: "Вес (кг)", date: "Дата измерения", sex: "Пол", boy: "Мальчик", girl: "Девочка", percentile: "Перцентиль", bmi: "ИМТ", since: "с прошлого измерения", history: "История", add: "Добавить", below15: "Рост ниже 15-го перцентиля — обратитесь к педиатру", goodGrowth: "Хорошо растёт! 🎉" },
  deficiency: { title: "Скрининг дефицитов", subtitle: "12 быстрых вопросов. Без входа.", info: "Это инструмент скрининга — не диагноз.", reset: "Начать заново", low: "Низкий риск", moderate: "Средний — увеличьте эти продукты", high: "Высокий — обратитесь к врачу", tip: "Совет" },
  vaccination: { title: "Трекер прививок", subtitle: "Календарь прививок Узбекистана", complete: "выполнено", filterAll: "Все", filterDone: "Готово", filterUpcoming: "Скоро", filterOverdue: "Просрочено", dateGiven: "Дата прививки", clinic: "Название клиники", notes: "Заметки", markDone: "Отметить", undo: "Отменить", hotline: "Горячая линия Минздрава: 1080" },
  screen: { title: "Зрение и экранное время", subtitle: "Дневной баланс, 20-20-20 и симптомы", logTitle: "Экранное время (часы)", outdoor: "На улице", total: "Всего экран", twenty: "Правило 20-20-20", twentySub: "Каждые 20 мин смотрите 20 сек на 6 м вдаль", enable: "Включить напоминание", disable: "Выключить", reminderActive: "Напоминание активно", markToday: "Отметить сегодня", doneToday: "Сегодня ✓", streak: "дней подряд", look: "👁 Посмотрите вдаль! 6 м, 20 секунд", symTitle: "Симптомы со стороны глаз", resultLow: "Глаза в порядке! Сохраняйте режим экрана.", resultMid: "Есть симптомы — снизьте экранное время и наблюдайте.", resultHigh: "Несколько симптомов — рекомендуем посетить оптометриста.", addReport: "Добавить в отчёт", exTitle: "Упражнения для глаз", exStart: "Начать", exDone: "Готово ✓", guideTitle: "Рекомендации по экрану по возрасту", alertScreen: "Сегодня экранное время превышено", alertOutdoor: "Менее 1 часа на улице сегодня" },
  report: { title: "PDF-отчёт для врача", subtitle: "Сформирован автоматически. Готов к печати.", preview: "Предпросмотр", download: "Скачать PDF", share: "Через WhatsApp", notes: "Заметки родителя", profile: "Профиль ребёнка", growthSec: "Рост", nutrSec: "Питание (за неделю)", defSec: "Скрининг дефицитов", vacSec: "Прививки", screenSec: "Экран и зрение", exerciseSec: "Упражнения", disclaimer: "Приложение Yasha предоставляет только информацию. Оно не заменяет медицинскую консультацию." },
  chatbot: { name: "Яша", greeting: "Привет! Я Яша — ваш помощник по здоровью 🌟", placeholder: "Напишите ваш вопрос...", send: "Отправить", open: "Чат Яша", close: "Закрыть", quick: { iron: "🥗 Продукты с железом", vaccine: "💉 Календарь прививок", screen: "👁 Правило 20-20-20", exercise: "🏃 Упражнения по возрасту", growth: "📈 Советы по росту", nutrition: "🥗 Советы по питанию", eye: "👁 Здоровье глаз" }, fallback: "Этот вопрос лучше задать врачу — я могу давать только общую информацию! 😊" },
  toast: { saved: "Сохранено ✓", marked: "Отмечено ✓", reminder: "Напоминание", added: "Добавлено ✓", removed: "Удалено" },
  onboarding: { skip: "Пропустить", next: "Далее", start: "Начать", s1Title: "Добро пожаловать в Yasha", s1Sub: "Бесплатный помощник для здоровья вашей семьи", s2Title: "О вашем ребёнке", s2Name: "Имя", s2Dob: "Дата рождения", s2Sex: "Пол", s2Male: "Мальчик", s2Female: "Девочка", s3Title: "Выберите язык" },
  common: { yes: "Да", no: "Нет", close: "Закрыть", share: "Поделиться", download: "Скачать", save: "Сохранить", cancel: "Отмена", all: "Все" },
  empty: { nutrition: "Ещё ничего не добавлено — добавьте первое блюдо", vaccination: "Прививки не отмечены", growth: "Нет данных о росте", default: "Пока нет данных" },
};

const en = {
  brand: "Yasha",
  tagline: "Yasha — Live Healthy",
  subhead: "Free family health monitoring for every Uzbek family",
  nav: { home: "Home", dashboard: "Dashboard", nutrition: "Nutrition", growth: "Growth", deficiency: "Screening", vaccination: "Vaccines", exercise: "Exercise", screen: "Eye Health", report: "Report", login: "Sign in", more: "More" },
  hero: { cta: "Get started free", secondary: "Try screener (no login)" },
  footer: { disclaimer: "Yasha App provides health information only. It is not a substitute for medical advice, diagnosis, or treatment." },
  roles: { parent: "Parent", doctor: "Doctor", individual: "Individual" },
  modules: { nutrition: "Nutrition", growth: "Growth", deficiency: "Deficiency", vaccination: "Vaccination", exercise: "Exercise", screen: "Eye Health", report: "Doctor PDF" },
  status: { good: "Up to date", attention: "Needs attention", overdue: "Overdue", upcoming: "Upcoming", done: "Done", future: "Future", action: "Action required" },
  dashboard: { greeting: "Hi", welcome: "Welcome back", overallHealth: "Overall health", addChild: "Add child", lastUpdated: "Updated", recent: "Recent activity", generateReport: "Generate doctor report" },
  exercise: { title: "Exercise recommendations", subtitle: "Age-appropriate daily exercises", ageGroup: "Age group", duration: "duration", mins: "min", markDone: "Mark done today", doneToday: "Done today ✓", streakLabel: "days in a row", goal: "Today's goal", progress: "Today's progress", weekChart: "Weekly exercise minutes", start: "Start", timerDone: "Done 🎉", customName: "Exercise name", customAdd: "Add" },
  nutrition: { title: "Nutrition log", subtitle: "Log meals and track vitamins vs WHO targets", date: "Date", search: "Search foods…", breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack", portion: "Portion", addToMeal: "Add", today: "Today", week: "Week", target: "Target", insight: "Today's insight", streak: "day streak" },
  growth: { title: "Growth tracker", subtitle: "WHO percentile chart", height: "Height (cm)", weight: "Weight (kg)", date: "Measurement date", sex: "Sex", boy: "Boy", girl: "Girl", percentile: "Percentile", bmi: "BMI", since: "since last measurement", history: "History", add: "Add", below15: "Below 15th percentile — consider a paediatrician visit", goodGrowth: "Growing well! 🎉" },
  deficiency: { title: "Deficiency screener", subtitle: "12 quick questions. No login required.", info: "Screening only — not a medical diagnosis.", reset: "Start over", low: "Low risk", moderate: "Moderate — increase these foods", high: "High — see a doctor", tip: "Tip" },
  vaccination: { title: "Vaccination tracker", subtitle: "Uzbekistan national immunisation schedule", complete: "complete", filterAll: "All", filterDone: "Done", filterUpcoming: "Upcoming", filterOverdue: "Overdue", dateGiven: "Date given", clinic: "Clinic name", notes: "Notes", markDone: "Mark as done", undo: "Undo", hotline: "Ministry of Health hotline: 1080" },
  screen: { title: "Screen & eye health", subtitle: "Daily balance, 20-20-20 streak, symptoms", logTitle: "Screen time (hours)", outdoor: "Outdoor", total: "Total screen", twenty: "20-20-20 rule", twentySub: "Every 20 min, look 20 sec at something 6 m away", enable: "Enable reminder", disable: "Disable", reminderActive: "Reminder active", markToday: "Mark today done", doneToday: "Today ✓", streak: "days in a row", look: "👁 Look away! 6 m away for 20 seconds", symTitle: "Eye symptoms today", resultLow: "Eyes look healthy! Keep up the good habits.", resultMid: "Some symptoms — reduce screen time and monitor.", resultHigh: "Multiple symptoms — recommend an eye exam.", addReport: "Add to report", exTitle: "Eye exercises", exStart: "Start", exDone: "Done ✓", guideTitle: "Age-based screen time guidelines", alertScreen: "Today's screen time is above the recommended limit", alertOutdoor: "Less than 1 hour outdoors today" },
  report: { title: "Doctor PDF report", subtitle: "Auto-compiled. Print-ready.", preview: "Preview", download: "Download PDF", share: "Share via WhatsApp", notes: "Parent notes", profile: "Child profile", growthSec: "Growth", nutrSec: "Nutrition (weekly avg)", defSec: "Deficiency screening", vacSec: "Vaccinations", screenSec: "Screen & eye health", exerciseSec: "Exercise", disclaimer: "Yasha App provides health information only. It is not a substitute for medical advice." },
  chatbot: { name: "Yasha", greeting: "Hi! I'm Yasha — your health companion 🌟", placeholder: "Type your question...", send: "Send", open: "Yasha chat", close: "Close", quick: { iron: "🥗 Iron-rich Uzbek foods", vaccine: "💉 Vaccination schedule", screen: "👁 20-20-20 rule", exercise: "🏃 Exercise for child's age", growth: "📈 Growth tips", nutrition: "🥗 Nutrition tips", eye: "👁 Eye health help" }, fallback: "That's one for your doctor — I can only share general info! 😊" },
  toast: { saved: "Saved ✓", marked: "Marked ✓", reminder: "Reminder", added: "Added ✓", removed: "Removed" },
  onboarding: { skip: "Skip", next: "Next", start: "Get started", s1Title: "Welcome to Yasha", s1Sub: "Free family health companion for Uzbekistan", s2Title: "About your child", s2Name: "Name", s2Dob: "Date of birth", s2Sex: "Sex", s2Male: "Boy", s2Female: "Girl", s3Title: "Choose your language" },
  common: { yes: "Yes", no: "No", close: "Close", share: "Share", download: "Download", save: "Save", cancel: "Cancel", all: "All" },
  empty: { nutrition: "No meals logged yet — tap to add your first meal", vaccination: "No vaccines marked yet", growth: "No growth data yet", default: "Nothing here yet" },
};

// CRITICAL: Always init with "uz" so SSR + first client render match.
// Client switches to user's saved language only AFTER hydration (see __root.tsx).
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      uz: { translation: uz },
      ru: { translation: ru },
      en: { translation: en },
    },
    lng: "uz",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}

export default i18n;
