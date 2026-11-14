export type DietType = 'strict-vegan' | 'lacto-veg' | 'eggetarian' | 'non-veg';

export type FitzpatrickType = 1 | 2 | 3 | 4 | 5 | 6;

export type SunWindow = 'peak' | 'shoulder' | 'indoor';

export type ExposureArea = 'face-forearms' | 'shorts-tshirt';

export type SymptomId =
  | 'fatigue'
  | 'tingling'
  | 'bone-ache'
  | 'brain-fog'
  | 'hair-fall';

export type AppView = 'dashboard' | 'calculator' | 'foods' | 'sun-timer';

export type FoodDietTag = 'Vegan' | 'Veg' | 'Egg' | 'Non-Veg';

export interface IndianFoodItem {
  id: string;
  name: string;
  hindiName: string;
  category: 'Dairy & Fermented' | 'Fortified & Plant' | 'Egg & Poultry' | 'Fish & Seafood';
  dietTag: FoodDietTag;
  servingSize: string;
  vitaminB12_mcg: number;
  vitaminD_IU: number;
  hasHealthyFat: boolean;
  bioavailabilityNote: string;
}

export interface UserProfile {
  age: number;
  biologicalSex: 'female' | 'male';
  city: string;
  dietType: DietType;
  fitzpatrickType: FitzpatrickType;
  dailyOutdoorMinutes: number;
  sunWindow: SunWindow;
  exposureArea: ExposureArea;
  symptoms: SymptomId[];
  serumD_ng_mL: string;
  serumB12_pg_mL: string;
}

export interface DailyTargets {
  vitaminD_IU: number;
  vitaminB12_mcg: number;
  b12RiskScore: number;
  dRiskScore: number;
  overallRiskLevel: 'Low' | 'Moderate' | 'High';
  fortifiedRequired: boolean;
  baselineSynthesizedIU: number;
  clinicalNotes: string[];
}

export interface LoggedFood {
  id: string;
  name: string;
  serving: string;
  vitaminB12_mcg: number;
  vitaminD_IU: number;
  isFatPaired: boolean;
  hasTanninWarning?: boolean;
  absorptionNote: string;
  source: 'database' | 'gemini-ai' | 'quick-log';
  timestamp: string;
}

export interface SunSession {
  id: string;
  exercise: string;
  durationMinutes: number;
  exposureArea: ExposureArea;
  synthesizedIU: number;
  timestamp: string;
}

export interface AbsorptionSettings {
  healthyFatsPaired: boolean;
  chaiWithin30Mins: boolean;
}

export interface RecoveryPlanMeal {
  slot: string;
  dish: string;
  portion: string;
  vitaminB12_mcg: number;
  vitaminD_IU: number;
  synergyNote: string;
}

export interface RecoveryPlan {
  headline: string;
  sunlightProtocol: {
    window: string;
    durationMinutes: number;
    exercise: string;
    expectedIU: number;
    tip: string;
  };
  meals: RecoveryPlanMeal[];
  avoidanceRule: string;
}
