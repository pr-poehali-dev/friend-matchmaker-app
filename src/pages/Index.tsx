import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useCompatLimit, navItems, Tab } from "@/lib/matchData";
import { PaywallModal, NotificationsModal } from "@/components/match/Modals";
import { ProfileTab, SearchTab, CompatTab, ChatTab, RecsTab, StatsTab } from "@/components/match/Tabs";

type IconName = string;

export default function Index() {
  const [tab, setTab] = useState<Tab>("profile");
  const limit = useCompatLimit();
  const [showPaywall, setShowPaywall] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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
            {limit.isTrialActive && !limit.isPro && (
              <button onClick={() => setShowPaywall(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white text-xs font-bold hover:opacity-90 transition-all">
                <Icon name="Gift" size={12} />
                Триал {limit.trialDaysLeft}д
              </button>
            )}
            {!limit.effectivePro && (
              <button onClick={() => setShowPaywall(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl text-white text-xs font-bold hover:opacity-90 transition-all">
                <Icon name="Crown" size={12} />
                Pro
              </button>
            )}
            {limit.isPro && (
              <button onClick={() => setShowPaywall(true)} className="flex items-center gap-1 px-2.5 py-1.5 glass rounded-xl border border-yellow-500/30 hover:border-yellow-500/60 transition-all">
                <Icon name="Crown" size={12} className="text-yellow-400" />
                <span className="text-yellow-400 text-xs font-bold">Pro</span>
              </button>
            )}
            <button onClick={() => setShowNotifications(true)} className="relative p-2.5 glass rounded-xl text-white/60 hover:text-white transition-all">
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

      {/* Notifications */}
      {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}

      {/* Global paywall */}
      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          onUpgrade={() => { limit.upgradeToPro(); setShowPaywall(false); }}
          isPro={limit.isPro}
          onCancel={() => { limit.cancelPro(); setShowPaywall(false); }}
        />
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
