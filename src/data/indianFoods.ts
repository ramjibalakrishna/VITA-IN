import { DietType, IndianFoodItem } from '../types/vita';

export const INDIAN_FOODS: IndianFoodItem[] = [
  {
    id: 'curd-dahi',
    name: 'Homemade Curd / Dahi',
    hindiName: 'Dahi',
    category: 'Dairy & Fermented',
    dietTag: 'Veg',
    servingSize: '200g (1 bowl)',
    vitaminB12_mcg: 0.8,
    vitaminD_IU: 0,
    hasHealthyFat: true,
    bioavailabilityNote:
      'Active lactic acid cultures enhance gut B12 bioavailability compared to boiled milk; pair with meals away from chai.',
  },
  {
    id: 'paneer-fresh',
    name: 'Fresh Paneer',
    hindiName: 'Paneer',
    category: 'Dairy & Fermented',
    dietTag: 'Veg',
    servingSize: '100g',
    vitaminB12_mcg: 0.7,
    vitaminD_IU: 0,
    hasHealthyFat: true,
    bioavailabilityNote:
      'Casein-bound B12 with natural milk fat; gentle cooking retains up to 85% of B12 compared to deep frying.',
  },
  {
    id: 'fortified-milk',
    name: 'Fortified Cow / Buffalo Milk',
    hindiName: 'Doodh (+F)',
    category: 'Dairy & Fermented',
    dietTag: 'Veg',
    servingSize: '250ml (1 glass)',
    vitaminB12_mcg: 1.1,
    vitaminD_IU: 100,
    hasHealthyFat: true,
    bioavailabilityNote:
      'FSSAI "+F" fortified milk delivers whey-stabilized B12 and fat-soluble D3; avoid prolonged open boiling.',
  },
  {
    id: 'chaas-buttermilk',
    name: 'Spiced Buttermilk / Chaas',
    hindiName: 'Chaas',
    category: 'Dairy & Fermented',
    dietTag: 'Veg',
    servingSize: '300ml (1 tall glass)',
    vitaminB12_mcg: 0.5,
    vitaminD_IU: 0,
    hasHealthyFat: false,
    bioavailabilityNote:
      'Low-fat probiotic hydration ideal at lunch; cumin and ginger aid gastric intrinsic factor secretion.',
  },
  {
    id: 'uv-mushrooms',
    name: 'UV-Exposed Mushrooms',
    hindiName: 'Dhoop Khumb',
    category: 'Fortified & Plant',
    dietTag: 'Vegan',
    servingSize: '100g',
    vitaminB12_mcg: 0,
    vitaminD_IU: 400,
    hasHealthyFat: false,
    bioavailabilityNote:
      'Sun-exposed button or oyster mushrooms convert ergosterol to Vitamin D2. Always saute in ghee or cold-pressed oil.',
  },
  {
    id: 'fortified-ghee-oil',
    name: 'Fortified Edible Oil / Desi Ghee',
    hindiName: 'Fortified Tel / Ghee',
    category: 'Fortified & Plant',
    dietTag: 'Veg',
    servingSize: '1 tbsp (15g)',
    vitaminB12_mcg: 0,
    vitaminD_IU: 45,
    hasHealthyFat: true,
    bioavailabilityNote:
      'Provides both FSSAI-fortified Vitamin D and medium-chain triglycerides required to form chylomicrons for Vitamin D uptake.',
  },
  {
    id: 'nutritional-yeast',
    name: 'Fortified Nutritional Yeast',
    hindiName: 'Nooch Flakes',
    category: 'Fortified & Plant',
    dietTag: 'Vegan',
    servingSize: '1 tbsp (10g)',
    vitaminB12_mcg: 2.4,
    vitaminD_IU: 0,
    hasHealthyFat: false,
    bioavailabilityNote:
      'Essential vegan B12 powerhouse (100% ICMR daily target in 1 tbsp). Sprinkle over dal, khichdi, or pasta after cooking.',
  },
  {
    id: 'boiled-eggs',
    name: 'Whole Boiled Eggs',
    hindiName: 'Ubla Anda',
    category: 'Egg & Poultry',
    dietTag: 'Egg',
    servingSize: '2 whole eggs',
    vitaminB12_mcg: 1.1,
    vitaminD_IU: 88,
    hasHealthyFat: true,
    bioavailabilityNote:
      'Must consume the yolk—both Vitamin D and yolk lipids reside there; egg-white-only omelettes strip 100% of Vitamin D.',
  },
  {
    id: 'rohu-fish',
    name: 'Rohu Fish Curry',
    hindiName: 'Rohu Machli',
    category: 'Fish & Seafood',
    dietTag: 'Non-Veg',
    servingSize: '100g fillet',
    vitaminB12_mcg: 2.5,
    vitaminD_IU: 220,
    hasHealthyFat: true,
    bioavailabilityNote:
      'Indian freshwater carp rich in highly bioavailable methylcobalamin and cholecalciferol when simmered gently.',
  },
  {
    id: 'bangda-mackerel',
    name: 'Indian Mackerel / Bangda',
    hindiName: 'Bangda',
    category: 'Fish & Seafood',
    dietTag: 'Non-Veg',
    servingSize: '100g',
    vitaminB12_mcg: 3.2,
    vitaminD_IU: 360,
    hasHealthyFat: true,
    bioavailabilityNote:
      'Coastal oily fish pairing omega-3 fatty acids with dense Vitamin D3 and B12 for rapid serum recovery.',
  },
  {
    id: 'chicken-breast',
    name: 'Tandoori / Grilled Chicken Breast',
    hindiName: 'Murgh',
    category: 'Egg & Poultry',
    dietTag: 'Non-Veg',
    servingSize: '100g cooked',
    vitaminB12_mcg: 0.4,
    vitaminD_IU: 5,
    hasHealthyFat: false,
    bioavailabilityNote:
      'Moderate B12 source; significantly lower in B12 and Vitamin D than fish or eggs, so pair with curd marinades.',
  },
  {
    id: 'fortified-soy-milk',
    name: 'Fortified Soy Milk (Unsweetened)',
    hindiName: 'Soy Doodh (+F)',
    category: 'Fortified & Plant',
    dietTag: 'Vegan',
    servingSize: '250ml (1 glass)',
    vitaminB12_mcg: 1.2,
    vitaminD_IU: 100,
    hasHealthyFat: true,
    bioavailabilityNote:
      'Primary vegan alternative to dairy milk when labelled "+F" fortified with cyanocobalamin and ergocalciferol/D3.',
  },
  {
    id: 'hilsa-ilish',
    name: 'Hilsa / Ilish Mustard Curry',
    hindiName: 'Ilish Mach',
    category: 'Fish & Seafood',
    dietTag: 'Non-Veg',
    servingSize: '100g',
    vitaminB12_mcg: 3.8,
    vitaminD_IU: 420,
    hasHealthyFat: true,
    bioavailabilityNote:
      'Exceptionally rich in natural marine fats and Vitamin D3; mustard oil pairing maximizes micellar uptake.',
  },
  {
    id: 'pomfret',
    name: 'Silver Pomfret Curry / Tawa',
    hindiName: 'Paplet',
    category: 'Fish & Seafood',
    dietTag: 'Non-Veg',
    servingSize: '100g',
    vitaminB12_mcg: 2.1,
    vitaminD_IU: 180,
    hasHealthyFat: true,
    bioavailabilityNote:
      'Light coastal fish providing nearly full daily B12 needs with minimal saturated fat.',
  },
  {
    id: 'malai-lassi',
    name: 'Thick Sweet/Salted Lassi',
    hindiName: 'Malai Lassi',
    category: 'Dairy & Fermented',
    dietTag: 'Veg',
    servingSize: '250ml',
    vitaminB12_mcg: 0.9,
    vitaminD_IU: 15,
    hasHealthyFat: true,
    bioavailabilityNote:
      'Fermented dairy base with milk fat assists mineral and vitamin retention.',
  },
  {
    id: 'egg-bhurji',
    name: 'Masala Egg Bhurji (with Ghee)',
    hindiName: 'Anda Bhurji',
    category: 'Egg & Poultry',
    dietTag: 'Egg',
    servingSize: '2 eggs',
    vitaminB12_mcg: 1.0,
    vitaminD_IU: 84,
    hasHealthyFat: true,
    bioavailabilityNote:
      'Cooking scrambled eggs in 1 tsp ghee improves Vitamin D3 fat-soluble absorption without overheating.',
  },
  {
    id: 'processed-cheese',
    name: 'Cheddar / Processed Cheese Cubes',
    hindiName: 'Cheese',
    category: 'Dairy & Fermented',
    dietTag: 'Veg',
    servingSize: '40g (2 cubes)',
    vitaminB12_mcg: 0.6,
    vitaminD_IU: 12,
    hasHealthyFat: true,
    bioavailabilityNote:
      'Concentrated fermented milk proteins keep B12 intact even in vegetarian snacks.',
  },
  {
    id: 'fortified-atta-cereal',
    name: 'Fortified Wheat / Millet Flakes',
    hindiName: 'Fortified Dalia / Flakes',
    category: 'Fortified & Plant',
    dietTag: 'Vegan',
    servingSize: '40g (1 bowl)',
    vitaminB12_mcg: 0.9,
    vitaminD_IU: 80,
    hasHealthyFat: false,
    bioavailabilityNote:
      'Check FSSAI "+F" fortification seal; pair with fortified soy or dairy milk and almonds for fat synergy.',
  },
  {
    id: 'prawns-masala',
    name: 'Coastal Prawns / Jhinga',
    hindiName: 'Jhinga',
    category: 'Fish & Seafood',
    dietTag: 'Non-Veg',
    servingSize: '100g',
    vitaminB12_mcg: 1.5,
    vitaminD_IU: 150,
    hasHealthyFat: false,
    bioavailabilityNote:
      'Solid B12 and moderate Vitamin D source; coconut or mustard oil curry enhances fat-soluble retention.',
  },
  {
    id: 'mutton-liver',
    name: 'Mutton Liver / Kaleji Fry',
    hindiName: 'Kaleji',
    category: 'Egg & Poultry',
    dietTag: 'Non-Veg',
    servingSize: '50g (small portion)',
    vitaminB12_mcg: 9.0,
    vitaminD_IU: 22,
    hasHealthyFat: true,
    bioavailabilityNote:
      'Extremely dense hepatic B12 store; 1 small serving every 10–14 days rapidly replenishes depleted liver reserves.',
  },
  {
    id: 'fermented-idli-sambar',
    name: 'Fermented Idli + Drumstick Sambar',
    hindiName: 'Idli Sambar',
    category: 'Fortified & Plant',
    dietTag: 'Vegan',
    servingSize: '3 idlis + 1 bowl',
    vitaminB12_mcg: 0.15,
    vitaminD_IU: 0,
    hasHealthyFat: false,
    bioavailabilityNote:
      'Traditional overnight fermentation yields trace microbial B12 and improves gut flora, though insufficient alone for RDA.',
  },
  {
    id: 'fortified-almond-milk',
    name: 'Fortified Almond / Oat Milk',
    hindiName: 'Badam Milk (+F)',
    category: 'Fortified & Plant',
    dietTag: 'Vegan',
    servingSize: '250ml',
    vitaminB12_mcg: 1.0,
    vitaminD_IU: 90,
    hasHealthyFat: true,
    bioavailabilityNote:
      'Useful vegan option when enriched with B12 and D2/lichen D3; shake carton well as calcium & vitamins settle.',
  },
  {
    id: 'sardines-mathi',
    name: 'Indian Oil Sardines / Mathi',
    hindiName: 'Tarli / Mathi',
    category: 'Fish & Seafood',
    dietTag: 'Non-Veg',
    servingSize: '100g',
    vitaminB12_mcg: 4.5,
    vitaminD_IU: 270,
    hasHealthyFat: true,
    bioavailabilityNote:
      'Affordable, sustainable coastal powerhouse delivering nearly 2× daily B12 and strong Vitamin D3.',
  },
  {
    id: 'shrikhand-curd',
    name: 'Hung Curd / Greek Dahi Bowl',
    hindiName: 'Chakka Dahi',
    category: 'Dairy & Fermented',
    dietTag: 'Veg',
    servingSize: '150g',
    vitaminB12_mcg: 0.9,
    vitaminD_IU: 0,
    hasHealthyFat: true,
    bioavailabilityNote:
      'Strained dahi concentrates protein and B12 while keeping probiotic cultures active; top with walnuts.',
  },
];

export function isFoodCompatibleWithDiet(food: IndianFoodItem, dietType: DietType): boolean {
  if (dietType === 'strict-vegan') return food.dietTag === 'Vegan';
  if (dietType === 'lacto-veg') return food.dietTag === 'Vegan' || food.dietTag === 'Veg';
  if (dietType === 'eggetarian')
    return food.dietTag === 'Vegan' || food.dietTag === 'Veg' || food.dietTag === 'Egg';
  return true;
}

export function getSmartGapFillers(
  dietType: DietType,
  remainingB12Mcg: number,
  remainingDIU: number,
  targetB12Mcg: number,
  targetDIU: number
): IndianFoodItem[] {
  const compatible = INDIAN_FOODS.filter((item) => isFoodCompatibleWithDiet(item, dietType));

  const b12GapRatio = targetB12Mcg > 0 ? Math.max(0, remainingB12Mcg) / targetB12Mcg : 0;
  const dGapRatio = targetDIU > 0 ? Math.max(0, remainingDIU) / targetDIU : 0;

  return [...compatible]
    .sort((a, b) => {
      const aB12Score =
        targetB12Mcg > 0 ? Math.min(1, a.vitaminB12_mcg / Math.max(0.2, remainingB12Mcg || targetB12Mcg)) : 0;
      const aDScore =
        targetDIU > 0 ? Math.min(1, a.vitaminD_IU / Math.max(50, remainingDIU || targetDIU)) : 0;
      const bB12Score =
        targetB12Mcg > 0 ? Math.min(1, b.vitaminB12_mcg / Math.max(0.2, remainingB12Mcg || targetB12Mcg)) : 0;
      const bDScore =
        targetDIU > 0 ? Math.min(1, b.vitaminD_IU / Math.max(50, remainingDIU || targetDIU)) : 0;

      const weightB12 = b12GapRatio >= dGapRatio ? 1.25 : 0.85;
      const weightD = dGapRatio > b12GapRatio ? 1.25 : 0.85;

      const scoreA = aB12Score * weightB12 + aDScore * weightD + (a.hasHealthyFat ? 0.05 : 0);
      const scoreB = bB12Score * weightB12 + bDScore * weightD + (b.hasHealthyFat ? 0.05 : 0);

      return scoreB - scoreA;
    })
    .slice(0, 3);
}
