import React, { useMemo, useState } from 'react';
import { Check, Plus, Search } from 'lucide-react';
import { INDIAN_FOODS, isFoodCompatibleWithDiet } from '../data/indianFoods';
import { DailyTargets, DietType, IndianFoodItem } from '../types/vita';

interface FoodDatabaseViewProps {
  userDiet: DietType;
  targets: DailyTargets;
  healthyFatsActive: boolean;
  onLogFood: (food: IndianFoodItem) => void;
}

type DietFilter = 'all' | 'compatible' | 'Vegan' | 'Veg' | 'Egg' | 'Non-Veg';
type NutrientFilter = 'all' | 'b12' | 'd';

export const FoodDatabaseView: React.FC<FoodDatabaseViewProps> = ({
  userDiet,
  targets,
  healthyFatsActive,
  onLogFood,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState<DietFilter>('compatible');
  const [nutrientFilter, setNutrientFilter] = useState<NutrientFilter>('all');
  const [recentlyLoggedId, setRecentlyLoggedId] = useState<string | null>(null);

  const filteredFoods = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return INDIAN_FOODS.filter((food) => {
      if (dietFilter === 'compatible' && !isFoodCompatibleWithDiet(food, userDiet)) {
        return false;
      }
      if (
        dietFilter !== 'all' &&
        dietFilter !== 'compatible' &&
        food.dietTag !== dietFilter
      ) {
        return false;
      }
      if (nutrientFilter === 'b12' && food.vitaminB12_mcg < 0.5) return false;
      if (nutrientFilter === 'd' && food.vitaminD_IU < 40) return false;
      if (
        q &&
        !food.name.toLowerCase().includes(q) &&
        !food.hindiName.toLowerCase().includes(q) &&
        !food.category.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [searchQuery, dietFilter, nutrientFilter, userDiet]);

  const handleLog = (food: IndianFoodItem) => {
    onLogFood(food);
    setRecentlyLoggedId(food.id);
    setTimeout(() => {
      setRecentlyLoggedId((curr) => (curr === food.id ? null : curr));
    }, 1400);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Indian Nutritional &amp; Bioavailability Database
          </h1>
          <p className="text-sm text-[#bcc9cd] mt-1 max-w-2xl">
            24 curated Indian staples benchmarked against your daily targets (
            <span className="tabular-metric text-white">
              {targets.vitaminB12_mcg.toFixed(1)} µg B12
            </span>{' '}
            ·{' '}
            <span className="tabular-metric text-white">
              {targets.vitaminD_IU.toLocaleString()} IU D
            </span>
            ).
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#869397] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dahi, bangda, mushroom..."
            className="w-full h-11 pl-10 pr-4 rounded-xl glass-control text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#06B6D4]"
          />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl glass-control">
          {(
            [
              { id: 'compatible', label: 'My Diet Match' },
              { id: 'all', label: 'All 24 Foods' },
              { id: 'Vegan', label: 'Vegan' },
              { id: 'Veg', label: 'Dairy / Veg' },
              { id: 'Egg', label: 'Eggetarian' },
              { id: 'Non-Veg', label: 'Non-Veg' },
            ] as { id: DietFilter; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setDietFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                dietFilter === tab.id
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl glass-control">
          {(
            [
              { id: 'all', label: 'All Nutrients' },
              { id: 'b12', label: 'High B12' },
              { id: 'd', label: 'High Vitamin D' },
            ] as { id: NutrientFilter; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setNutrientFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                nutrientFilter === tab.id
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Food Grid */}
      {filteredFoods.length === 0 ? (
        <div className="glass-panel rounded-3xl p-10 text-center space-y-3">
          <p className="text-sm text-[#bcc9cd]">
            No Indian foods matched your current search and diet filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setDietFilter('all');
              setNutrientFilter('all');
            }}
            className="px-4 py-2 rounded-full text-xs font-medium bg-white/10 text-white hover:bg-white/15 cursor-pointer"
          >
            Show All 24 Foods
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredFoods.map((food) => {
            const b12Pct = Math.round((food.vitaminB12_mcg / targets.vitaminB12_mcg) * 100);
            const effectiveD = Math.round(
              food.vitaminD_IU * (food.hasHealthyFat || healthyFatsActive ? 1.25 : 1)
            );
            const dPct = Math.round((effectiveD / targets.vitaminD_IU) * 100);
            const isJustLogged = recentlyLoggedId === food.id;

            return (
              <article
                key={food.id}
                className="glass-panel rounded-3xl p-5 flex flex-col justify-between gap-4 hover:border-white/25 transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-semibold text-white leading-snug">
                      {food.name}
                    </h2>
                    <span className="text-xs font-medium text-[#94a3b8] shrink-0">
                      {food.dietTag}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#94a3b8]">
                    <span>{food.hindiName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{food.servingSize}</span>
                    {food.hasHealthyFat && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#4edea3]">Natural Fat Paired</span>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                      <div className="text-[11px] text-[#06B6D4] font-medium">Vitamin B12</div>
                      <div className="tabular-metric text-lg font-bold text-white mt-0.5">
                        {food.vitaminB12_mcg.toFixed(2)}{' '}
                        <span className="text-xs font-normal text-[#94a3b8]">µg</span>
                      </div>
                      <div className="text-[11px] text-[#94a3b8] tabular-metric">{b12Pct}% RDA</div>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                      <div className="text-[11px] text-[#F59E0B] font-medium">Vitamin D</div>
                      <div className="tabular-metric text-lg font-bold text-white mt-0.5">
                        {effectiveD}{' '}
                        <span className="text-xs font-normal text-[#94a3b8]">IU</span>
                      </div>
                      <div className="text-[11px] text-[#94a3b8] tabular-metric">{dPct}% RDA</div>
                    </div>
                  </div>

                  <p className="text-xs text-[#bcc9cd] leading-relaxed">{food.bioavailabilityNote}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleLog(food)}
                  className={`w-full h-10 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isJustLogged
                      ? 'bg-[#10B981] text-[#051424]'
                      : 'bg-white/[0.08] hover:bg-[#06B6D4] text-white hover:text-[#051424] border border-white/15'
                  }`}
                >
                  {isJustLogged ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added to Today</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log {food.servingSize}</span>
                    </>
                  )}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
