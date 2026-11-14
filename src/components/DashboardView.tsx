import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CalendarCheck2,
  Coffee,
  Loader2,
  Plus,
  Send,
  Sparkles,
  Sun,
  Trash2,
  Utensils,
} from 'lucide-react';
import { getSmartGapFillers } from '../data/indianFoods';
import {
  AbsorptionSettings,
  DailyTargets,
  IndianFoodItem,
  LoggedFood,
  RecoveryPlan,
  SunSession,
  UserProfile,
} from '../types/vita';
import { INDIAN_CITIES, getEffectiveFoodVitaminD } from '../utils/calculator';
import { DualRadialRings } from './DualRadialRings';
import { SolarArcWidget } from './SolarArcWidget';

interface DashboardViewProps {
  profile: UserProfile;
  targets: DailyTargets;
  loggedFoods: LoggedFood[];
  sunSessions: SunSession[];
  absorption: AbsorptionSettings;
  recoveryPlan: RecoveryPlan | null;
  onToggleAbsorption: (key: keyof AbsorptionSettings) => void;
  onLogDatabaseFood: (food: IndianFoodItem) => void;
  onLogCustomFood: (food: Omit<LoggedFood, 'id' | 'timestamp'>) => void;
  onDeleteFood: (id: string) => void;
  onDeleteSunSession: (id: string) => void;
  onSetRecoveryPlan: (plan: RecoveryPlan) => void;
  onNavigateCalculator: () => void;
  onNavigateFoods: () => void;
  onNavigateSunTimer: () => void;
}

const SAMPLE_MEAL_PROMPTS = [
  '2 paneer parathas with a bowl of dahi and 1 glass milk',
  '2 boiled eggs with ghee toast and masala chai',
  '100g rohu fish curry with steamed rice and chaas',
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  targets,
  loggedFoods,
  sunSessions,
  absorption,
  recoveryPlan,
  onToggleAbsorption,
  onLogDatabaseFood,
  onLogCustomFood,
  onDeleteFood,
  onDeleteSunSession,
  onSetRecoveryPlan,
  onNavigateCalculator,
  onNavigateFoods,
  onNavigateSunTimer,
}) => {
  const [mealInput, setMealInput] = useState('');
  const [mealLoading, setMealLoading] = useState(false);
  const [mealError, setMealError] = useState<string | null>(null);
  const [lastAiTip, setLastAiTip] = useState<string | null>(null);

  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);

  const foodVitaminD_IU = useMemo(
    () =>
      loggedFoods.reduce(
        (sum, item) => sum + getEffectiveFoodVitaminD(item, absorption.healthyFatsPaired),
        0
      ),
    [loggedFoods, absorption.healthyFatsPaired]
  );

  const sunVitaminD_IU = useMemo(
    () => sunSessions.reduce((sum, s) => sum + s.synthesizedIU, 0),
    [sunSessions]
  );

  const totalVitaminB12_mcg = useMemo(
    () =>
      Math.round(loggedFoods.reduce((sum, item) => sum + item.vitaminB12_mcg, 0) * 100) / 100,
    [loggedFoods]
  );

  const remainingD_IU = Math.max(0, targets.vitaminD_IU - (foodVitaminD_IU + sunVitaminD_IU));
  const remainingB12_mcg = Math.max(
    0,
    Math.round((targets.vitaminB12_mcg - totalVitaminB12_mcg) * 100) / 100
  );

  const gapFillers = useMemo(
    () =>
      getSmartGapFillers(
        profile.dietType,
        remainingB12_mcg,
        remainingD_IU,
        targets.vitaminB12_mcg,
        targets.vitaminD_IU
      ),
    [profile.dietType, remainingB12_mcg, remainingD_IU, targets.vitaminB12_mcg, targets.vitaminD_IU]
  );

  const cityInfo = INDIAN_CITIES.find((c) => c.city === profile.city) ?? INDIAN_CITIES[0];

  const handleAnalyzeMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = mealInput.trim();
    if (!trimmed || mealLoading) return;

    setMealLoading(true);
    setMealError(null);

    try {
      const response = await fetch('/api/analyze-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealText: trimmed,
          dietType: profile.dietType,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze Indian meal.');
      }

      onLogCustomFood({
        name: data.mealName,
        serving: data.servingSummary,
        vitaminB12_mcg: data.vitaminB12_mcg,
        vitaminD_IU: data.vitaminD_IU,
        isFatPaired: data.isFatPaired,
        hasTanninWarning: data.hasTanninWarning,
        absorptionNote: data.absorptionTip,
        source: 'gemini-ai',
      });

      setLastAiTip(
        `${data.mealName}: +${data.vitaminB12_mcg} µg B12, +${data.vitaminD_IU} IU D. ${data.absorptionTip}`
      );
      setMealInput('');
    } catch (err) {
      setMealError(err instanceof Error ? err.message : 'Unable to analyze meal right now.');
    } finally {
      setMealLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    if (planLoading) return;
    setPlanLoading(true);
    setPlanError(null);

    try {
      const response = await fetch('/api/recovery-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vitaminDDeficitIU: remainingD_IU,
          vitaminB12DeficitMcg: remainingB12_mcg,
          dietType: profile.dietType,
          skinType: profile.fitzpatrickType,
          city: cityInfo.city,
          optimalSunWindow: cityInfo.optimalWindow,
          symptoms: profile.symptoms,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate recovery plan.');
      }
      onSetRecoveryPlan(data);
    } catch (err) {
      setPlanError(err instanceof Error ? err.message : 'Unable to generate recovery plan.');
    } finally {
      setPlanLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Row 1: Dual Rings (8 cols) + Solar Arc (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 flex">
          <div className="w-full">
            <DualRadialRings
              foodVitaminD_IU={foodVitaminD_IU}
              sunVitaminD_IU={sunVitaminD_IU}
              totalVitaminB12_mcg={totalVitaminB12_mcg}
              targets={targets}
              healthyFatsActive={absorption.healthyFatsPaired}
              onOpenCalculator={onNavigateCalculator}
            />
          </div>
        </div>

        <div className="lg:col-span-4 flex">
          <div className="w-full">
            <SolarArcWidget
              city={profile.city}
              fitzpatrickType={profile.fitzpatrickType}
              sunVitaminD_IU={sunVitaminD_IU}
              onLaunchSunTimer={onNavigateSunTimer}
            />
          </div>
        </div>
      </div>

      {/* Row 2: Absorption Synergy Engine */}
      <section
        aria-label="Absorption Synergy Controls"
        className="glass-panel rounded-3xl p-5 sm:p-6 space-y-4"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white">Absorption Synergy Engine</h2>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Bioavailability multipliers adjust real-time Vitamin D uptake and alert on Indian
              dietary blockers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={absorption.healthyFatsPaired}
              onClick={() => onToggleAbsorption('healthyFatsPaired')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-medium border transition-colors flex items-center gap-2.5 cursor-pointer ${
                absorption.healthyFatsPaired
                  ? 'bg-[#10B981]/15 border-[#10B981]/50 text-white'
                  : 'bg-white/[0.04] border-white/12 text-[#bcc9cd] hover:text-white'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  absorption.healthyFatsPaired ? 'bg-[#4edea3]' : 'bg-white/25'
                }`}
              />
              <span>Meal included healthy fats (Ghee / Nuts / Oil) · +25% D</span>
            </button>

            <button
              type="button"
              role="switch"
              aria-checked={absorption.chaiWithin30Mins}
              onClick={() => onToggleAbsorption('chaiWithin30Mins')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-medium border transition-colors flex items-center gap-2.5 cursor-pointer ${
                absorption.chaiWithin30Mins
                  ? 'bg-[#FF9F0A]/15 border-[#FF9F0A]/50 text-white'
                  : 'bg-white/[0.04] border-white/12 text-[#bcc9cd] hover:text-white'
              }`}
            >
              <Coffee className="w-3.5 h-3.5 text-[#ffb95f]" />
              <span>Had Chai / Coffee within 30 mins of meal</span>
            </button>
          </div>
        </div>

        {absorption.chaiWithin30Mins && (
          <div className="rounded-2xl p-4 bg-[#FF9F0A]/12 border border-[#FF9F0A]/35 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-[#ffb95f] shrink-0 mt-0.5" />
            <div className="text-xs text-[#ffddb8] leading-relaxed">
              <span className="font-semibold text-white">Tannin Absorption Blocker Alert:</span>{' '}
              Polyphenols and tannins in black tea (chai) and coffee bind non-heme iron and impair
              mucosal micronutrient transport. Maintain a{' '}
              <span className="font-semibold text-white">45-minute gap</span> before or after
              fortified meals, curd, or B12 supplements.
            </div>
          </div>
        )}
      </section>

      {/* Row 3: Gemini AI Meal Logger + AI 1-Day Recovery Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section
          aria-label="Natural Language Indian Meal Logger"
          className="lg:col-span-7 glass-panel rounded-3xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Indian Meal &amp; Protocol AI</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Describe any home-cooked Indian meal in plain English to parse B12, Vitamin D, and
                fat pairing.
              </p>
            </div>
            <Sparkles className="w-4 h-4 text-[#06B6D4] shrink-0" />
          </div>

          <form onSubmit={handleAnalyzeMeal} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={mealInput}
              onChange={(e) => setMealInput(e.target.value)}
              placeholder='e.g. "2 paneer parathas with a bowl of dahi and 1 glass milk"'
              className="flex-1 h-12 px-4 rounded-xl glass-control text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#06B6D4]"
            />
            <button
              type="submit"
              disabled={mealLoading || !mealInput.trim()}
              className="h-12 px-5 rounded-full bg-[#06B6D4] hover:bg-[#22d3ee] disabled:opacity-50 text-[#051424] font-semibold text-xs inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              {mealLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Analyze &amp; Log</span>
                </>
              )}
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#869397]">Try:</span>
            {SAMPLE_MEAL_PROMPTS.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => setMealInput(sample)}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 text-[#bcc9cd] hover:text-white transition-colors text-left cursor-pointer"
              >
                {sample}
              </button>
            ))}
          </div>

          {mealError && (
            <div className="p-3 rounded-xl bg-[#93000a]/40 border border-[#ffb4ab]/30 text-xs text-[#ffdad6]">
              {mealError}
            </div>
          )}

          {lastAiTip && (
            <div className="p-3.5 rounded-2xl bg-[#06B6D4]/10 border border-[#06B6D4]/30 text-xs text-[#d4e4fa] leading-relaxed">
              {lastAiTip}
            </div>
          )}
        </section>

        {/* AI 1-Day Recovery Plan Trigger & Display */}
        <section
          aria-label="AI 1-Day Deficiency Recovery Plan"
          className="lg:col-span-5 glass-panel rounded-3xl p-6 space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">AI 1-Day Recovery Plan</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Tomorrow&apos;s meal + outdoor plan tuned to your{' '}
                <span className="tabular-metric text-white">{remainingD_IU} IU</span> D &amp;{' '}
                <span className="tabular-metric text-white">{remainingB12_mcg.toFixed(2)} µg</span>{' '}
                B12 gap.
              </p>
            </div>
            <CalendarCheck2 className="w-4 h-4 text-[#F59E0B] shrink-0" />
          </div>

          <button
            type="button"
            onClick={handleGeneratePlan}
            disabled={planLoading}
            className="w-full h-11 rounded-full bg-[#F59E0B] hover:bg-[#fbbf24] disabled:opacity-50 text-[#051424] font-semibold text-xs inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {planLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Building Indian Recovery Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {recoveryPlan ? 'Regenerate 1-Day Recovery Plan' : 'Generate 1-Day Recovery Plan'}
                </span>
              </>
            )}
          </button>

          {planError && (
            <div className="p-3 rounded-xl bg-[#93000a]/40 border border-[#ffb4ab]/30 text-xs text-[#ffdad6]">
              {planError}
            </div>
          )}

          {recoveryPlan ? (
            <div className="space-y-3 pt-1">
              <div className="text-xs font-semibold text-[#4edea3]">{recoveryPlan.headline}</div>

              <div className="p-3 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/25 text-xs space-y-1">
                <div className="font-semibold text-white">
                  {recoveryPlan.sunlightProtocol.exercise} ·{' '}
                  {recoveryPlan.sunlightProtocol.durationMinutes} min (
                  {recoveryPlan.sunlightProtocol.window})
                </div>
                <div className="text-[#ffddb8]">
                  Est. +{recoveryPlan.sunlightProtocol.expectedIU} IU ·{' '}
                  {recoveryPlan.sunlightProtocol.tip}
                </div>
              </div>

              <ul className="divide-y divide-white/10">
                {recoveryPlan.meals.map((m, idx) => (
                  <li key={idx} className="py-2 text-xs space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-white">
                        {m.slot}: {m.dish}
                      </span>
                      <span className="tabular-metric text-[#06B6D4] shrink-0">
                        {m.vitaminB12_mcg}µg · {m.vitaminD_IU}IU
                      </span>
                    </div>
                    <div className="text-[#94a3b8]">
                      {m.portion} — {m.synergyNote}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="text-[11px] text-[#ffb95f] pt-1">{recoveryPlan.avoidanceRule}</div>
            </div>
          ) : (
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Click above to synthesize a personalized Indian menu and {cityInfo.city} sun schedule
              matching your dietary preference.
            </p>
          )}
        </section>
      </div>

      {/* Row 4: Smart Gap-Filler Recommender (Top 3) */}
      <section aria-label="Smart Gap-Filler Indian Foods" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Smart Gap-Filler Recommendations</h2>
            <p className="text-xs text-[#94a3b8]">
              Top 3 bioavailable matches for your diet that best close today&apos;s remaining B12
              and D gap.
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateFoods}
            className="text-xs font-medium text-[#06B6D4] hover:text-[#4cd7f6] transition-colors cursor-pointer"
          >
            Browse all 24 Indian foods →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gapFillers.map((food) => {
            const effectiveD = Math.round(
              food.vitaminD_IU * (food.hasHealthyFat || absorption.healthyFatsPaired ? 1.25 : 1)
            );
            return (
              <article
                key={food.id}
                className="glass-panel rounded-3xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-white">{food.name}</h3>
                    <span className="text-xs text-[#94a3b8] shrink-0">{food.dietTag}</span>
                  </div>
                  <div className="text-xs text-[#94a3b8]">
                    {food.servingSize} ·{' '}
                    <span className="tabular-metric text-[#06B6D4]">
                      +{food.vitaminB12_mcg} µg B12
                    </span>{' '}
                    ·{' '}
                    <span className="tabular-metric text-[#F59E0B]">+{effectiveD} IU D</span>
                  </div>
                  <p className="text-xs text-[#bcc9cd] leading-relaxed">
                    {food.bioavailabilityNote}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onLogDatabaseFood(food)}
                  className="w-full h-10 rounded-full bg-white/[0.08] hover:bg-[#06B6D4] text-white hover:text-[#051424] border border-white/15 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Serving</span>
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* Row 5: Today's Logged Foods & Sun Sessions */}
      <section aria-label="Today's Intake & Sun Log" className="glass-panel rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <h2 className="text-lg font-semibold text-white">Today&apos;s Nutrition &amp; Sun Log</h2>
          <span className="text-xs text-[#94a3b8] tabular-metric">
            {loggedFoods.length} meals · {sunSessions.length} sun sessions
          </span>
        </div>

        {loggedFoods.length === 0 && sunSessions.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <p className="text-sm text-[#bcc9cd]">No meals or sun exposure logged today yet.</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={onNavigateFoods}
                className="px-4 py-2 rounded-full text-xs font-medium bg-[#06B6D4] text-[#051424] cursor-pointer"
              >
                Log Indian Food
              </button>
              <button
                type="button"
                onClick={onNavigateSunTimer}
                className="px-4 py-2 rounded-full text-xs font-medium bg-[#F59E0B] text-[#051424] cursor-pointer"
              >
                Start Sun Timer
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {loggedFoods.map((item) => {
              const effD = getEffectiveFoodVitaminD(item, absorption.healthyFatsPaired);
              return (
                <div
                  key={item.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#06B6D4]/15 border border-[#06B6D4]/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Utensils className="w-3.5 h-3.5 text-[#4cd7f6]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">{item.name}</div>
                      <div className="text-xs text-[#94a3b8]">
                        {item.serving} · {item.timestamp}
                        {item.source === 'gemini-ai' && ' · AI Parsed'}
                        {(item.isFatPaired || absorption.healthyFatsPaired) &&
                          item.vitaminD_IU > 0 && (
                            <span className="text-[#4edea3]"> · +25% Fat Synergy</span>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <div className="text-xs tabular-metric space-x-3">
                      <span className="text-[#06B6D4] font-semibold">
                        +{item.vitaminB12_mcg.toFixed(2)} µg B12
                      </span>
                      <span className="text-[#F59E0B] font-semibold">+{effD} IU D</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteFood(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="p-2 rounded-lg text-[#94a3b8] hover:text-[#ffb4ab] hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {sunSessions.map((session) => (
              <div
                key={session.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Sun className="w-3.5 h-3.5 text-[#F59E0B]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {session.exercise}
                    </div>
                    <div className="text-xs text-[#94a3b8]">
                      {session.durationMinutes} min outdoor ·{' '}
                      {session.exposureArea === 'shorts-tshirt'
                        ? 'Shorts & T-Shirt'
                        : 'Face & Forearms'}{' '}
                      · {session.timestamp}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <div className="text-xs tabular-metric">
                    <span className="text-[#F59E0B] font-semibold">
                      +{session.synthesizedIU} IU D
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteSunSession(session.id)}
                    aria-label={`Remove ${session.exercise}`}
                    className="p-2 rounded-lg text-[#94a3b8] hover:text-[#ffb4ab] hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
