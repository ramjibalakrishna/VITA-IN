import React from 'react';
import { motion } from 'motion/react';
import { Sun, Zap } from 'lucide-react';
import { DailyTargets } from '../types/vita';

interface DualRadialRingsProps {
  foodVitaminD_IU: number;
  sunVitaminD_IU: number;
  totalVitaminB12_mcg: number;
  targets: DailyTargets;
  healthyFatsActive: boolean;
  onOpenCalculator: () => void;
}

interface RingProps {
  label: string;
  currentValue: string;
  targetValue: string;
  unit: string;
  percent: number;
  remainingText: string;
  breakdownText: string;
  statusLabel: string;
  accentHex: string;
  secondaryHex: string;
  gradientId: string;
  icon: React.ReactNode;
}

function RadialGauge({
  label,
  currentValue,
  targetValue,
  unit,
  percent,
  remainingText,
  breakdownText,
  statusLabel,
  accentHex,
  secondaryHex,
  gradientId,
  icon,
}: RingProps) {
  const clampedPct = Math.min(100, Math.max(0, percent));
  const size = 168;
  const strokeWidth = 11;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedPct / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-5 flex-1 min-w-0">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentHex} />
              <stop offset="100%" stopColor={secondaryHex} />
            </linearGradient>
            <filter id={`${gradientId}-glow`} x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={accentHex} floodOpacity="0.55" />
            </filter>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            filter={`url(#${gradientId}-glow)`}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-xs font-medium text-[#bcc9cd] mb-0.5">
            {icon}
            <span>{Math.round(percent)}%</span>
          </div>
          <div className="tabular-metric text-3xl font-bold tracking-tight text-white">
            {currentValue}
          </div>
          <div className="text-[11px] font-medium text-[#869397] tabular-metric">
            of {targetValue} {unit}
          </div>
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-[#bcc9cd]">
            <span className="font-semibold text-white">{label}</span>
            <span aria-hidden="true">·</span>
            <span
              style={{ color: clampedPct >= 100 ? '#4edea3' : accentHex }}
              className="font-medium"
            >
              {statusLabel}
            </span>
          </div>
        </div>

        <div className="text-sm text-[#d4e4fa] tabular-metric">{remainingText}</div>

        <p className="text-xs text-[#94a3b8] leading-relaxed">{breakdownText}</p>
      </div>
    </div>
  );
}

export const DualRadialRings: React.FC<DualRadialRingsProps> = ({
  foodVitaminD_IU,
  sunVitaminD_IU,
  totalVitaminB12_mcg,
  targets,
  healthyFatsActive,
  onOpenCalculator,
}) => {
  const totalVitaminD = foodVitaminD_IU + sunVitaminD_IU;
  const dPercent = targets.vitaminD_IU > 0 ? (totalVitaminD / targets.vitaminD_IU) * 100 : 0;
  const b12Percent =
    targets.vitaminB12_mcg > 0 ? (totalVitaminB12_mcg / targets.vitaminB12_mcg) * 100 : 0;

  const dRemaining = Math.max(0, Math.round(targets.vitaminD_IU - totalVitaminD));
  const b12Remaining = Math.max(0, Math.round((targets.vitaminB12_mcg - totalVitaminB12_mcg) * 100) / 100);

  const dStatus = dPercent >= 100 ? 'Goal Met' : dPercent >= 55 ? 'Building' : 'Deficit Gap';
  const b12Status = b12Percent >= 100 ? 'Goal Met' : b12Percent >= 55 ? 'On Track' : 'Deficit Gap';

  return (
    <section
      aria-label="Daily Vitamin D and B12 Progress"
      className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight text-balance">
            Daily Micronutrient Telemetry
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#94a3b8] mt-1">
            <span>ICMR Personalized RDA</span>
            <span aria-hidden="true">·</span>
            <span>Risk Level: {targets.overallRiskLevel}</span>
            {healthyFatsActive && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#4edea3]">Fat Synergy +25% D Active</span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCalculator}
          className="px-3.5 py-2 rounded-full text-xs font-medium text-[#d4e4fa] bg-white/[0.07] hover:bg-white/[0.13] border border-white/15 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Adjust RDA Profile
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-7 items-center">
        <RadialGauge
          label="Vitamin D"
          currentValue={totalVitaminD.toLocaleString()}
          targetValue={targets.vitaminD_IU.toLocaleString()}
          unit="IU"
          percent={dPercent}
          remainingText={
            dRemaining > 0
              ? `${dRemaining.toLocaleString()} IU remaining today`
              : 'Daily Vitamin D target achieved'
          }
          breakdownText={`Diet ${foodVitaminD_IU} IU · Sunlight ${sunVitaminD_IU} IU`}
          statusLabel={dStatus}
          accentHex="#F59E0B"
          secondaryHex="#FBBF24"
          gradientId="vit-d-gradient"
          icon={<Sun className="w-3.5 h-3.5 text-[#F59E0B]" />}
        />

        <RadialGauge
          label="Vitamin B12"
          currentValue={totalVitaminB12_mcg.toFixed(2)}
          targetValue={targets.vitaminB12_mcg.toFixed(1)}
          unit="µg"
          percent={b12Percent}
          remainingText={
            b12Remaining > 0
              ? `${b12Remaining.toFixed(2)} µg remaining today`
              : 'Daily Vitamin B12 target achieved'
          }
          breakdownText={
            targets.fortifiedRequired
              ? 'Vegan protocol: prioritize fortified (+F) & nutritional yeast'
              : 'Bioavailable dairy, egg, or fortified food intake'
          }
          statusLabel={b12Status}
          accentHex="#06B6D4"
          secondaryHex="#38BDF8"
          gradientId="vit-b12-gradient"
          icon={<Zap className="w-3.5 h-3.5 text-[#06B6D4]" />}
        />
      </div>
    </section>
  );
};
