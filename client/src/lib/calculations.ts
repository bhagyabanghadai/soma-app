import { cropTypes, irrigationMethods } from "@/data/mockData";

// Smooth scoring function for nutrient ranges
const triangularScore = (value: number, low: number, optLow: number, optHigh: number, high: number): number => {
  if (value <= low || value >= high) return 0;
  if (value >= optLow && value <= optHigh) return 1;
  return (value < optLow) ? (value - low) / (optLow - low) : (high - value) / (high - optHigh);
};

export const calculateSoilHealth = (
  pH: number,
  nitrogenPPM: number,
  phosphorusPPM: number,
  potassiumPPM: number,
  organicMatterPct: number = 3
): { score: number; status: string; recommendations: string[] } => {
  const recommendations: string[] = [];

  // Smooth pH scoring (penalty curve away from 6.5-7.0)
  const pHScore = 1 - (Math.min(Math.abs(pH - 6.8), 2.0) / 2.0);
  if (pH < 6.0) recommendations.push("Add lime to increase soil pH");
  if (pH > 8.0) recommendations.push("Add sulfur to decrease soil pH");

  // Smooth nutrient scoring with optimal ranges
  const nitrogenScore = triangularScore(nitrogenPPM, 5, 15, 30, 60);
  if (nitrogenPPM < 15) recommendations.push("Consider cover cropping to increase nitrogen");
  
  const phosphorusScore = triangularScore(phosphorusPPM, 5, 15, 30, 60);
  if (phosphorusPPM < 15) recommendations.push("Add phosphorus fertilizer or bone meal");
  
  const potassiumScore = triangularScore(potassiumPPM, 60, 120, 200, 320);
  if (potassiumPPM < 120) recommendations.push("Add potassium fertilizer or compost");
  
  const organicMatterScore = triangularScore(organicMatterPct, 1, 3, 6, 10);
  if (organicMatterPct < 3) recommendations.push("Add organic compost to improve soil structure");

  // Weighted scoring
  const weights = { pH: 0.25, nitrogen: 0.2, phosphorus: 0.15, potassium: 0.2, organicMatter: 0.2 };
  const score01 = pHScore * weights.pH + nitrogenScore * weights.nitrogen + 
                  phosphorusScore * weights.phosphorus + potassiumScore * weights.potassium + 
                  organicMatterScore * weights.organicMatter;
  const score = Math.round(score01 * 100);

  // Default recommendations when soil is healthy
  if (recommendations.length === 0) {
    recommendations.push(
      "Maintain current good practices",
      "Continue regular soil testing",
      "Monitor organic matter levels annually"
    );
  }

  const status = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Moderate" : "Poor";

  return { score: Math.min(100, score), status, recommendations };
};

export const calculateWaterUsage = (
  cropType: string,
  irrigationMethod: string,
  rainfallInchesPerWeek: number,
  fieldSizeAcres: number,
  waterPricePer1000gal: number = 3.5
): {
  totalUsage: number;
  efficiency: number;
  tips: string[];
  weeklySchedule: { day: string; amount: number }[];
  costUSD: number;
} => {
  const crop = cropTypes.find((c) => c.value === cropType);
  const method = irrigationMethods.find((m) => m.value === irrigationMethod);

  if (!crop || !method) {
    return {
      totalUsage: 0,
      efficiency: 0,
      tips: [],
      weeklySchedule: [],
      costUSD: 0,
    };
  }

  const INCH_ACRE_TO_GAL = 27154;
  const effectiveRainCoeff = 0.8; // Account for runoff/soil limits
  
  // Calculate net water need after accounting for effective rainfall
  const netInchesNeeded = Math.max(0, crop.waterNeed - rainfallInchesPerWeek * effectiveRainCoeff);
  
  // Apply irrigation efficiency (need more water due to system losses)
  const inchesApplied = netInchesNeeded / Math.max(0.1, method.efficiency);
  const gallons = inchesApplied * INCH_ACRE_TO_GAL * fieldSizeAcres;

  const finalUsage = Math.round(gallons);
  const costUSD = Math.round((gallons / 1000) * waterPricePer1000gal);

  // Efficiency score: map efficiency 0.4–0.95 to 0–100
  const efficiency = Math.round((Math.min(0.95, Math.max(0.4, method.efficiency)) - 0.4) / (0.95 - 0.4) * 100);

  const tips = [
    "Consider drip irrigation to reduce usage by 40%",
    "Install soil moisture sensors for precision watering",
    "Water early morning to reduce evaporation losses",
    "Use mulch to retain soil moisture",
  ];

  const dailyAmount = Math.round(finalUsage / 3);
  const weeklySchedule = [
    { day: "Monday", amount: dailyAmount },
    { day: "Wednesday", amount: dailyAmount },
    { day: "Friday", amount: dailyAmount },
  ];

  return {
    totalUsage: finalUsage,
    efficiency,
    tips,
    weeklySchedule,
    costUSD,
  };
};

export const calculateCarbonCredits = (
  landSize: number,
  selectedPractices: string[],
  duration: number
): {
  totalCarbon: number;
  earnings: number;
  annualCarbon: number;
  annualEarnings: number;
  breakdown: { practice: string; carbon: number; earnings: number }[];
} => {
  const practiceValues: { [key: string]: number } = {
    "cover-crop": 0.5,
    "no-till": 0.8,
    "crop-rotation": 0.3,
    "composting": 0.4,
    "agroforestry": 0.2,
  };

  const breakdown = selectedPractices.map((practice) => {
    const carbonPerAcre = practiceValues[practice] || 0;
    const totalCarbon = carbonPerAcre * landSize * duration;
    const earnings = totalCarbon * 20; // $20 per ton

    return {
      practice: practice.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      carbon: totalCarbon,
      earnings,
    };
  });

  const totalCarbon = breakdown.reduce((sum, item) => sum + item.carbon, 0);
  const earnings = totalCarbon * 20;
  const annualCarbon = totalCarbon / duration;
  const annualEarnings = earnings / duration;

  return {
    totalCarbon: Math.round(totalCarbon),
    earnings: Math.round(earnings),
    annualCarbon: Math.round(annualCarbon),
    annualEarnings: Math.round(annualEarnings),
    breakdown,
  };
};

export const calculatePracticeImpact = (selectedPractices: string[]) => {
  const practiceImpacts: { [key: string]: { soil: number; carbon: number; water: number; biodiversity: number } } = {
    "cover-crop": { soil: 15, carbon: 10, water: 5, biodiversity: 20 },
    "crop-rotation": { soil: 20, carbon: 5, water: 0, biodiversity: 15 },
    "no-till": { soil: 10, carbon: 25, water: 0, biodiversity: 10 },
    "composting": { soil: 30, carbon: 15, water: 0, biodiversity: 20 },
    "precision-irrigation": { soil: 0, carbon: 0, water: 40, biodiversity: 5 },
  };

  const totalImpact = selectedPractices.reduce(
    (acc, practice) => {
      const impact = practiceImpacts[practice] || { soil: 0, carbon: 0, water: 0, biodiversity: 0 };
      return {
        soil: acc.soil + impact.soil,
        carbon: acc.carbon + impact.carbon,
        water: acc.water + impact.water,
        biodiversity: acc.biodiversity + impact.biodiversity,
      };
    },
    { soil: 0, carbon: 0, water: 0, biodiversity: 0 }
  );

  return totalImpact;
};
