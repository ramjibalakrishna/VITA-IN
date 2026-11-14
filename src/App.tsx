import { useEffect, useMemo, useState } from 'react';
import { Calculator, LayoutDashboard, RotateCcw, Sun, Utensils } from 'lucide-react';
import { CalculatorView } from './components/CalculatorView';
import { DashboardView } from './components/DashboardView';
import { FoodDatabaseView } from './components/FoodDatabaseView';
import { SunTimerView } from './components/SunTimerView';
import {
  AbsorptionSettings,
  AppView,
  IndianFoodItem,
  LoggedFood,
  RecoveryPlan,
  SunSession,
  UserProfile,
} from './types/vita';
import {
  DEFAULT_PROFILE,
  DEMO_LOGGED_FOODS,
  DEMO_SUN_SESSIONS,
  calculateDailyTargets,
} from './utils/calculator';

const STORAGE_KEYS = {
  profile: 'vita-in-profile-v1',
  foods: 'vita-in-foods-v1',
  sun: 'vita-in-sun-v1',
  absorption: 'vita-in-synergy-v1',
  plan: 'vita-in-plan-v1',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const NAV_ITEMS: { id: AppView; label: string; shortLabel: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', shortLabel: 'Home', icon: LayoutDashboard },
  { id: 'calculator', label: 'Risk Calculator', shortLabel: 'Calculator', icon: Calculator },
  { id: 'foods', label: 'Indian Foods', shortLabel: 'Foods', icon: Utensils },
  { id: 'sun-timer', label: 'Sun & Exercise', shortLabel: 'Sun Timer', icon: Sun },
];

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('dashboard');

  const [profile, setProfile] = useState<UserProfile>(() =>
    loadFromStorage<UserProfile>(STORAGE_KEYS.profile, DEFAULT_PROFILE)
  );
  const [loggedFoods, setLoggedFoods] = useState<LoggedFood[]>(() =>
    loadFromStorage<LoggedFood[]>(STORAGE_KEYS.foods, DEMO_LOGGED_FOODS)
  );
  const [sunSessions, setSunSessions] = useState<SunSession[]>(() =>
    loadFromStorage<SunSession[]>(STORAGE_KEYS.sun, DEMO_SUN_SESSIONS)
  );
  const [absorption, setAbsorption] = useState<AbsorptionSettings>(() =>
    loadFromStorage<AbsorptionSettings>(STORAGE_KEYS.absorption, {
      healthyFatsPaired: true,
      chaiWithin30Mins: false,
    })
  );
  const [recoveryPlan, setRecoveryPlan] = useState<RecoveryPlan | null>(() =>
    loadFromStorage<RecoveryPlan | null>(STORAGE_KEYS.plan, null)
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.foods, JSON.stringify(loggedFoods));
  }, [loggedFoods]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.sun, JSON.stringify(sunSessions));
  }, [sunSessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.absorption, JSON.stringify(absorption));
  }, [absorption]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.plan, JSON.stringify(recoveryPlan));
  }, [recoveryPlan]);

  const targets = useMemo(() => calculateDailyTargets(profile), [profile]);

  const nowTimeLabel = () =>
    new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  const handleApplyProfile = (nextProfile: UserProfile) => {
    setProfile(nextProfile);
    setActiveView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogDatabaseFood = (food: IndianFoodItem) => {
    const newEntry: LoggedFood = {
      id: `food-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: food.name,
      serving: food.servingSize,
      vitaminB12_mcg: food.vitaminB12_mcg,
      vitaminD_IU: food.vitaminD_IU,
      isFatPaired: food.hasHealthyFat,
      absorptionNote: food.bioavailabilityNote,
      source: 'database',
      timestamp: nowTimeLabel(),
    };
    setLoggedFoods((prev) => [newEntry, ...prev]);
  };

  const handleLogCustomFood = (food: Omit<LoggedFood, 'id' | 'timestamp'>) => {
    const newEntry: LoggedFood = {
      ...food,
      id: `ai-food-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: nowTimeLabel(),
    };
    setLoggedFoods((prev) => [newEntry, ...prev]);
    if (food.hasTanninWarning) {
      setAbsorption((prev) => ({ ...prev, chaiWithin30Mins: true }));
    }
  };

  const handleLogSunSession = (session: Omit<SunSession, 'id' | 'timestamp'>) => {
    const newSession: SunSession = {
      ...session,
      id: `sun-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: nowTimeLabel(),
    };
    setSunSessions((prev) => [newSession, ...prev]);
  };

  const handleResetDemoData = () => {
    setProfile(DEFAULT_PROFILE);
    setLoggedFoods(DEMO_LOGGED_FOODS);
    setSunSessions(DEMO_SUN_SESSIONS);
    setAbsorption({ healthyFatsPaired: true, chaiWithin30Mins: false });
    setRecoveryPlan(null);
    setActiveView('dashboard');
  };

  return (
    <div className="min-h-screen glass-canvas overflow-x-hidden pb-20 md:pb-12">
      {/* Ambient Radial Luminescence Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      >
        <div
          className="absolute -top-32 -left-24 w-[460px] h-[460px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.14) 0%, transparent 70%)',
            filter: 'blur(72px)',
          }}
        />
        <div
          className="absolute top-1/3 -right-24 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.14) 0%, transparent 70%)',
            filter: 'blur(72px)',
          }}
        />
      </div>

      {/* Top Navigation Bar — 3-Zone Contract */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#051424]/75 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single Text Element) */}
          <button
            type="button"
            onClick={() => setActiveView('dashboard')}
            className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            VITA-IN
          </button>

          {/* Zone 2: Single-line Text Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium"
          >
            {NAV_ITEMS.map((item) => {
              const active = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveView(item.id)}
                  className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'text-white border-[#06B6D4]'
                      : 'text-[#94a3b8] border-transparent hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleResetDemoData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-[#d4e4fa] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {activeView === 'dashboard' && (
          <DashboardView
            profile={profile}
            targets={targets}
            loggedFoods={loggedFoods}
            sunSessions={sunSessions}
            absorption={absorption}
            recoveryPlan={recoveryPlan}
            onToggleAbsorption={(key) =>
              setAbsorption((prev) => ({ ...prev, [key]: !prev[key] }))
            }
            onLogDatabaseFood={handleLogDatabaseFood}
            onLogCustomFood={handleLogCustomFood}
            onDeleteFood={(id) =>
              setLoggedFoods((prev) => prev.filter((item) => item.id !== id))
            }
            onDeleteSunSession={(id) =>
              setSunSessions((prev) => prev.filter((item) => item.id !== id))
            }
            onSetRecoveryPlan={(plan) => setRecoveryPlan(plan)}
            onNavigateCalculator={() => setActiveView('calculator')}
            onNavigateFoods={() => setActiveView('foods')}
            onNavigateSunTimer={() => setActiveView('sun-timer')}
          />
        )}

        {activeView === 'calculator' && (
          <CalculatorView initialProfile={profile} onApplyProfile={handleApplyProfile} />
        )}

        {activeView === 'foods' && (
          <FoodDatabaseView
            userDiet={profile.dietType}
            targets={targets}
            healthyFatsActive={absorption.healthyFatsPaired}
            onLogFood={handleLogDatabaseFood}
          />
        )}

        {activeView === 'sun-timer' && (
          <SunTimerView
            fitzpatrickType={profile.fitzpatrickType}
            city={profile.city}
            defaultExposureArea={profile.exposureArea}
            sunSessions={sunSessions}
            onLogSunSession={handleLogSunSession}
            onNavigateDashboard={() => setActiveView('dashboard')}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation (<15% mobile height) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/15 bg-[#051424]/90 backdrop-blur-2xl px-2 py-1.5"
      >
        <div className="grid grid-cols-4 gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px] font-medium transition-colors cursor-pointer ${
                  active ? 'text-[#4cd7f6] bg-white/[0.08]' : 'text-[#94a3b8]'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="truncate max-w-full">{item.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
