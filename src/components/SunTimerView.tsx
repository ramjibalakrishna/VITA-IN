import React, { useEffect, useState } from 'react';
import { CheckCircle2, FastForward, Pause, Play, RotateCcw, Sun } from 'lucide-react';
import { ExposureArea, FitzpatrickType, SunSession, SunWindow } from '../types/vita';
import {
  FITZPATRICK_SCALE,
  INDIAN_CITIES,
  calculateSynthesizedIU,
  getExposureAreaFactor,
  getSkinMultiplier,
  getTimeMultiplier,
} from '../utils/calculator';

interface SunTimerViewProps {
  fitzpatrickType: FitzpatrickType;
  city: string;
  defaultExposureArea: ExposureArea;
  sunSessions: SunSession[];
  onLogSunSession: (session: Omit<SunSession, 'id' | 'timestamp'>) => void;
  onNavigateDashboard: () => void;
}

const OUTDOOR_EXERCISES = [
  {
    name: 'Terrace Surya Namaskar',
    benefit: 'Axial spinal loading + dynamic full-body skin angle for morning/midday UV-B capture.',
  },
  {
    name: 'Brisk Park Walk',
    benefit: 'Weight-bearing heel strikes stimulate osteoblast signaling alongside Vitamin D synthesis.',
  },
  {
    name: 'Outdoor Jogging',
    benefit: 'High bone-loading mechanical stimulus that pairs synergistically with serum 25(OH)D.',
  },
  {
    name: 'Balcony Stretching',
    benefit: 'Low-sweat accessible morning/noon mobility routine ideal for urban apartments.',
  },
];

export const SunTimerView: React.FC<SunTimerViewProps> = ({
  fitzpatrickType,
  city,
  defaultExposureArea,
  sunSessions,
  onLogSunSession,
  onNavigateDashboard,
}) => {
  const [selectedExercise, setSelectedExercise] = useState(OUTDOOR_EXERCISES[0].name);
  const [exposureArea, setExposureArea] = useState<ExposureArea>(defaultExposureArea);
  const [sunWindow, setSunWindow] = useState<SunWindow>('peak');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [loggedSuccessMsg, setLoggedSuccessMsg] = useState<string | null>(null);

  const skinInfo =
    FITZPATRICK_SCALE.find((s) => s.type === fitzpatrickType) ?? FITZPATRICK_SCALE[3];
  const cityInfo = INDIAN_CITIES.find((c) => c.city === city) ?? INDIAN_CITIES[0];

  const targetSeconds = skinInfo.recommendedPeakMins * 60;

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  const elapsedMinutesFloat = elapsedSeconds / 60;
  const liveIU = calculateSynthesizedIU(
    elapsedMinutesFloat,
    sunWindow,
    fitzpatrickType,
    exposureArea
  );

  const progressPct = Math.min(100, (elapsedSeconds / targetSeconds) * 100);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSimulateFiveMins = () => {
    setElapsedSeconds((prev) => prev + 300);
  };

  const handleCompleteAndLog = () => {
    const durationMins = Math.max(1, Math.round(elapsedSeconds / 60));
    const finalIU = Math.max(
      1,
      calculateSynthesizedIU(durationMins, sunWindow, fitzpatrickType, exposureArea)
    );

    onLogSunSession({
      exercise: selectedExercise,
      durationMinutes: durationMins,
      exposureArea,
      synthesizedIU: finalIU,
    });

    setIsRunning(false);
    setElapsedSeconds(0);
    setLoggedSuccessMsg(`+${finalIU} IU logged from ${durationMins} min ${selectedExercise}`);
  };

  const ratePerMin = (
    35 *
    getTimeMultiplier(sunWindow) *
    getSkinMultiplier(fitzpatrickType) *
    getExposureAreaFactor(exposureArea)
  ).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Sunlight &amp; Outdoor Exercise Timer
          </h1>
          <p className="text-sm text-[#bcc9cd] mt-1 max-w-2xl">
            Pair bone-loading movement with UV-B exposure during {cityInfo.city}&apos;s optimal
            window ({cityInfo.optimalWindow}) before applying SPF.
          </p>
        </div>
      </div>

      {loggedSuccessMsg && (
        <div className="glass-panel rounded-2xl p-4 border-[#10B981]/40 bg-[#10B981]/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-sm text-[#4edea3] font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{loggedSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={onNavigateDashboard}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#4edea3] text-[#051424] hover:bg-[#6ffbbe] cursor-pointer"
          >
            View on Dashboard
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Timer Dial Card */}
        <div className="lg:col-span-7 glass-panel-elevated rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
          <div className="w-full flex flex-wrap items-center justify-between gap-2 text-xs text-[#94a3b8]">
            <span>
              Fitzpatrick {skinInfo.label} ({skinInfo.indianTone})
            </span>
            <span className="tabular-metric text-[#F59E0B] font-medium">
              ~{ratePerMin} IU / min synthesis rate
            </span>
          </div>

          {/* Circular Stopwatch Dial */}
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg viewBox="0 0 220 220" className="w-full h-full -rotate-90">
              <defs>
                <linearGradient id="sun-timer-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#FBBF24" />
                </linearGradient>
              </defs>
              <circle
                cx="110"
                cy="110"
                r="96"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="12"
              />
              <circle
                cx="110"
                cy="110"
                r="96"
                fill="none"
                stroke="url(#sun-timer-grad)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 96}
                strokeDashoffset={2 * Math.PI * 96 * (1 - progressPct / 100)}
                className="transition-all duration-300"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1.5 text-xs text-[#F59E0B] font-medium mb-1">
                <Sun className="w-3.5 h-3.5" />
                <span>+{liveIU} IU Generated</span>
              </div>
              <div className="tabular-metric text-4xl font-bold text-white tracking-tight">
                {formatTimer(elapsedSeconds)}
              </div>
              <div className="text-xs text-[#94a3b8] tabular-metric mt-1">
                Safe target: {skinInfo.recommendedPeakMins}:00 min
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full">
            <button
              type="button"
              onClick={() => setIsRunning((r) => !r)}
              className="h-11 px-6 rounded-full bg-[#F59E0B] hover:bg-[#fbbf24] text-[#051424] font-semibold text-sm inline-flex items-center gap-2 transition-transform active:scale-[0.98] glow-amber cursor-pointer"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Pause' : elapsedSeconds > 0 ? 'Resume' : 'Start Timer'}</span>
            </button>

            <button
              type="button"
              onClick={handleSimulateFiveMins}
              className="h-11 px-4 rounded-full glass-control hover:bg-white/10 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>+5 min Simulate</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsRunning(false);
                setElapsedSeconds(0);
              }}
              disabled={elapsedSeconds === 0}
              className="h-11 px-4 rounded-full glass-control hover:bg-white/10 text-[#bcc9cd] disabled:opacity-40 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCompleteAndLog}
            disabled={elapsedSeconds < 10}
            className="w-full max-w-sm h-11 rounded-full bg-[#06B6D4] hover:bg-[#22d3ee] disabled:opacity-40 disabled:cursor-not-allowed text-[#051424] font-semibold text-sm transition-colors cursor-pointer"
          >
            Complete &amp; Log Sun Session (+{liveIU} IU)
          </button>
        </div>

        {/* Configuration & Recent Sessions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white">Session Parameters</h2>

            <div className="space-y-2">
              <span className="text-xs font-medium text-[#bcc9cd] block">Outdoor Exercise</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {OUTDOOR_EXERCISES.map((ex) => {
                  const active = selectedExercise === ex.name;
                  return (
                    <button
                      key={ex.name}
                      type="button"
                      onClick={() => setSelectedExercise(ex.name)}
                      className={`p-3 rounded-2xl text-left transition-colors cursor-pointer border ${
                        active
                          ? 'bg-[#F59E0B]/15 border-[#F59E0B]/50 text-white'
                          : 'bg-white/[0.03] border-white/10 text-[#bcc9cd] hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-semibold">{ex.name}</div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-[#94a3b8] leading-relaxed pt-1">
                {OUTDOOR_EXERCISES.find((e) => e.name === selectedExercise)?.benefit}
              </p>
            </div>

            <div className="space-y-2 border-t border-white/10 pt-4">
              <span className="text-xs font-medium text-[#bcc9cd] block">Skin Exposure Level</span>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl glass-control">
                {(
                  [
                    { value: 'face-forearms', label: 'Face & Forearms (0.35×)' },
                    { value: 'shorts-tshirt', label: 'Shorts & T-Shirt (0.70×)' },
                  ] as { value: ExposureArea; label: string }[]
                ).map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setExposureArea(item.value)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      exposureArea === item.value
                        ? 'bg-white/15 text-white border border-white/20'
                        : 'text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 border-t border-white/10 pt-4">
              <span className="text-xs font-medium text-[#bcc9cd] block">Current Sun Window</span>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl glass-control">
                {(
                  [
                    { value: 'peak', label: '10 AM – 2 PM (1.0×)' },
                    { value: 'shoulder', label: '7–10 AM / 2–5 PM (0.4×)' },
                  ] as { value: SunWindow; label: string }[]
                ).map((w) => (
                  <button
                    key={w.value}
                    type="button"
                    onClick={() => setSunWindow(w.value)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      sunWindow === w.value
                        ? 'bg-white/15 text-white border border-white/20'
                        : 'text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">Today&apos;s Sun Sessions</h2>
              <span className="text-xs text-[#94a3b8] tabular-metric">
                {sunSessions.length} logged
              </span>
            </div>

            {sunSessions.length === 0 ? (
              <p className="text-xs text-[#94a3b8]">
                No outdoor sessions logged today. Start the timer or click &ldquo;+5 min
                Simulate&rdquo; to test UV-B synthesis logging.
              </p>
            ) : (
              <ul className="divide-y divide-white/10">
                {sunSessions.map((session) => (
                  <li key={session.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-white">{session.exercise}</div>
                      <div className="text-xs text-[#94a3b8]">
                        {session.durationMinutes} min ·{' '}
                        {session.exposureArea === 'shorts-tshirt'
                          ? 'Shorts & T-Shirt'
                          : 'Face & Forearms'}{' '}
                        · {session.timestamp}
                      </div>
                    </div>
                    <span className="tabular-metric text-sm font-semibold text-[#F59E0B] shrink-0">
                      +{session.synthesizedIU} IU
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
