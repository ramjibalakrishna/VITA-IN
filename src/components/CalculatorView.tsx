import React, { useMemo, useState } from 'react';
import { ArrowRight, Check, ShieldAlert, Sun, Zap } from 'lucide-react';
import {
  DietType,
  ExposureArea,
  FitzpatrickType,
  SunWindow,
  SymptomId,
  UserProfile,
} from '../types/vita';
import {
  FITZPATRICK_SCALE,
  INDIAN_CITIES,
  SYMPTOM_OPTIONS,
  calculateDailyTargets,
  formatDietLabel,
} from '../utils/calculator';

interface CalculatorViewProps {
  initialProfile: UserProfile;
  onApplyProfile: (profile: UserProfile) => void;
}

const DIET_OPTIONS: { value: DietType; label: string; shortNote: string }[] = [
  { value: 'strict-vegan', label: 'Strict Vegan', shortNote: '+40 B12 risk · 2.4 µg target' },
  { value: 'lacto-veg', label: 'Lacto-Vegetarian', shortNote: '+20 B12 risk · 2.2 µg target' },
  { value: 'eggetarian', label: 'Eggetarian', shortNote: 'Low B12 risk · 2.2 µg target' },
  { value: 'non-veg', label: 'Non-Vegetarian', shortNote: 'Baseline risk · 2.2 µg target' },
];

const SUN_WINDOW_OPTIONS: { value: SunWindow; label: string; multiplier: string }[] = [
  { value: 'peak', label: '10 AM – 2 PM', multiplier: '1.0× UV-B' },
  { value: 'shoulder', label: '7–10 AM / 2–5 PM', multiplier: '0.4× UV-B' },
  { value: 'indoor', label: 'Mostly Indoor', multiplier: '0.05× UV-B' },
];

export const CalculatorView: React.FC<CalculatorViewProps> = ({
  initialProfile,
  onApplyProfile,
}) => {
  const [draft, setDraft] = useState<UserProfile>(initialProfile);

  const liveTargets = useMemo(() => calculateDailyTargets(draft), [draft]);
  const selectedSkin =
    FITZPATRICK_SCALE.find((s) => s.type === draft.fitzpatrickType) ?? FITZPATRICK_SCALE[3];

  const toggleSymptom = (symptom: SymptomId) => {
    setDraft((prev) => {
      const exists = prev.symptoms.includes(symptom);
      return {
        ...prev,
        symptoms: exists
          ? prev.symptoms.filter((s) => s !== symptom)
          : [...prev.symptoms, symptom],
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight text-balance">
            ICMR Deficiency Risk &amp; RDA Calculator
          </h1>
          <p className="text-sm text-[#bcc9cd] mt-1 max-w-2xl">
            Calibrate your personalized daily Vitamin B12 (µg) and Vitamin D (IU) targets based on
            Indian dietary patterns, Fitzpatrick melanin UV-B resistance, and blood serum markers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Configuration Column */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7 space-y-7">
          {/* Demographics & City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-[#bcc9cd]">Age (Years)</span>
              <input
                type="number"
                min={14}
                max={95}
                value={draft.age}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    age: Math.max(14, Math.min(95, Number(e.target.value) || 18)),
                  }))
                }
                className="w-full h-11 px-3.5 rounded-xl glass-control text-white tabular-metric text-sm focus:outline-none focus:border-[#06B6D4]"
              />
            </label>

            <div className="space-y-1.5">
              <span className="text-xs font-medium text-[#bcc9cd] block">Biological Sex</span>
              <div className="grid grid-cols-2 p-1 rounded-xl glass-control h-11">
                {(['female', 'male'] as const).map((sex) => (
                  <button
                    key={sex}
                    type="button"
                    onClick={() => setDraft((prev) => ({ ...prev, biologicalSex: sex }))}
                    className={`rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                      draft.biologicalSex === sex
                        ? 'bg-white/15 text-white border border-white/20'
                        : 'text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    {sex}
                  </button>
                ))}
              </div>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-[#bcc9cd]">Indian City (UV-B)</span>
              <select
                value={draft.city}
                onChange={(e) => setDraft((prev) => ({ ...prev, city: e.target.value }))}
                className="w-full h-11 px-3.5 rounded-xl glass-control bg-[#0d1c2d] text-white text-sm focus:outline-none focus:border-[#06B6D4]"
              >
                {INDIAN_CITIES.map((c) => (
                  <option key={c.city} value={c.city} className="bg-[#0d1c2d] text-white">
                    {c.city} ({c.latitude})
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Diet Type Segmented Control */}
          <div className="space-y-2.5 border-t border-white/10 pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Dietary Preference</span>
              <span className="text-xs text-[#06B6D4] font-medium">
                {DIET_OPTIONS.find((d) => d.value === draft.dietType)?.shortNote}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 rounded-2xl glass-control">
              {DIET_OPTIONS.map((option) => {
                const active = draft.dietType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDraft((prev) => ({ ...prev, dietType: option.value }))}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-white/15 text-white border border-white/20 shadow-sm'
                        : 'text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fitzpatrick Skin Tone Selector */}
          <div className="space-y-3 border-t border-white/10 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-sm font-semibold text-white block">
                  Skin Tone (Fitzpatrick Scale I–VI)
                </span>
                <span className="text-xs text-[#94a3b8]">
                  Melanin absorbs UV-B photons, altering required sunlight duration
                </span>
              </div>
              <div className="text-xs text-[#F59E0B] tabular-metric font-medium">
                {selectedSkin.label} · {selectedSkin.indianTone} ({selectedSkin.melaninMultiplier}×
                factor)
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {FITZPATRICK_SCALE.map((skin) => {
                const active = draft.fitzpatrickType === skin.type;
                return (
                  <button
                    key={skin.type}
                    type="button"
                    onClick={() =>
                      setDraft((prev) => ({ ...prev, fitzpatrickType: skin.type as FitzpatrickType }))
                    }
                    className="flex flex-col items-center gap-1.5 group cursor-pointer"
                    aria-label={`Select Fitzpatrick ${skin.label} ${skin.indianTone}`}
                  >
                    <span
                      className={`w-11 h-11 rounded-full transition-transform flex items-center justify-center ${
                        active
                          ? 'ring-2 ring-[#F59E0B] ring-offset-2 ring-offset-[#0b0f19] scale-105'
                          : 'border border-white/25 group-hover:scale-105'
                      }`}
                      style={{ backgroundColor: skin.swatchHex }}
                    >
                      {active && (
                        <Check
                          className={`w-4 h-4 ${
                            skin.type <= 3 ? 'text-[#051424]' : 'text-white'
                          }`}
                        />
                      )}
                    </span>
                    <span className="text-[11px] font-medium text-[#bcc9cd] tabular-metric">
                      {skin.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sun Exposure Habits */}
          <div className="space-y-4 border-t border-white/10 pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Daily Sunlight Exposure</span>
              <span className="tabular-metric text-sm font-semibold text-[#F59E0B]">
                {draft.dailyOutdoorMinutes} min / day
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={90}
              step={5}
              value={draft.dailyOutdoorMinutes}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, dailyOutdoorMinutes: Number(e.target.value) }))
              }
              className="w-full vita-slider"
              aria-label="Daily outdoor sunlight minutes"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-[#bcc9cd] block">
                  Typical Outdoor Window
                </span>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl glass-control">
                  {SUN_WINDOW_OPTIONS.map((win) => (
                    <button
                      key={win.value}
                      type="button"
                      onClick={() => setDraft((prev) => ({ ...prev, sunWindow: win.value }))}
                      className={`px-2 py-2 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                        draft.sunWindow === win.value
                          ? 'bg-white/15 text-white border border-white/20'
                          : 'text-[#94a3b8] hover:text-white'
                      }`}
                    >
                      <div className="truncate">{win.label}</div>
                      <div className="text-[10px] text-[#F59E0B] tabular-metric">
                        {win.multiplier}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-medium text-[#bcc9cd] block">Clothing Exposure</span>
                <div className="grid grid-cols-2 gap-1 p-1 rounded-xl glass-control h-[52px]">
                  {(
                    [
                      { value: 'face-forearms', label: 'Face & Forearms' },
                      { value: 'shorts-tshirt', label: 'Shorts & T-Shirt' },
                    ] as { value: ExposureArea; label: string }[]
                  ).map((area) => (
                    <button
                      key={area.value}
                      type="button"
                      onClick={() => setDraft((prev) => ({ ...prev, exposureArea: area.value }))}
                      className={`px-2.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                        draft.exposureArea === area.value
                          ? 'bg-white/15 text-white border border-white/20'
                          : 'text-[#94a3b8] hover:text-white'
                      }`}
                    >
                      {area.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Symptoms & Lab Markers */}
          <div className="space-y-4 border-t border-white/10 pt-6">
            <span className="text-sm font-semibold text-white block">
              Deficiency Symptoms &amp; Optional Lab Serum
            </span>

            <div className="flex flex-wrap gap-2">
              {SYMPTOM_OPTIONS.map((sym) => {
                const selected = draft.symptoms.includes(sym.id);
                return (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => toggleSymptom(sym.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#06B6D4]/20 text-white border border-[#06B6D4]/60'
                        : 'bg-white/[0.04] text-[#94a3b8] border border-white/10 hover:text-white'
                    }`}
                  >
                    {sym.label} · {sym.nutrientLink}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-[#bcc9cd]">
                  Latest Serum 25(OH)D (ng/mL, optional)
                </span>
                <input
                  type="number"
                  min={1}
                  max={150}
                  placeholder="e.g. 16 (Deficient < 20)"
                  value={draft.serumD_ng_mL}
                  onChange={(e) => setDraft((prev) => ({ ...prev, serumD_ng_mL: e.target.value }))}
                  className="w-full h-11 px-3.5 rounded-xl glass-control text-white placeholder-[#64748B] tabular-metric text-sm focus:outline-none focus:border-[#F59E0B]"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-[#bcc9cd]">
                  Latest Serum Vitamin B12 (pg/mL, optional)
                </span>
                <input
                  type="number"
                  min={50}
                  max={2000}
                  placeholder="e.g. 185 (Low < 200)"
                  value={draft.serumB12_pg_mL}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, serumB12_pg_mL: e.target.value }))
                  }
                  className="w-full h-11 px-3.5 rounded-xl glass-control text-white placeholder-[#64748B] tabular-metric text-sm focus:outline-none focus:border-[#06B6D4]"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Live Output Telemetry Column */}
        <div className="lg:col-span-5 glass-panel-elevated rounded-3xl p-6 sm:p-7 space-y-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#94a3b8]">
                Live ICMR Assessment
              </span>
              <h2 className="text-xl font-semibold text-white mt-0.5">
                {formatDietLabel(draft.dietType)} Profile
              </h2>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#94a3b8]">Overall Risk</div>
              <div
                className={`text-sm font-semibold ${
                  liveTargets.overallRiskLevel === 'High'
                    ? 'text-[#ffb4ab]'
                    : liveTargets.overallRiskLevel === 'Moderate'
                      ? 'text-[#ffb95f]'
                      : 'text-[#4edea3]'
                }`}
              >
                {liveTargets.overallRiskLevel} Risk
              </div>
            </div>
          </div>

          {/* Target Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-[#F59E0B] font-medium">
                <Sun className="w-3.5 h-3.5" />
                <span>Vitamin D Target</span>
              </div>
              <div className="tabular-metric text-2xl font-bold text-white">
                {liveTargets.vitaminD_IU.toLocaleString()}{' '}
                <span className="text-sm font-medium text-[#94a3b8]">IU</span>
              </div>
              <div className="text-xs text-[#94a3b8] tabular-metric">
                D Risk Score: {liveTargets.dRiskScore}/100
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-[#06B6D4] font-medium">
                <Zap className="w-3.5 h-3.5" />
                <span>Vitamin B12 Target</span>
              </div>
              <div className="tabular-metric text-2xl font-bold text-white">
                {liveTargets.vitaminB12_mcg.toFixed(1)}{' '}
                <span className="text-sm font-medium text-[#94a3b8]">µg</span>
              </div>
              <div className="text-xs text-[#94a3b8] tabular-metric">
                B12 Risk Score: {liveTargets.b12RiskScore}/100
              </div>
            </div>
          </div>

          {/* Synthesized Sun Estimate */}
          <div className="p-4 rounded-2xl bg-[#F59E0B]/[0.08] border border-[#F59E0B]/25 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#ffb95f] font-medium">Estimated Daily UV-B Synthesis</span>
              <span className="tabular-metric font-bold text-white">
                +{liveTargets.baselineSynthesizedIU} IU / day
              </span>
            </div>
            <p className="text-xs text-[#bcc9cd] leading-relaxed">
              Computed from {draft.dailyOutdoorMinutes} min × 35 ×{' '}
              {draft.sunWindow === 'peak' ? '1.0' : draft.sunWindow === 'shoulder' ? '0.4' : '0.05'}
              × {selectedSkin.melaninMultiplier} melanin factor ×{' '}
              {draft.exposureArea === 'shorts-tshirt' ? '0.70' : '0.35'} skin area.
            </p>
          </div>

          {liveTargets.fortifiedRequired && (
            <div className="p-4 rounded-2xl bg-[#06B6D4]/10 border border-[#06B6D4]/30 flex items-start gap-3">
              <ShieldAlert className="w-4 h-4 text-[#4cd7f6] shrink-0 mt-0.5" />
              <div className="text-xs text-[#d4e4fa] leading-relaxed">
                <span className="font-semibold text-white">Fortified Food Requirement:</span>{' '}
                Unfortified plant foods lack active Vitamin B12. Your dashboard will prioritize
                Nutritional Yeast and FSSAI "+F" fortified soy/almond milk.
              </div>
            </div>
          )}

          {liveTargets.clinicalNotes.length > 0 && (
            <div className="space-y-2 border-t border-white/10 pt-4">
              <span className="text-xs font-medium text-[#94a3b8]">Clinical Insights</span>
              <ul className="space-y-1.5 text-xs text-[#bcc9cd] leading-relaxed">
                {liveTargets.clinicalNotes.map((note, idx) => (
                  <li key={idx}>• {note}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            onClick={() => onApplyProfile(draft)}
            className="w-full h-12 rounded-full bg-[#06B6D4] hover:bg-[#22d3ee] text-[#051424] font-semibold text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98] glow-cyan cursor-pointer"
          >
            <span>Calculate &amp; Apply to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
