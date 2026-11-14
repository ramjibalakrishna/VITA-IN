import {
  DailyTargets,
  DietType,
  ExposureArea,
  FitzpatrickType,
  LoggedFood,
  SunSession,
  SunWindow,
  SymptomId,
  UserProfile,
} from '../types/vita';

export interface FitzpatrickInfo {
  type: FitzpatrickType;
  label: string;
  indianTone: string;
  swatchHex: string;
  melaninMultiplier: number;
  recommendedPeakMins: number;
}

export const FITZPATRICK_SCALE: FitzpatrickInfo[] = [
  {
    type: 1,
    label: 'Type I',
    indianTone: 'Very Fair',
    swatchHex: '#FDE6D2',
    melaninMultiplier: 1.0,
    recommendedPeakMins: 12,
  },
  {
    type: 2,
    label: 'Type II',
    indianTone: 'Fair',
    swatchHex: '#F3CFA9',
    melaninMultiplier: 1.0,
    recommendedPeakMins: 14,
  },
  {
    type: 3,
    label: 'Type III',
    indianTone: 'Light Wheatish',
    swatchHex: '#DDA97C',
    melaninMultiplier: 0.85,
    recommendedPeakMins: 18,
  },
  {
    type: 4,
    label: 'Type IV',
    indianTone: 'Medium / Wheatish',
    swatchHex: '#B67B4C',
    melaninMultiplier: 0.85,
    recommendedPeakMins: 22,
  },
  {
    type: 5,
    label: 'Type V',
    indianTone: 'Dusky / Brown',
    swatchHex: '#7D4B2B',
    melaninMultiplier: 0.65,
    recommendedPeakMins: 28,
  },
  {
    type: 6,
    label: 'Type VI',
    indianTone: 'Deep Melanin',
    swatchHex: '#492615',
    melaninMultiplier: 0.65,
    recommendedPeakMins: 32,
  },
];

export interface IndianCitySolarProfile {
  city: string;
  latitude: string;
  optimalWindow: string;
  peakStartHour: number;
  peakEndHour: number;
  uvIndexPeak: number;
}

export const INDIAN_CITIES: IndianCitySolarProfile[] = [
  {
    city: 'Bengaluru',
    latitude: '12.97° N',
    optimalWindow: '10:30 AM – 1:30 PM',
    peakStartHour: 10.5,
    peakEndHour: 13.5,
    uvIndexPeak: 9,
  },
  {
    city: 'Mumbai',
    latitude: '19.07° N',
    optimalWindow: '10:45 AM – 1:45 PM',
    peakStartHour: 10.75,
    peakEndHour: 13.75,
    uvIndexPeak: 8,
  },
  {
    city: 'Delhi NCR',
    latitude: '28.61° N',
    optimalWindow: '11:00 AM – 2:00 PM',
    peakStartHour: 11.0,
    peakEndHour: 14.0,
    uvIndexPeak: 7,
  },
  {
    city: 'Chennai',
    latitude: '13.08° N',
    optimalWindow: '10:15 AM – 1:15 PM',
    peakStartHour: 10.25,
    peakEndHour: 13.25,
    uvIndexPeak: 10,
  },
  {
    city: 'Hyderabad',
    latitude: '17.38° N',
    optimalWindow: '10:30 AM – 1:30 PM',
    peakStartHour: 10.5,
    peakEndHour: 13.5,
    uvIndexPeak: 9,
  },
  {
    city: 'Kolkata',
    latitude: '22.57° N',
    optimalWindow: '10:15 AM – 1:15 PM',
    peakStartHour: 10.25,
    peakEndHour: 13.25,
    uvIndexPeak: 8,
  },
  {
    city: 'Pune',
    latitude: '18.52° N',
    optimalWindow: '10:45 AM – 1:45 PM',
    peakStartHour: 10.75,
    peakEndHour: 13.75,
    uvIndexPeak: 8,
  },
];

export const SYMPTOM_OPTIONS: { id: SymptomId; label: string; nutrientLink: 'B12' | 'D' | 'Both' }[] = [
  { id: 'fatigue', label: 'Chronic Fatigue', nutrientLink: 'Both' },
  { id: 'tingling', label: 'Tingling / Numbness', nutrientLink: 'B12' },
  { id: 'bone-ache', label: 'Bone / Joint Ache', nutrientLink: 'D' },
  { id: 'brain-fog', label: 'Brain Fog / Low Focus', nutrientLink: 'B12' },
  { id: 'hair-fall', label: 'Unexplained Hair Fall', nutrientLink: 'D' },
];

export function getTimeMultiplier(window: SunWindow): number {
  if (window === 'peak') return 1.0;
  if (window === 'shoulder') return 0.4;
  return 0.05;
}

export function getSkinMultiplier(fitzpatrick: FitzpatrickType): number {
  const found = FITZPATRICK_SCALE.find((item) => item.type === fitzpatrick);
  return found ? found.melaninMultiplier : 0.85;
}

export function getExposureAreaFactor(area: ExposureArea): number {
  return area === 'shorts-tshirt' ? 0.7 : 0.35;
}

export function calculateSynthesizedIU(
  minutes: number,
  sunWindow: SunWindow,
  fitzpatrick: FitzpatrickType,
  exposureArea: ExposureArea
): number {
  const timeMult = getTimeMultiplier(sunWindow);
  const skinMult = getSkinMultiplier(fitzpatrick);
  const areaFactor = getExposureAreaFactor(exposureArea);
  return Math.round(Math.max(0, minutes) * 35 * timeMult * skinMult * areaFactor);
}

export function calculateDailyTargets(profile: UserProfile): DailyTargets {
  let b12RiskScore = 15;
  let vitaminB12_mcg = 2.2;
  let fortifiedRequired = false;
  const clinicalNotes: string[] = [];

  if (profile.dietType === 'strict-vegan') {
    b12RiskScore += 40;
    vitaminB12_mcg = 2.4;
    fortifiedRequired = true;
    clinicalNotes.push(
      'Strict vegan diets lack active cobalamin; fortified foods (+F) or nutritional yeast are mandatory.'
    );
  } else if (profile.dietType === 'lacto-veg') {
    b12RiskScore += 20;
    vitaminB12_mcg = 2.2;
    clinicalNotes.push(
      'Lacto-vegetarian baseline carries moderate B12 deficit risk unless 2+ daily dairy servings are consumed.'
    );
  } else if (profile.dietType === 'eggetarian') {
    b12RiskScore += 8;
    vitaminB12_mcg = 2.2;
  } else {
    vitaminB12_mcg = 2.2;
  }

  const baselineSynthesizedIU = calculateSynthesizedIU(
    profile.dailyOutdoorMinutes,
    profile.sunWindow,
    profile.fitzpatrickType,
    profile.exposureArea
  );

  // Vitamin D target calculation (600 IU ICMR standard -> 1000-2000 IU recovery)
  let vitaminD_IU = 600;
  let dRiskScore = 15;

  if (baselineSynthesizedIU < 150) {
    dRiskScore += 35;
  } else if (baselineSynthesizedIU < 350) {
    dRiskScore += 20;
  } else {
    dRiskScore += 5;
  }

  if (profile.fitzpatrickType >= 5) {
    dRiskScore += 15;
    clinicalNotes.push(
      'Fitzpatrick V–VI melanin reduces UV-B conversion rate (0.65×); aim for 25–30 min midday terrace sun.'
    );
  }

  const hasBoneOrFatigue =
    profile.symptoms.includes('bone-ache') ||
    profile.symptoms.includes('fatigue') ||
    profile.symptoms.includes('hair-fall');

  if (profile.symptoms.includes('tingling') || profile.symptoms.includes('brain-fog')) {
    b12RiskScore += 20;
  }
  if (profile.symptoms.includes('fatigue')) {
    b12RiskScore += 10;
    dRiskScore += 10;
  }
  if (profile.symptoms.includes('bone-ache')) {
    dRiskScore += 20;
  }
  if (profile.symptoms.includes('hair-fall')) {
    dRiskScore += 10;
  }

  if (hasBoneOrFatigue && vitaminD_IU < 1000) {
    vitaminD_IU = 1000;
  }

  const serumD = parseFloat(profile.serumD_ng_mL);
  if (!Number.isNaN(serumD) && serumD > 0) {
    if (serumD < 12) {
      vitaminD_IU = 2000;
      dRiskScore += 35;
      clinicalNotes.push(
        `Serum 25(OH)D (${serumD} ng/mL) indicates severe deficiency (<12 ng/mL). Target scaled to 2,000 IU.`
      );
    } else if (serumD < 20) {
      vitaminD_IU = 1600;
      dRiskScore += 28;
      clinicalNotes.push(
        `Serum 25(OH)D (${serumD} ng/mL) is deficient (<20 ng/mL). Target scaled to 1,600 IU.`
      );
    } else if (serumD < 30) {
      vitaminD_IU = Math.max(vitaminD_IU, 1000);
      dRiskScore += 15;
      clinicalNotes.push(
        `Serum 25(OH)D (${serumD} ng/mL) is insufficient (20–29 ng/mL). Target scaled to 1,000 IU.`
      );
    }
  }

  const serumB12 = parseFloat(profile.serumB12_pg_mL);
  if (!Number.isNaN(serumB12) && serumB12 > 0) {
    if (serumB12 < 200) {
      b12RiskScore += 35;
      vitaminB12_mcg = Math.max(vitaminB12_mcg, 2.8);
      clinicalNotes.push(
        `Serum B12 (${serumB12} pg/mL) is below 200 pg/mL clinical threshold. Elevated daily goal applied.`
      );
    } else if (serumB12 < 300) {
      b12RiskScore += 18;
      clinicalNotes.push(
        `Serum B12 (${serumB12} pg/mL) is borderline sub-optimal (200–300 pg/mL).`
      );
    }
  }

  b12RiskScore = Math.min(98, b12RiskScore);
  dRiskScore = Math.min(98, dRiskScore);

  const maxRisk = Math.max(b12RiskScore, dRiskScore);
  const overallRiskLevel: 'Low' | 'Moderate' | 'High' =
    maxRisk >= 65 ? 'High' : maxRisk >= 38 ? 'Moderate' : 'Low';

  return {
    vitaminD_IU,
    vitaminB12_mcg,
    b12RiskScore,
    dRiskScore,
    overallRiskLevel,
    fortifiedRequired,
    baselineSynthesizedIU,
    clinicalNotes,
  };
}

export const DEFAULT_PROFILE: UserProfile = {
  age: 29,
  biologicalSex: 'male',
  city: 'Bengaluru',
  dietType: 'lacto-veg',
  fitzpatrickType: 4,
  dailyOutdoorMinutes: 15,
  sunWindow: 'shoulder',
  exposureArea: 'face-forearms',
  symptoms: ['fatigue'],
  serumD_ng_mL: '',
  serumB12_pg_mL: '',
};

export const DEMO_LOGGED_FOODS: LoggedFood[] = [
  {
    id: 'demo-food-1',
    name: 'Homemade Curd / Dahi',
    serving: '200g (1 bowl)',
    vitaminB12_mcg: 0.8,
    vitaminD_IU: 0,
    isFatPaired: true,
    absorptionNote: 'Lactic acid fermentation boosts gut B12 bioavailability.',
    source: 'database',
    timestamp: '08:45 AM',
  },
  {
    id: 'demo-food-2',
    name: 'Fortified Cow Milk (+F)',
    serving: '250ml (1 glass)',
    vitaminB12_mcg: 1.1,
    vitaminD_IU: 100,
    isFatPaired: true,
    absorptionNote: 'FSSAI "+F" dairy paired with milk lipids for Vitamin D uptake.',
    source: 'database',
    timestamp: '10:30 AM',
  },
];

export const DEMO_SUN_SESSIONS: SunSession[] = [
  {
    id: 'demo-sun-1',
    exercise: 'Terrace Surya Namaskar',
    durationMinutes: 12,
    exposureArea: 'face-forearms',
    synthesizedIU: 125,
    timestamp: '11:15 AM',
  },
];

export function formatDietLabel(diet: DietType): string {
  switch (diet) {
    case 'strict-vegan':
      return 'Strict Vegan';
    case 'lacto-veg':
      return 'Lacto-Vegetarian';
    case 'eggetarian':
      return 'Eggetarian';
    case 'non-veg':
      return 'Non-Vegetarian';
  }
}

export function getEffectiveFoodVitaminD(food: LoggedFood, globalHealthyFats: boolean): number {
  const hasFat = food.isFatPaired || globalHealthyFats;
  return Math.round(food.vitaminD_IU * (hasFat ? 1.25 : 1));
}
