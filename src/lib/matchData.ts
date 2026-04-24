import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
export type Tab = "profile" | "search" | "compat" | "chat" | "recs" | "stats";

export const FREE_LIMIT = 3;
export const TRIAL_DAYS = 3;

// ─── Zodiac helpers ──────────────────────────────────────────────────────────
export const getZodiac = (birthdate: string): { sign: string; emoji: string; element: string } => {
  if (!birthdate) return { sign: "Неизвестно", emoji: "✨", element: "—" };
  const d = new Date(birthdate);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const signs: [number, number, string, string, string][] = [
    [3, 21, "Овен", "♈", "Огонь"], [4, 20, "Телец", "♉", "Земля"],
    [5, 21, "Близнецы", "♊", "Воздух"], [6, 21, "Рак", "♋", "Вода"],
    [7, 23, "Лев", "♌", "Огонь"], [8, 23, "Дева", "♍", "Земля"],
    [9, 23, "Весы", "♎", "Воздух"], [10, 23, "Скорпион", "♏", "Вода"],
    [11, 22, "Стрелец", "♐", "Огонь"], [12, 22, "Козерог", "♑", "Земля"],
    [1, 20, "Водолей", "♒", "Воздух"], [2, 19, "Рыбы", "♓", "Вода"],
  ];
  for (const [sm, sd, name, emoji, element] of signs) {
    if (m === sm && day >= sd) return { sign: name, emoji, element };
    if (m === sm - 1 && day < sd) return { sign: signs[signs.findIndex(s => s[0] === sm) - 1]?.[2] || "Рыбы", emoji: signs[signs.findIndex(s => s[0] === sm) - 1]?.[3] || "♓", element: signs[signs.findIndex(s => s[0] === sm) - 1]?.[4] || "Вода" };
  }
  return { sign: "Козерог", emoji: "♑", element: "Земля" };
};

export const zodiacCompat: Record<string, string[]> = {
  "Овен": ["Лев", "Стрелец", "Близнецы", "Водолей"],
  "Телец": ["Дева", "Козерог", "Рак", "Рыбы"],
  "Близнецы": ["Весы", "Водолей", "Овен", "Лев"],
  "Рак": ["Скорпион", "Рыбы", "Телец", "Дева"],
  "Лев": ["Овен", "Стрелец", "Близнецы", "Весы"],
  "Дева": ["Телец", "Козерог", "Рак", "Скорпион"],
  "Весы": ["Близнецы", "Водолей", "Лев", "Стрелец"],
  "Скорпион": ["Рак", "Рыбы", "Дева", "Козерог"],
  "Стрелец": ["Овен", "Лев", "Весы", "Водолей"],
  "Козерог": ["Телец", "Дева", "Скорпион", "Рыбы"],
  "Водолей": ["Близнецы", "Весы", "Овен", "Стрелец"],
  "Рыбы": ["Рак", "Скорпион", "Телец", "Козерог"],
};

export const getZodiacCompatScore = (sign1: string, sign2: string): number => {
  if (!sign1 || !sign2 || sign1 === "Неизвестно" || sign2 === "Неизвестно") return 75;
  if (sign1 === sign2) return 88;
  const best = zodiacCompat[sign1] || [];
  if (best.slice(0, 2).includes(sign2)) return 95;
  if (best.slice(2, 4).includes(sign2)) return 82;
  return 58;
};

// ─── useCompatLimit hook ─────────────────────────────────────────────────────
export const useCompatLimit = () => {
  const [used, setUsed] = useState<number>(() => {
    const saved = localStorage.getItem("compat_used");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isPro, setIsPro] = useState<boolean>(() => localStorage.getItem("compat_pro") === "1");
  const [trialStart] = useState<number>(() => {
    const saved = localStorage.getItem("trial_start");
    if (saved) return parseInt(saved, 10);
    const now = Date.now();
    localStorage.setItem("trial_start", String(now));
    return now;
  });

  const trialDaysLeft = Math.max(0, TRIAL_DAYS - Math.floor((Date.now() - trialStart) / 86400000));
  const isTrialActive = trialDaysLeft > 0 && !isPro;
  const effectivePro = isPro || isTrialActive;

  const remaining = effectivePro ? Infinity : Math.max(0, FREE_LIMIT - used);
  const canUse = effectivePro || used < FREE_LIMIT;

  const consume = () => {
    if (effectivePro) return;
    const next = used + 1;
    setUsed(next);
    localStorage.setItem("compat_used", String(next));
  };

  const upgradeToPro = () => {
    setIsPro(true);
    localStorage.setItem("compat_pro", "1");
  };

  const cancelPro = () => {
    setIsPro(false);
    localStorage.removeItem("compat_pro");
  };

  return { used, remaining, canUse, isPro, isTrialActive, trialDaysLeft, effectivePro, consume, upgradeToPro, cancelPro };
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
export const myProfile = {
  name: "Алина Соколова",
  age: 26,
  city: "Москва",
  avatar: "А",
  bio: "Люблю путешествия, кофе и неожиданные открытия. Ищу родственную душу.",
  tags: ["Путешествия", "Кино", "Йога", "Кулинария", "Музыка"],
  compat: 87,
  birthdate: "1998-03-15",
};

export const users = [
  { id: 1, name: "Максим Волков", age: 28, city: "Москва", avatar: "М", color: "from-blue-500 to-teal-500", compat: 92, tags: ["Музыка", "Спорт", "Путешествия"], online: true, birthdate: "1996-08-15" },
  { id: 2, name: "Дарья Иванова", age: 24, city: "СПб", avatar: "Д", color: "from-pink-500 to-orange-400", compat: 78, tags: ["Кино", "Йога", "Искусство"], online: false, birthdate: "2000-11-03" },
  { id: 3, name: "Игорь Смирнов", age: 31, city: "Москва", avatar: "И", color: "from-purple-500 to-indigo-500", compat: 85, tags: ["Технологии", "Путешествия", "Кофе"], online: true, birthdate: "1993-06-22" },
  { id: 4, name: "Марина Белова", age: 27, city: "Казань", avatar: "М", color: "from-amber-500 to-red-500", compat: 71, tags: ["Кулинария", "Музыка", "Бег"], online: true, birthdate: "1997-01-10" },
];

export const messages = [
  { id: 1, from: "them", text: "Привет! Видел, что мы совместимы на 92%. Это впечатляет 😊", time: "10:24" },
  { id: 2, from: "me", text: "Привет! Да, я тоже заметила! Ты занимаешься музыкой?", time: "10:26" },
  { id: 3, from: "them", text: "Да, играю на гитаре уже 10 лет. А ты?", time: "10:27" },
  { id: 4, from: "me", text: "Обожаю слушать! Особенно акустику 🎸", time: "10:29" },
  { id: 5, from: "them", text: "Тогда тебе понравится мой новый альбом, скину послушать!", time: "10:30" },
];

export const recommendations = [
  { id: 1, user: users[0], reason: "Оба любите путешествия и музыку", score: 92, badge: "🔥 Отличная пара" },
  { id: 2, user: users[2], reason: "Схожие ценности и образ жизни", score: 85, badge: "⭐ Хорошая совместимость" },
  { id: 3, user: users[1], reason: "Общие интересы: кино и йога", score: 78, badge: "💡 Стоит познакомиться" },
];

export const stats = {
  views: 248, matches: 12, messages: 47, avgCompat: 79,
  byCategory: [
    { label: "Ценности", pct: 91 },
    { label: "Интересы", pct: 85 },
    { label: "Образ жизни", pct: 78 },
    { label: "Цели", pct: 72 },
    { label: "Характер", pct: 88 },
  ],
  activity: [65, 80, 45, 90, 72, 88, 95],
};

export const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export const viewersList = [
  { id: 1, name: "Сергей Козлов", age: 30, city: "Москва", avatar: "С", color: "from-cyan-500 to-blue-500", compat: 88, online: true, time: "5 мин назад" },
  { id: 2, name: "Анна Петрова", age: 25, city: "СПб", avatar: "А", color: "from-rose-500 to-pink-500", compat: 74, online: false, time: "1 час назад" },
  { id: 3, name: "Дмитрий Орлов", age: 33, city: "Казань", avatar: "Д", color: "from-emerald-500 to-teal-500", compat: 81, online: true, time: "2 часа назад" },
  { id: 4, name: "Виктория Нова", age: 27, city: "Москва", avatar: "В", color: "from-amber-500 to-orange-500", compat: 69, online: false, time: "вчера" },
  { id: 5, name: "Роман Синицын", age: 29, city: "Екб", avatar: "Р", color: "from-purple-500 to-indigo-500", compat: 93, online: true, time: "вчера" },
];

export const matchesList = [
  { id: 1, name: "Максим Волков", age: 28, city: "Москва", avatar: "М", color: "from-blue-500 to-teal-500", compat: 92, online: true, time: "10 мин назад" },
  { id: 2, name: "Игорь Смирнов", age: 31, city: "Москва", avatar: "И", color: "from-purple-500 to-indigo-500", compat: 85, online: true, time: "3 часа назад" },
  { id: 3, name: "Марина Белова", age: 27, city: "Казань", avatar: "М", color: "from-amber-500 to-red-500", compat: 71, online: false, time: "вчера" },
];

export const notificationsList = [
  { id: 1, icon: "Eye", color: "text-blue-400", bg: "bg-blue-500/20", text: "Сергей Козлов просмотрел твой профиль", sub: "5 минут назад", unread: true },
  { id: 2, icon: "Heart", color: "text-pink-400", bg: "bg-pink-500/20", text: "Максим Волков поставил тебе лайк!", sub: "10 минут назад", unread: true },
  { id: 3, icon: "Sparkles", color: "text-violet-400", bg: "bg-violet-500/20", text: "Новая рекомендация: 95% совместимость с Романом Синицыным", sub: "1 час назад", unread: true },
  { id: 4, icon: "Star", color: "text-yellow-400", bg: "bg-yellow-500/20", text: "Результат совместимости с Игорем Смирновым обновлён: 85%", sub: "3 часа назад", unread: false },
  { id: 5, icon: "Eye", color: "text-blue-400", bg: "bg-blue-500/20", text: "Анна Петрова просмотрела твой профиль", sub: "5 часов назад", unread: false },
  { id: 6, icon: "Heart", color: "text-pink-400", bg: "bg-pink-500/20", text: "Игорь Смирнов поставил тебе лайк!", sub: "вчера", unread: false },
  { id: 7, icon: "Sparkles", color: "text-violet-400", bg: "bg-violet-500/20", text: "Рекомендуем познакомиться с Дарьей Ивановой", sub: "вчера", unread: false },
  { id: 8, icon: "Star", color: "text-yellow-400", bg: "bg-yellow-500/20", text: "Твой рейтинг совместимости вырос до 87%", sub: "2 дня назад", unread: false },
];

export const navItems: { id: Tab; icon: string; label: string }[] = [
  { id: "profile", icon: "User", label: "Профиль" },
  { id: "search", icon: "Search", label: "Поиск" },
  { id: "compat", icon: "Sparkles", label: "Совмест." },
  { id: "chat", icon: "MessageCircle", label: "Чат" },
  { id: "recs", icon: "Heart", label: "Рек." },
  { id: "stats", icon: "BarChart2", label: "Стат." },
];
