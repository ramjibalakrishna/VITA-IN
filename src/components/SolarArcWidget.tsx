import React, { useEffect, useState } from 'react';
import { Compass, Timer } from 'lucide-react';
import { FitzpatrickType } from '../types/vita';
import { FITZPATRICK_SCALE, INDIAN_CITIES } from '../utils/calculator';

interface SolarArcWidgetProps {
  city: string;
  fitzpatrickType: FitzpatrickType;
  sunVitaminD_IU: number;
  onLaunchSunTimer: () => void;
}

export const SolarArcWidget: React.FC<SolarArcWidgetProps> = ({
  city,
  fitzpatrickType,
  sunVitaminD_IU,
  onLaunchSunTimer,
}) => {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const cityProfile = INDIAN_CITIES.find((c) => c.city === city) ?? INDIAN_CITIES[0];
  const skinInfo =
    FITZPATRICK_SCALE.find((s) => s.type === fitzpatrickType) ?? FITZPATRICK_SCALE[3];

  const currentHour = now.getHours() + now.getMinutes() / 60;
  // Map 6:00 AM (6) -> 6:30 PM (18.5) across the arc [0..1]
  const dayProgress = Math.min(1, Math.max(0, (currentHour - 6) / 12.5));

  const peakStartPct = (cityProfile.peakStartHour - 6) / 12.5;
  const peakEndPct = (cityProfile.peakEndHour - 6) / 12.5;

  const isInPeakWindow =
    currentHour >= cityProfile.peakStartHour && currentHour <= cityProfile.peakEndHour;

  const getWindowStatusText = (): string => {
    if (isInPeakWindow) {
      const minsLeft = Math.round((cityProfile.peakEndHour - currentHour) * 60);
      const hrs = Math.floor(minsLeft / 60);
      const mins = minsLeft % 60;
      return `Peak UV-B live · ${hrs > 0 ? `${hrs}h ` : ''}${mins}m left`;
    }
    if (currentHour < cityProfile.peakStartHour) {
      const minsUntil = Math.round((cityProfile.peakStartHour - currentHour) * 60);
      const hrs = Math.floor(minsUntil / 60);
      const mins = minsUntil % 60;
      return `Peak window opens in ${hrs > 0 ? `${hrs}h ` : ''}${mins}m`;
    }
    return `Next optimal UV-B tomorrow at ${cityProfile.optimalWindow.split('–')[0].trim()}`;
  };

  // Quadratic Bezier curve helper from (18, 112) through control (160, -14) to (302, 112)
  const pointOnArc = (t: number) => {
    const p0 = { x: 18, y: 112 };
    const p1 = { x: 160, y: -14 };
    const p2 = { x: 302, y: 112 };
    const mt = 1 - t;
    return {
      x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
      y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
    };
  };

  const sunNode = pointOnArc(dayProgress);

  // Sample points for the peak UV-B highlight band
  const peakSamples: string[] = [];
  const steps = 16;
  for (let i = 0; i <= steps; i++) {
    const t = peakStartPct + ((peakEndPct - peakStartPct) * i) / steps;
    const pt = pointOnArc(t);
    peakSamples.push(`${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`);
  }
  const peakBandPath = peakSamples.join(' ');

  return (
    <section
      aria-label="Local Solar UV-B Synthesis Window"
      className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#bcc9cd]">
            <Compass className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{cityProfile.city}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-metric">{cityProfile.latitude}</span>
          </div>
          <h2 className="text-lg font-semibold text-white mt-1">Solar UV-B Window</h2>
        </div>

        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider text-[#94a3b8]">Peak UV Index</div>
          <div className="tabular-metric text-lg font-semibold text-[#F59E0B]">
            UV {cityProfile.uvIndexPeak}
          </div>
        </div>
      </div>

      {/* Inverted Parabolic Solar Arc */}
      <div className="relative w-full py-1">
        <svg viewBox="0 0 320 132" className="w-full h-auto overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id="solar-peak-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#FBBF24" stopOpacity="1" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.6" />
            </linearGradient>
            <filter id="sun-node-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#F59E0B" floodOpacity="0.85" />
            </filter>
          </defs>

          {/* Horizon baseline */}
          <line
            x1="12"
            y1="112"
            x2="308"
            y2="112"
            stroke="rgba(255,255,255,0.12)"
            strokeDasharray="3 4"
            strokeWidth="1"
          />

          {/* Full daylight arc */}
          <path
            d="M 18 112 Q 160 -14 302 112"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Optimal UV-B peak window highlight band */}
          <path
            d={peakBandPath}
            fill="none"
            stroke="url(#solar-peak-stroke)"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Sun position node */}
          <circle
            cx={sunNode.x}
            cy={sunNode.y}
            r="7"
            fill="#FBBF24"
            stroke="#051424"
            strokeWidth="2"
            filter="url(#sun-node-glow)"
          />

          <text x="18" y="128" fill="#869397" fontSize="10" className="tabular-metric">
            06:00
          </text>
          <text
            x="160"
            y="128"
            fill="#F59E0B"
            fontSize="10"
            textAnchor="middle"
            className="tabular-metric"
          >
            {cityProfile.optimalWindow}
          </text>
          <text
            x="302"
            y="128"
            fill="#869397"
            fontSize="10"
            textAnchor="end"
            className="tabular-metric"
          >
            18:30
          </text>
        </svg>
      </div>

      <div className="space-y-3 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between text-xs">
          <span className={isInPeakWindow ? 'text-[#4edea3] font-medium' : 'text-[#ffb95f]'}>
            {getWindowStatusText()}
          </span>
          <span className="text-[#94a3b8] tabular-metric">
            Fitzpatrick {skinInfo.label} · {skinInfo.recommendedPeakMins}m goal
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-[#bcc9cd]">
            Logged Sun D:{' '}
            <span className="tabular-metric font-semibold text-white">{sunVitaminD_IU} IU</span>
          </div>

          <button
            type="button"
            onClick={onLaunchSunTimer}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#F59E0B] text-[#051424] hover:bg-[#fbbf24] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Start Sun Timer</span>
          </button>
        </div>
      </div>
    </section>
  );
};
