import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
type IconName = string;

// ─── Types ─────────────────────────────────────────────────────────────────
type Tab = "profile" | "search" | "compat" | "chat" | "recs" | "stats";

const FREE_LIMIT = 3;

// ─── useCompatLimit hook ────────────────────────────────────────────────────
const useCompatLimit = () => {
  const [used, setUsed] = useState<number>(() => {
    const saved = localStorage.getItem("compat_used");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isPro, setIsPro] = useState<boolean>(() => localStorage.getItem("compat_pro") === "1");

  const remaining = isPro ? Infinity : Math.max(0, FREE_LIMIT - used);
  const canUse = isPro || used < FREE_LIMIT;

  const consume = () => {
    if (isPro) return;
    const next = used + 1;
    setUsed(next);
    localStorage.setItem("compat_used", String(next));
  };

  const upgradeToPro = () => {
    setIsPro(true);
    localStorage.setItem("compat_pro", "1");
  };

  return { used, remaining, canUse, isPro, consume, upgradeToPro };
};

// ─── PaywallModal ─────────────────────────────────────────────────────────
const PaywallModal = ({ onClose, onUpgrade }: { onClose: () => void; onUpgrade: () => void }) => {
  const plans = [
    { id: "month", label: "1 месяц", price: "299 ₽", per: "в месяц", popular: false },
    { id: "year", label: "1 год", price: "1 990 ₽", per: "167 ₽/мес", popular: true },
  ];
  const [selected, setSelected] = useState("year");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-[hsl(240,15%,8%)] rounded-t-3xl p-6 pb-10 border-t border-white/10 animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />

        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
          <Icon name="Crown" size={28} className="text-white" />
        </div>

        <h2 className="text-2xl font-black text-white font-display text-center mb-1">МЭТЧ Pro</h2>
        <p className="text-white/50 text-sm text-center mb-6">
          Бесплатные запросы закончились. Оформи подписку и открой безлимитный доступ.
        </p>

        {/* Benefits */}
        <div className="space-y-2.5 mb-6">
          {[
            { icon: "Infinity", text: "Безлимитные проверки совместимости" },
            { icon: "Sparkles", text: "Детальный анализ по 10 категориям" },
            { icon: "MessageCircle", text: "Неограниченные чаты" },
            { icon: "Star", text: "Приоритет в рекомендациях" },
            { icon: "BarChart2", text: "Расширенная статистика" },
          ].map(b => (
            <div key={b.text} className="flex items-center gap-3">
              <div className="w-7 h-7 bg-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={b.icon as IconName} size={14} className="text-violet-400" />
              </div>
              <span className="text-sm text-white/80">{b.text}</span>
            </div>
          ))}
        </div>

        {/* Plans */}
        <div className="flex gap-3 mb-5">
          {plans.map(p => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`flex-1 p-4 rounded-2xl border transition-all relative ${selected === p.id ? "border-violet-500 bg-violet-500/10" : "border-white/10 glass"}`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full text-xs text-white font-bold whitespace-nowrap">
                  Выгоднее
                </div>
              )}
              <div className="text-white font-bold text-sm">{p.label}</div>
              <div className="gradient-text font-black text-lg font-display">{p.price}</div>
              <div className="text-white/40 text-xs">{p.per}</div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onUpgrade}
          className="w-full py-4 bg-gradient-to-r from-violet-500 to-pink-500 rounded-2xl text-white font-bold font-display text-lg hover:opacity-90 transition-all active:scale-95 shadow-lg glow-purple mb-3"
        >
          Оформить подписку
        </button>
        <button onClick={onClose} className="w-full py-3 text-white/40 text-sm hover:text-white/60 transition-colors">
          Не сейчас
        </button>
      </div>
    </div>
  );
};

// ─── Mock Data ─────────────────────────────────────────────────────────────
const myProfile = {
  name: "Алина Соколова",
  age: 26,
  city: "Москва",
  avatar: "А",
  bio: "Люблю путешествия, кофе и неожиданные открытия. Ищу родственную душу.",
  tags: ["Путешествия", "Кино", "Йога", "Кулинария", "Музыка"],
  compat: 87,
};

const users = [
  { id: 1, name: "Максим Волков", age: 28, city: "Москва", avatar: "М", color: "from-blue-500 to-teal-500", compat: 92, tags: ["Музыка", "Спорт", "Путешествия"], online: true },
  { id: 2, name: "Дарья Иванова", age: 24, city: "СПб", avatar: "Д", color: "from-pink-500 to-orange-400", compat: 78, tags: ["Кино", "Йога", "Искусство"], online: false },
  { id: 3, name: "Игорь Смирнов", age: 31, city: "Москва", avatar: "И", color: "from-purple-500 to-indigo-500", compat: 85, tags: ["Технологии", "Путешествия", "Кофе"], online: true },
  { id: 4, name: "Марина Белова", age: 27, city: "Казань", avatar: "М", color: "from-amber-500 to-red-500", compat: 71, tags: ["Кулинария", "Музыка", "Бег"], online: true },
];

const messages = [
  { id: 1, from: "them", text: "Привет! Видел, что мы совместимы на 92%. Это впечатляет 😊", time: "10:24" },
  { id: 2, from: "me", text: "Привет! Да, я тоже заметила! Ты занимаешься музыкой?", time: "10:26" },
  { id: 3, from: "them", text: "Да, играю на гитаре уже 10 лет. А ты?", time: "10:27" },
  { id: 4, from: "me", text: "Обожаю слушать! Особенно акустику 🎸", time: "10:29" },
  { id: 5, from: "them", text: "Тогда тебе понравится мой новый альбом, скину послушать!", time: "10:30" },
];

const recommendations = [
  { id: 1, user: users[0], reason: "Оба любите путешествия и музыку", score: 92, badge: "🔥 Отличная пара" },
  { id: 2, user: users[2], reason: "Схожие ценности и образ жизни", score: 85, badge: "⭐ Хорошая совместимость" },
  { id: 3, user: users[1], reason: "Общие интересы: кино и йога", score: 78, badge: "💡 Стоит познакомиться" },
];

const stats = {
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

const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

// ─── Compat Circle ──────────────────────────────────────────────────────────
const CompatCircle = ({ pct, size = 120, stroke = 10 }: { pct: number; size?: number; stroke?: number }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(pct), 200);
    return () => clearTimeout(timer);
  }, [pct]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="url(#compatGrad)"
          strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - (circ * animated) / 100}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
        />
        <defs>
          <linearGradient id="compatGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(280,80%,65%)" />
            <stop offset="100%" stopColor="hsl(330,80%,65%)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-black gradient-text font-display" style={{ fontSize: size * 0.18 }}>{animated}%</span>
        {size > 60 && <span className="text-white/40 mt-0.5" style={{ fontSize: size * 0.08 }}>совместимость</span>}
      </div>
    </div>
  );
};

// ─── Avatar ─────────────────────────────────────────────────────────────────
const Avatar = ({ user, size = "md" }: { user: typeof users[0]; size?: "sm" | "md" | "lg" }) => {
  const sz = { sm: "w-10 h-10 text-sm rounded-xl", md: "w-14 h-14 text-lg rounded-2xl", lg: "w-20 h-20 text-2xl rounded-3xl" };
  return (
    <div className={`${sz[size]} bg-gradient-to-br ${user.color} flex items-center justify-center font-black text-white font-display flex-shrink-0 relative`}>
      {user.avatar}
      {user.online && <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-background" />}
    </div>
  );
};

// ─── VIEWERS MODAL ───────────────────────────────────────────────────────────
const viewersList = [
  { id: 1, name: "Сергей Козлов", age: 30, city: "Москва", avatar: "С", color: "from-cyan-500 to-blue-500", compat: 88, online: true, time: "5 мин назад" },
  { id: 2, name: "Анна Петрова", age: 25, city: "СПб", avatar: "А", color: "from-rose-500 to-pink-500", compat: 74, online: false, time: "1 час назад" },
  { id: 3, name: "Дмитрий Орлов", age: 33, city: "Казань", avatar: "Д", color: "from-emerald-500 to-teal-500", compat: 81, online: true, time: "2 часа назад" },
  { id: 4, name: "Виктория Нова", age: 27, city: "Москва", avatar: "В", color: "from-amber-500 to-orange-500", compat: 69, online: false, time: "вчера" },
  { id: 5, name: "Роман Синицын", age: 29, city: "Екб", avatar: "Р", color: "from-purple-500 to-indigo-500", compat: 93, online: true, time: "вчера" },
];

const matchesList = [
  { id: 1, name: "Максим Волков", age: 28, city: "Москва", avatar: "М", color: "from-blue-500 to-teal-500", compat: 92, online: true, time: "10 мин назад" },
  { id: 2, name: "Игорь Смирнов", age: 31, city: "Москва", avatar: "И", color: "from-purple-500 to-indigo-500", compat: 85, online: true, time: "3 часа назад" },
  { id: 3, name: "Марина Белова", age: 27, city: "Казань", avatar: "М", color: "from-amber-500 to-red-500", compat: 71, online: false, time: "вчера" },
];

const ViewersModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
    <div className="relative w-full max-w-lg bg-[hsl(240,15%,8%)] rounded-t-3xl p-6 pb-10 border-t border-white/10 animate-fade-in-up max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
      <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
          <Icon name="Eye" size={18} className="text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white font-display">Просмотры профиля</h2>
          <p className="text-xs text-white/40">{stats.views} человек смотрели твой профиль</p>
        </div>
        <button onClick={onClose} className="ml-auto p-2 glass rounded-xl text-white/40 hover:text-white transition-all">
          <Icon name="X" size={16} />
        </button>
      </div>
      <div className="overflow-y-auto space-y-3 flex-1">
        {viewersList.map(u => (
          <div key={u.id} className="glass rounded-2xl p-4 flex items-center gap-4 border border-transparent hover:border-blue-500/20 transition-all">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${u.color} flex items-center justify-center font-black text-white font-display text-sm flex-shrink-0 relative`}>
              {u.avatar}
              {u.online && <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-background" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-sm">{u.name}</div>
              <div className="text-xs text-white/40">{u.age} лет · {u.city}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Icon name="Heart" size={10} className="text-pink-400" />
                <span className="text-xs text-pink-400 font-medium">{u.compat}% совместимость</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-white/30 mb-1.5">{u.time}</div>
              <button className="text-xs px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white font-medium hover:opacity-80 transition-opacity">
                Написать
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MatchesModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
    <div className="relative w-full max-w-lg bg-[hsl(240,15%,8%)] rounded-t-3xl p-6 pb-10 border-t border-white/10 animate-fade-in-up max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
      <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
          <Icon name="Heart" size={18} className="text-pink-400" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white font-display">Матчи</h2>
          <p className="text-xs text-white/40">{stats.matches} человек поставили тебе лайк</p>
        </div>
        <button onClick={onClose} className="ml-auto p-2 glass rounded-xl text-white/40 hover:text-white transition-all">
          <Icon name="X" size={16} />
        </button>
      </div>
      <div className="overflow-y-auto space-y-3 flex-1">
        {matchesList.map(u => (
          <div key={u.id} className="glass rounded-2xl p-4 flex items-center gap-4 border border-transparent hover:border-pink-500/20 transition-all">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${u.color} flex items-center justify-center font-black text-white font-display text-sm flex-shrink-0 relative`}>
              {u.avatar}
              {u.online && <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-background" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-sm">{u.name}</div>
              <div className="text-xs text-white/40">{u.age} лет · {u.city}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Icon name="Heart" size={10} className="text-pink-400" />
                <span className="text-xs text-pink-400 font-medium">{u.compat}% совместимость</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-white/30 mb-1.5">{u.time}</div>
              <button className="text-xs px-3 py-1 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full text-white font-medium hover:opacity-80 transition-opacity">
                Написать
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── PROFILE ─────────────────────────────────────────────────────────────────
const ProfileTab = ({ onGoToChat }: { onGoToChat: () => void }) => {
  const [showViewers, setShowViewers] = useState(false);
  const [showMatches, setShowMatches] = useState(false);

  return (
  <div className="space-y-4 animate-fade-in-up">
    {showViewers && <ViewersModal onClose={() => setShowViewers(false)} />}
    {showMatches && <MatchesModal onClose={() => setShowMatches(false)} />}
    <div className="relative overflow-hidden rounded-3xl glass-strong p-6">
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-violet-600/20 blur-3xl animate-blob" />
      <div className="absolute -bottom-10 -left-5 w-32 h-32 rounded-full bg-pink-500/15 blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
      <div className="relative flex items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-3xl font-black text-white font-display shadow-lg animate-pulse-glow">
          {myProfile.avatar}
        </div>
        <div>
          <h2 className="text-xl font-black font-display text-white">{myProfile.name}</h2>
          <p className="text-white/50 text-sm">{myProfile.age} лет · {myProfile.city}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping-slow" />
            <span className="text-emerald-400 text-xs font-medium">Онлайн</span>
          </div>
        </div>
        <button className="ml-auto p-2.5 glass rounded-xl text-white/60 hover:text-white transition-all">
          <Icon name="Pencil" size={16} />
        </button>
      </div>
      <p className="relative mt-4 text-white/70 text-sm leading-relaxed">{myProfile.bio}</p>
      <div className="relative flex flex-wrap gap-2 mt-4">
        {myProfile.tags.map(t => (
          <span key={t} className="px-3 py-1 rounded-full text-xs font-medium glass border border-violet-500/30 text-violet-300">{t}</span>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-3 gap-3">
      {[
        { icon: "Eye", label: "Просмотры", val: stats.views, color: "text-blue-400", onClick: () => setShowViewers(true) },
        { icon: "Heart", label: "Матчи", val: stats.matches, color: "text-pink-400", onClick: () => setShowMatches(true) },
        { icon: "MessageCircle", label: "Чаты", val: 4, color: "text-violet-400", onClick: onGoToChat },
      ].map(s => (
        <div key={s.label} onClick={s.onClick} className="glass rounded-2xl p-4 text-center hover-lift cursor-pointer">
          <Icon name={s.icon as IconName} size={20} className={`${s.color} mx-auto mb-1`} />
          <div className="text-xl font-black text-white font-display">{s.val}</div>
          <div className="text-xs text-white/40">{s.label}</div>
        </div>
      ))}
    </div>

    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white font-display text-sm">Тесты совместимости</h3>
        <span className="text-xs text-violet-400 font-medium">3/7 пройдено</span>
      </div>
      <div className="space-y-3">
        {[
          { name: "Ценности и приоритеты", done: true },
          { name: "Образ жизни", done: true },
          { name: "Характер и темперамент", done: true },
          { name: "Отношения и семья", done: false },
          { name: "Карьера и амбиции", done: false },
        ].map((t, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${t.done ? "bg-gradient-to-br from-violet-500 to-pink-500" : "glass border border-white/10"}`}>
              {t.done && <Icon name="Check" size={12} className="text-white" />}
            </div>
            <span className={`text-sm flex-1 ${t.done ? "text-white/80" : "text-white/40"}`}>{t.name}</span>
            {!t.done && <button className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium">Пройти</button>}
          </div>
        ))}
      </div>
      <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full w-[43%] transition-all duration-1000" />
      </div>
    </div>

    <div className="glass rounded-2xl p-5">
      <h3 className="font-bold text-white font-display text-sm mb-3">Мои предпочтения</h3>
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: "MapPin", label: "Город", val: "Москва" },
          { icon: "Calendar", label: "Возраст", val: "22–35 лет" },
          { icon: "Target", label: "Цели", val: "Серьёзные" },
          { icon: "Coffee", label: "Стиль жизни", val: "Активный" },
        ].map(p => (
          <div key={p.label} className="flex items-center gap-2 p-3 glass rounded-xl">
            <Icon name={p.icon as IconName} size={14} className="text-violet-400 flex-shrink-0" />
            <div>
              <div className="text-xs text-white/40">{p.label}</div>
              <div className="text-sm text-white font-medium">{p.val}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

// ─── SEARCH ──────────────────────────────────────────────────────────────────
const SearchTab = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "all" || (filter === "online" && u.online) || (filter === "high" && u.compat >= 80))
  );
  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="relative">
        <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Найти пользователя..."
          className="w-full pl-12 pr-4 py-3.5 glass-strong rounded-2xl text-white placeholder-white/30 text-sm outline-none border border-transparent focus:border-violet-500/40 transition-all"
        />
      </div>
      <div className="flex gap-2">
        {[{ id: "all", label: "Все" }, { id: "online", label: "Онлайн" }, { id: "high", label: "80%+" }].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f.id ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-lg" : "glass text-white/60 hover:text-white"}`}>
            {f.label}
          </button>
        ))}
        <button className="ml-auto p-2.5 glass rounded-xl text-white/60 hover:text-white transition-all">
          <Icon name="SlidersHorizontal" size={16} />
        </button>
      </div>
      <div className="space-y-3">
        {filtered.map((u, i) => (
          <div key={u.id} className="glass rounded-2xl p-4 flex items-center gap-4 hover-lift cursor-pointer border border-transparent hover:border-violet-500/20 transition-all"
            style={{ animationDelay: `${i * 0.1}s` }}>
            <Avatar user={u} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{u.name}</span>
                {u.online && <span className="w-2 h-2 bg-emerald-400 rounded-full" />}
              </div>
              <p className="text-white/40 text-xs">{u.age} лет · {u.city}</p>
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                {u.tags.slice(0, 2).map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 glass rounded-full text-white/50">{t}</span>
                ))}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className={`text-xl font-black font-display ${u.compat >= 85 ? "gradient-text" : "text-white/60"}`}>{u.compat}%</div>
              <div className="text-xs text-white/30">совм.</div>
              <button className="mt-1.5 text-xs px-3 py-1 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full text-white font-medium hover:opacity-80 transition-opacity">
                Написать
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-white/30">
            <Icon name="SearchX" size={40} className="mx-auto mb-3 opacity-50" />
            <p>Никого не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── COMPAT ───────────────────────────────────────────────────────────────────
const CompatTab = ({ limit, onPaywall }: { limit: ReturnType<typeof useCompatLimit>; onPaywall: () => void }) => {
  const [selected, setSelected] = useState(users[0]);
  const [testStep, setTestStep] = useState(0);
  const [showTest, setShowTest] = useState(false);
  const questions = [
    { q: "Как ты проводишь выходные?", opts: ["Активно на природе", "Дома с книгой", "С друзьями в городе", "Путешествую"] },
    { q: "Что важнее в отношениях?", opts: ["Доверие", "Общие интересы", "Страсть", "Поддержка"] },
  ];
  const categories = [
    { name: "Ценности", score: 91, from: "from-violet-500", to: "to-purple-600" },
    { name: "Интересы", score: 88, from: "from-pink-500", to: "to-rose-500" },
    { name: "Темперамент", score: 79, from: "from-orange-400", to: "to-amber-500" },
    { name: "Цели", score: 85, from: "from-blue-500", to: "to-cyan-500" },
    { name: "Образ жизни", score: 72, from: "from-teal-500", to: "to-emerald-500" },
  ];

  const handleSelectUser = (u: typeof users[0]) => {
    if (!limit.canUse && selected.id !== u.id) {
      onPaywall();
      return;
    }
    setSelected(u);
    limit.consume();
  };

  if (showTest) return (
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => { setShowTest(false); setTestStep(0); }} className="p-2.5 glass rounded-xl text-white/60 hover:text-white transition-all">
          <Icon name="ArrowLeft" size={16} />
        </button>
        <div className="flex-1">
          <div className="flex justify-between text-xs text-white/40 mb-1">
            <span>Вопрос {testStep + 1} из {questions.length}</span>
            <span>{Math.round((testStep / questions.length) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${(testStep / questions.length) * 100}%` }} />
          </div>
        </div>
      </div>
      {testStep < questions.length ? (
        <div className="glass-strong rounded-3xl p-6">
          <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <Icon name="HelpCircle" size={26} className="text-white" />
          </div>
          <h3 className="text-xl font-black text-white font-display text-center mb-6">{questions[testStep].q}</h3>
          <div className="space-y-3">
            {questions[testStep].opts.map(opt => (
              <button key={opt} onClick={() => setTestStep(s => s + 1)}
                className="w-full p-4 glass rounded-xl text-left text-white/80 hover:text-white hover:bg-violet-500/20 hover:border-violet-500/40 border border-transparent transition-all font-medium">
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-strong rounded-3xl p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <Icon name="CheckCircle" size={36} className="text-white" />
          </div>
          <h3 className="text-2xl font-black text-white font-display mb-2">Тест пройден!</h3>
          <p className="text-white/50 mb-6">Результаты обновлены</p>
          <button onClick={() => { setShowTest(false); setTestStep(0); }}
            className="px-8 py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-2xl text-white font-bold hover:opacity-90 transition-all">
            Посмотреть результат
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Limit badge */}
      {!limit.isPro && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${limit.remaining === 0 ? "border-pink-500/40 bg-pink-500/10" : "border-violet-500/20 glass"}`}>
          <Icon name={limit.remaining === 0 ? "Lock" : "Zap"} size={16} className={limit.remaining === 0 ? "text-pink-400" : "text-violet-400"} />
          <div className="flex-1">
            {limit.remaining === 0
              ? <span className="text-sm text-pink-300 font-medium">Бесплатные запросы исчерпаны</span>
              : <span className="text-sm text-white/70">Осталось бесплатных: <span className="font-bold text-white">{limit.remaining}</span> из {FREE_LIMIT}</span>
            }
          </div>
          {limit.remaining === 0 && (
            <button onClick={() => setShowPaywall(true)} className="text-xs px-3 py-1.5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-white font-bold hover:opacity-90 transition-all">
              Pro
            </button>
          )}
        </div>
      )}
      {limit.isPro && (
        <div className="flex items-center gap-2 px-4 py-2 glass rounded-2xl border border-yellow-500/20">
          <Icon name="Crown" size={14} className="text-yellow-400" />
          <span className="text-sm text-yellow-300 font-medium">МЭТЧ Pro — безлимитный доступ</span>
        </div>
      )}

      <div>
        <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3 font-medium">Выбери пользователя</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {users.map(u => {
            const isLocked = !limit.canUse && selected.id !== u.id;
            return (
              <button key={u.id} onClick={() => handleSelectUser(u)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl flex-shrink-0 transition-all relative ${selected.id === u.id ? "bg-violet-500/20 border border-violet-500/40" : "glass border border-transparent"}`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${u.color} flex items-center justify-center font-black text-white text-sm font-display ${isLocked ? "opacity-40" : ""}`}>{u.avatar}</div>
                {isLocked && <div className="absolute top-3 right-3"><Icon name="Lock" size={12} className="text-white/60" /></div>}
                <span className={`text-xs whitespace-nowrap ${isLocked ? "text-white/30" : "text-white/70"}`}>{u.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass-strong rounded-3xl p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-pink-900/20" />
        <div className="relative flex justify-center mb-4">
          <CompatCircle pct={selected.compat} size={160} stroke={14} />
        </div>
        <h3 className="text-xl font-black text-white font-display relative">{selected.name}</h3>
        <p className="text-white/50 text-sm mt-1 relative">{selected.age} лет · {selected.city}</p>
        <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 glass rounded-full relative">
          <Icon name="Sparkles" size={14} className="text-yellow-400" />
          <span className="text-sm text-white/70">
            {selected.compat >= 90 ? "Исключительная совместимость!" : selected.compat >= 80 ? "Высокая совместимость" : "Хорошая совместимость"}
          </span>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="font-bold text-white font-display text-sm mb-4">Разбивка по категориям</h3>
        <div className="space-y-3">
          {categories.map(c => (
            <div key={c.name}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-white/70">{c.name}</span>
                <span className="text-white font-bold">{c.score}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${c.from} ${c.to} rounded-full transition-all duration-1000`} style={{ width: `${c.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="font-bold text-white font-display text-sm mb-3">История анализа</h3>
        <div className="space-y-2">
          {users.slice(0, 3).map(u => (
            <div key={u.id} className="flex items-center gap-3 p-2.5 glass rounded-xl">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${u.color} flex items-center justify-center text-xs font-black text-white font-display`}>{u.avatar}</div>
              <span className="text-sm text-white/70 flex-1">{u.name}</span>
              <span className="text-sm font-bold gradient-text">{u.compat}%</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => { if (!limit.canUse) { onPaywall(); return; } limit.consume(); setShowTest(true); }}
        className="w-full py-4 bg-gradient-to-r from-violet-500 to-pink-500 rounded-2xl text-white font-bold font-display hover:opacity-90 transition-all active:scale-95 shadow-lg glow-purple"
      >
        {limit.canUse
          ? <><Icon name="PlayCircle" size={18} className="inline mr-2" />Пройти тест совместимости</>
          : <><Icon name="Lock" size={18} className="inline mr-2" />Доступно в Pro</>
        }
      </button>

    </div>
  );
};

// ─── CHAT ─────────────────────────────────────────────────────────────────────
const ChatTab = () => {
  const [activeChat, setActiveChat] = useState<typeof users[0] | null>(null);
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState(messages);

  const send = () => {
    if (!input.trim()) return;
    setLocalMessages(m => [...m, { id: Date.now(), from: "me", text: input, time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }) }]);
    setInput("");
  };

  if (activeChat) return (
    <div className="flex flex-col h-[calc(100vh-180px)] animate-fade-in-up">
      <div className="flex items-center gap-3 p-4 glass-strong rounded-2xl mb-3">
        <button onClick={() => setActiveChat(null)} className="p-2 glass rounded-xl text-white/60 hover:text-white transition-all">
          <Icon name="ArrowLeft" size={16} />
        </button>
        <Avatar user={activeChat} size="sm" />
        <div>
          <div className="font-bold text-white text-sm">{activeChat.name}</div>
          <div className="text-xs text-emerald-400">онлайн</div>
        </div>
        <div className="ml-auto flex gap-2">
          <button className="p-2.5 glass rounded-xl text-white/60 hover:text-white transition-all"><Icon name="Phone" size={15} /></button>
          <button className="p-2.5 glass rounded-xl text-white/60 hover:text-white transition-all"><Icon name="Video" size={15} /></button>
        </div>
      </div>
      <div className="flex justify-center mb-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full">
          <span className="text-xs text-white/50">Совместимость</span>
          <span className="text-sm font-black gradient-text">{activeChat.compat}%</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 px-1 mb-3">
        {localMessages.map(m => (
          <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm ${m.from === "me" ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-br-sm" : "glass text-white/90 rounded-bl-sm"}`}>
              <p>{m.text}</p>
              <p className={`text-xs mt-1 ${m.from === "me" ? "text-white/60" : "text-white/30"}`}>{m.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Написать сообщение..."
          className="flex-1 px-4 py-3 glass-strong rounded-2xl text-white placeholder-white/30 text-sm outline-none border border-transparent focus:border-violet-500/40 transition-all" />
        <button onClick={send} className="p-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-2xl text-white hover:opacity-90 transition-all active:scale-95">
          <Icon name="Send" size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-3 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white font-display">Сообщения</h2>
        <span className="w-6 h-6 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full text-xs text-white flex items-center justify-center font-bold">3</span>
      </div>
      {users.map((u, i) => (
        <button key={u.id} onClick={() => setActiveChat(u)}
          className="w-full glass rounded-2xl p-4 flex items-center gap-4 hover-lift text-left border border-transparent hover:border-violet-500/20 transition-all">
          <Avatar user={u} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <span className="font-bold text-white text-sm">{u.name}</span>
              <span className="text-xs text-white/30">10:3{i}</span>
            </div>
            <p className="text-white/40 text-xs truncate mt-0.5">Привет! Видел, что мы совместимы...</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Icon name="Heart" size={10} className="text-pink-400" />
              <span className="text-xs text-pink-400 font-medium">{u.compat}% совместимость</span>
            </div>
          </div>
          {i < 3 && (
            <div className="w-5 h-5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full text-xs text-white flex items-center justify-center font-bold flex-shrink-0">{i + 1}</div>
          )}
        </button>
      ))}
    </div>
  );
};

// ─── RECOMMENDATIONS ─────────────────────────────────────────────────────────
const RecsTab = () => {
  const [liked, setLiked] = useState<number[]>([]);
  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white font-display">Рекомендации</h2>
        <button className="p-2.5 glass rounded-xl text-white/60 hover:text-white transition-all"><Icon name="RefreshCw" size={15} /></button>
      </div>

      <div className="glass-strong rounded-2xl p-4 flex items-center gap-3 border border-violet-500/20">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon name="Bell" size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-white font-medium">Включи уведомления</p>
          <p className="text-xs text-white/40">Узнавай первым о новых совпадениях</p>
        </div>
        <button className="text-xs px-3 py-1.5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-white font-medium hover:opacity-80 transition-all">Вкл</button>
      </div>

      {recommendations.map((r, i) => (
        <div key={r.id} className="glass rounded-3xl p-5 hover-lift border border-transparent hover:border-violet-500/20 transition-all"
          style={{ animationDelay: `${i * 0.15}s` }}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 glass rounded-full mb-4 text-sm">{r.badge}</div>
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${r.user.color} flex items-center justify-center font-black text-white text-xl font-display`}>{r.user.avatar}</div>
              <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-0.5">
                <CompatCircle pct={r.score} size={28} stroke={3} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white font-display">{r.user.name}</h3>
              <p className="text-white/40 text-xs mt-0.5">{r.user.age} лет · {r.user.city}</p>
              <p className="text-white/60 text-xs mt-2 leading-relaxed">{r.reason}</p>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {r.user.tags.map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 glass rounded-full text-white/50">{t}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setLiked(l => l.includes(r.id) ? l.filter(x => x !== r.id) : [...l, r.id])}
              className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${liked.includes(r.id) ? "bg-pink-500/20 border border-pink-500/40 text-pink-400" : "glass text-white/70 hover:text-white"}`}>
              <Icon name="Heart" size={16} className="inline mr-1.5" />
              {liked.includes(r.id) ? "Понравился" : "Нравится"}
            </button>
            <button className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-white font-medium text-sm hover:opacity-90 transition-all">
              <Icon name="MessageCircle" size={16} className="inline mr-1.5" />
              Написать
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── STATS ────────────────────────────────────────────────────────────────────
const StatsTab = () => {
  const maxActivity = Math.max(...stats.activity);
  return (
    <div className="space-y-4 animate-fade-in-up">
      <h2 className="text-lg font-black text-white font-display">Статистика</h2>

      <div className="glass-strong rounded-3xl p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 to-pink-900/20" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/20 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-white/40 text-sm mb-2">Средняя совместимость</p>
          <div className="text-6xl font-black gradient-text font-display mb-1">{stats.avgCompat}%</div>
          <div className="flex items-center justify-center gap-1.5">
            <Icon name="TrendingUp" size={14} className="text-emerald-400" />
            <span className="text-emerald-400 text-sm">+5% за неделю</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: "Eye", label: "Просмотры", val: stats.views, sub: "+28 сегодня", bg: "from-blue-500/10 to-cyan-500/5", border: "border-blue-500/20", text: "text-blue-400" },
          { icon: "Heart", label: "Матчи", val: stats.matches, sub: "+2 за неделю", bg: "from-pink-500/10 to-rose-500/5", border: "border-pink-500/20", text: "text-pink-400" },
          { icon: "MessageCircle", label: "Сообщений", val: stats.messages, sub: "чатов: 4", bg: "from-violet-500/10 to-purple-500/5", border: "border-violet-500/20", text: "text-violet-400" },
          { icon: "Star", label: "Рейтинг", val: "4.8", sub: "из 5.0", bg: "from-amber-500/10 to-yellow-500/5", border: "border-amber-500/20", text: "text-amber-400" },
        ].map(m => (
          <div key={m.label} className={`glass rounded-2xl p-4 bg-gradient-to-br ${m.bg} border ${m.border}`}>
            <Icon name={m.icon as IconName} size={18} className={`${m.text} mb-2`} />
            <div className="text-2xl font-black text-white font-display">{m.val}</div>
            <div className="text-xs text-white/50 mt-0.5">{m.label}</div>
            <div className={`text-xs ${m.text} mt-1 font-medium`}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="font-bold text-white font-display text-sm mb-4">Активность за неделю</h3>
        <div className="flex items-end gap-2 h-24">
          {stats.activity.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-lg bg-gradient-to-t from-violet-600 to-pink-500 transition-all duration-1000"
                style={{ height: `${(val / maxActivity) * 90}%`, opacity: 0.6 + (val / maxActivity) * 0.4 }} />
              <span className="text-xs text-white/30">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="font-bold text-white font-display text-sm mb-4">По категориям</h3>
        <div className="space-y-3">
          {stats.byCategory.map(c => (
            <div key={c.label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-white/70">{c.label}</span>
                <span className="text-white font-bold">{c.pct}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" style={{ width: `${c.pct}%`, transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="font-bold text-white font-display text-sm mb-4">Последние события</h3>
        <div className="space-y-3">
          {[
            { icon: "Heart", text: "Максим Волков проявил интерес", time: "2 ч назад", color: "text-pink-400" },
            { icon: "Star", text: "Новое совпадение 92%", time: "5 ч назад", color: "text-yellow-400" },
            { icon: "MessageCircle", text: "Дарья написала тебе", time: "вчера", color: "text-blue-400" },
            { icon: "TrendingUp", text: "Рейтинг совместимости вырос", time: "вчера", color: "text-emerald-400" },
          ].map((n, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 glass rounded-xl">
              <div className={`w-8 h-8 rounded-lg glass flex items-center justify-center ${n.color}`}>
                <Icon name={n.icon as IconName} size={14} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/80">{n.text}</p>
                <p className="text-xs text-white/30">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── NAV ─────────────────────────────────────────────────────────────────────
const navItems: { id: Tab; icon: string; label: string }[] = [
  { id: "profile", icon: "User", label: "Профиль" },
  { id: "search", icon: "Search", label: "Поиск" },
  { id: "compat", icon: "Sparkles", label: "Совмест." },
  { id: "chat", icon: "MessageCircle", label: "Чат" },
  { id: "recs", icon: "Heart", label: "Рек." },
  { id: "stats", icon: "BarChart2", label: "Стат." },
];

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function Index() {
  const [tab, setTab] = useState<Tab>("profile");
  const limit = useCompatLimit();
  const [showPaywall, setShowPaywall] = useState(false);

  const renderTab = () => {
    switch (tab) {
      case "profile": return <ProfileTab onGoToChat={() => setTab("chat")} />;
      case "search": return <SearchTab />;
      case "compat": return <CompatTab limit={limit} onPaywall={() => setShowPaywall(true)} />;
      case "chat": return <ChatTab />;
      case "recs": return <RecsTab />;
      case "stats": return <StatsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-violet-700/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-[30%] right-[-15%] w-80 h-80 bg-pink-600/15 rounded-full blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
        <div className="absolute bottom-[10%] left-[20%] w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: "6s" }} />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-20 px-4 pt-4 pb-3 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <h1 className="text-xl font-black font-display gradient-text tracking-wider">МЭТЧ</h1>
          <div className="flex items-center gap-2">
            {!limit.isPro && (
              <button onClick={() => setShowPaywall(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-white text-xs font-bold hover:opacity-90 transition-all">
                <Icon name="Crown" size={12} />
                Pro
              </button>
            )}
            {limit.isPro && (
              <div className="flex items-center gap-1 px-2.5 py-1.5 glass rounded-xl border border-yellow-500/30">
                <Icon name="Crown" size={12} className="text-yellow-400" />
                <span className="text-yellow-400 text-xs font-bold">Pro</span>
              </div>
            )}
            <button className="relative p-2.5 glass rounded-xl text-white/60 hover:text-white transition-all">
              <Icon name="Bell" size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-black text-white font-display">А</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 pb-32 max-w-lg mx-auto relative z-10">
        {renderTab()}
      </div>

      {/* Global paywall */}
      {showPaywall && (
        <PaywallModal onClose={() => setShowPaywall(false)} onUpgrade={() => { limit.upgradeToPro(); setShowPaywall(false); }} />
      )}

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-20">
        <div className="px-4 pb-4 max-w-lg mx-auto">
          <div className="glass-strong rounded-2xl px-2 py-2 flex items-center justify-around border border-white/10 shadow-2xl">
            {navItems.map(n => {
              const active = tab === n.id;
              return (
                <button key={n.id} onClick={() => setTab(n.id)}
                  className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all ${active ? "text-white" : "text-white/30 hover:text-white/60"}`}>
                  <div className={`p-2 rounded-xl transition-all duration-200 ${active ? "bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg" : ""}`}>
                    <Icon name={n.icon as IconName} size={18} />
                  </div>
                  <span className="text-[10px] font-medium leading-none">{n.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}