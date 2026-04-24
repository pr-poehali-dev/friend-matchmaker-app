import { useState } from "react";
import Icon from "@/components/ui/icon";
import { myProfile, notificationsList, viewersList, matchesList, stats, getZodiac } from "@/lib/matchData";

type IconName = string;

// ─── PaywallModal ─────────────────────────────────────────────────────────────
export const PaywallModal = ({ onClose, onUpgrade, isPro, onCancel }: { onClose: () => void; onUpgrade: () => void; isPro?: boolean; onCancel?: () => void }) => {
  const plans = [
    { id: "month", label: "1 месяц", price: "299 ₽", per: "в месяц", popular: false },
    { id: "year", label: "1 год", price: "1 990 ₽", per: "167 ₽/мес", popular: true },
  ];
  const [selected, setSelected] = useState("year");
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (isPro && confirmCancel) return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-[hsl(240,15%,8%)] rounded-t-3xl p-6 pb-10 border-t border-white/10 animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />
        <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Icon name="AlertTriangle" size={28} className="text-red-400" />
        </div>
        <h2 className="text-xl font-black text-white font-display text-center mb-2">Отключить подписку?</h2>
        <p className="text-white/50 text-sm text-center mb-6">Ты потеряешь доступ к безлимитным функциям. Уверен?</p>
        <button onClick={() => { onCancel?.(); onClose(); }} className="w-full py-4 bg-red-500/20 border border-red-500/40 rounded-2xl text-red-400 font-bold text-sm hover:bg-red-500/30 transition-all mb-3">
          Да, отключить подписку
        </button>
        <button onClick={() => setConfirmCancel(false)} className="w-full py-3 text-white/40 text-sm hover:text-white/60 transition-colors">
          Отмена
        </button>
      </div>
    </div>
  );

  if (isPro) return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-[hsl(240,15%,8%)] rounded-t-3xl p-6 pb-10 border-t border-white/10 animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
          <Icon name="Crown" size={28} className="text-white" />
        </div>
        <h2 className="text-2xl font-black text-white font-display text-center mb-1">МЭТЧ Pro активен</h2>
        <p className="text-white/50 text-sm text-center mb-6">У тебя активна подписка с полным доступом ко всем функциям.</p>
        <div className="space-y-2.5 mb-6">
          {[
            { icon: "Infinity", text: "Безлимитные проверки совместимости" },
            { icon: "Sparkles", text: "Детальный анализ по 10 категориям" },
            { icon: "MessageCircle", text: "Неограниченные чаты" },
            { icon: "Star", text: "Приоритет в рекомендациях" },
          ].map(b => (
            <div key={b.text} className="flex items-center gap-3">
              <div className="w-7 h-7 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={b.icon as IconName} size={14} className="text-yellow-400" />
              </div>
              <span className="text-sm text-white/80">{b.text}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl text-white font-bold font-display text-lg hover:opacity-90 transition-all mb-3">
          Отлично!
        </button>
        <button onClick={() => setConfirmCancel(true)} className="w-full py-3 text-white/30 text-sm hover:text-red-400 transition-colors">
          Отключить подписку
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-[hsl(240,15%,8%)] rounded-t-3xl p-6 pb-10 border-t border-white/10 animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />
        <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
          <Icon name="Crown" size={28} className="text-white" />
        </div>
        <h2 className="text-2xl font-black text-white font-display text-center mb-1">МЭТЧ Pro</h2>
        <p className="text-white/50 text-sm text-center mb-6">
          Бесплатные запросы закончились. Оформи подписку и открой безлимитный доступ.
        </p>
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

// ─── NotificationsModal ───────────────────────────────────────────────────────
export const NotificationsModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
    <div className="relative w-full max-w-lg bg-[hsl(240,15%,8%)] rounded-t-3xl p-6 pb-10 border-t border-white/10 animate-fade-in-up max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
      <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center relative">
          <Icon name="Bell" size={18} className="text-violet-400" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">3</span>
        </div>
        <div>
          <h2 className="text-lg font-black text-white font-display">Уведомления</h2>
          <p className="text-xs text-white/40">3 непрочитанных</p>
        </div>
        <button onClick={onClose} className="ml-auto p-2 glass rounded-xl text-white/40 hover:text-white transition-all">
          <Icon name="X" size={16} />
        </button>
      </div>
      <div className="overflow-y-auto space-y-2 flex-1">
        {notificationsList.map(n => (
          <div key={n.id} className={`flex items-start gap-3 p-3.5 rounded-2xl transition-all ${n.unread ? "glass border border-violet-500/20" : "glass opacity-70"}`}>
            <div className={`w-9 h-9 ${n.bg} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
              <Icon name={n.icon as IconName} size={16} className={n.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm leading-snug ${n.unread ? "text-white" : "text-white/60"}`}>{n.text}</p>
              <p className="text-xs text-white/30 mt-1">{n.sub}</p>
            </div>
            {n.unread && <div className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0 mt-2" />}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── EditProfileModal ─────────────────────────────────────────────────────────
export const EditProfileModal = ({ onClose }: { onClose: () => void }) => {
  const [form, setForm] = useState({
    name: myProfile.name,
    age: String(myProfile.age),
    city: myProfile.city,
    bio: myProfile.bio,
    birthdate: myProfile.birthdate,
    goal: "Серьёзные отношения",
    gender: "Женщина",
    lookingFor: "Мужчину",
  });
  const zodiac = getZodiac(form.birthdate);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-[hsl(240,15%,8%)] rounded-t-3xl p-6 pb-10 border-t border-white/10 animate-fade-in-up max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
            <Icon name="Pencil" size={18} className="text-violet-400" />
          </div>
          <h2 className="text-lg font-black text-white font-display">Редактировать профиль</h2>
          <button onClick={onClose} className="ml-auto p-2 glass rounded-xl text-white/40 hover:text-white transition-all">
            <Icon name="X" size={16} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="text-xs text-white/40 uppercase tracking-wider font-medium mb-2 block">Имя и фамилия</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-3 glass-strong rounded-2xl text-white text-sm outline-none border border-transparent focus:border-violet-500/40 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 uppercase tracking-wider font-medium mb-2 block">Возраст</label>
              <input value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} type="number"
                className="w-full px-4 py-3 glass-strong rounded-2xl text-white text-sm outline-none border border-transparent focus:border-violet-500/40 transition-all" />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-wider font-medium mb-2 block">Город</label>
              <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                className="w-full px-4 py-3 glass-strong rounded-2xl text-white text-sm outline-none border border-transparent focus:border-violet-500/40 transition-all" />
            </div>
          </div>
          <div>
            <label className="text-xs text-white/40 uppercase tracking-wider font-medium mb-2 block">Дата рождения</label>
            <input value={form.birthdate} onChange={e => setForm(f => ({ ...f, birthdate: e.target.value }))} type="date"
              className="w-full px-4 py-3 glass-strong rounded-2xl text-white text-sm outline-none border border-transparent focus:border-violet-500/40 transition-all" />
            {form.birthdate && (
              <div className="mt-2 flex items-center gap-2 px-3 py-2 glass rounded-xl">
                <span className="text-lg">{zodiac.emoji}</span>
                <span className="text-sm text-white/70">{zodiac.sign} · стихия {zodiac.element}</span>
              </div>
            )}
          </div>
          <div>
            <label className="text-xs text-white/40 uppercase tracking-wider font-medium mb-2 block">Пол</label>
            <div className="flex gap-2">
              {["Женщина", "Мужчина"].map(g => (
                <button key={g} onClick={() => setForm(f => ({ ...f, gender: g }))}
                  className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all ${form.gender === g ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white" : "glass text-white/60 hover:text-white"}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-white/40 uppercase tracking-wider font-medium mb-2 block">Ищу</label>
            <div className="flex gap-2">
              {["Мужчину", "Женщину", "Не важно"].map(g => (
                <button key={g} onClick={() => setForm(f => ({ ...f, lookingFor: g }))}
                  className={`flex-1 py-2.5 rounded-2xl text-xs font-medium transition-all ${form.lookingFor === g ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white" : "glass text-white/60 hover:text-white"}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-white/40 uppercase tracking-wider font-medium mb-2 block">Цель знакомства</label>
            <div className="grid grid-cols-2 gap-2">
              {["Серьёзные отношения", "Дружба", "Общение", "Не определился"].map(g => (
                <button key={g} onClick={() => setForm(f => ({ ...f, goal: g }))}
                  className={`py-2.5 rounded-2xl text-xs font-medium transition-all ${form.goal === g ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white" : "glass text-white/60 hover:text-white"}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-white/40 uppercase tracking-wider font-medium mb-2 block">О себе</label>
            <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3}
              className="w-full px-4 py-3 glass-strong rounded-2xl text-white text-sm outline-none border border-transparent focus:border-violet-500/40 transition-all resize-none" />
          </div>
        </div>
        <button onClick={onClose} className="w-full mt-4 py-4 bg-gradient-to-r from-violet-500 to-pink-500 rounded-2xl text-white font-bold font-display text-base hover:opacity-90 transition-all active:scale-95">
          Сохранить
        </button>
      </div>
    </div>
  );
};

// ─── ViewersModal ─────────────────────────────────────────────────────────────
export const ViewersModal = ({ onClose }: { onClose: () => void }) => (
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

// ─── MatchesModal ─────────────────────────────────────────────────────────────
export const MatchesModal = ({ onClose }: { onClose: () => void }) => (
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
