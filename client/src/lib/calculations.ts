import { cropTypes, irrigationMethods } from "@/data/mockData";

export const calculateSoilHealth = (
  pH: number,
  nitrogen: number,
  phosphorus: number,
  potassium: number
): { score: number; status: string; recommendations: string[] } => {
  let score = 50;
  const recommendations: string[] = [];

  // pH scoring
  if (pH >= 6.0 && pH <= 7.5) {
    score += 20;
  } else if (pH < 6.0) {
    recommendations.push("Add lime to increase soil pH");
  } else {
    recommendations.push("Add sulfur to decrease soil pH");
  }

  // Nitrogen scoring
  if (nitrogen >= 20) {
    score += 15;
  } else {
    recommendations.push("Consider cover cropping to increase nitrogen");
  }

  // Phosphorus scoring
  if (phosphorus >= 10) {
    score += 10;
  } else {
    recommendations.push("Add phosphorus fertilizer or bone meal");
  }

  // Potassium scoring
  if (potassium >= 100) {
    score += 15;
  } else {
    recommendations.push("Add potassium fertilizer or compost");
  }

  // Default recommendations
  if (recommendations.length === 0) {
    recommendations.push(
      "Add organic compost to improve soil structure",
      "Reduce tillage to preserve soil microorganisms",
      "Consider cover cropping for continuous soil improvement"
    );
  }

  const status = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Moderate" : "Poor";

  return { score: Math.min(100, score), status, recommendations };
};

export const calculateWaterUsage = (
  cropType: string,
  irrigationMethod: string,
  rainfall: number,
  fieldSize: number
): {
  totalUsage: number;
  efficiency: number;
  tips: string[];
  weeklySchedule: { day: string; amount: number }[];
} => {
  const crop = cropTypes.find((c) => c.value === cropType);
  const method = irrigationMethods.find((m) => m.value === irrigationMethod);

  if (!crop || !method) {
    return {
      totalUsage: 0,
      efficiency: 0,
      tips: [],
      weeklySchedule: [],
    };
  }

  let baseUsage = crop.waterNeed; // gallons per acre per week
  const adjustedUsage = baseUsage * method.efficiency;
  const totalUsage = Math.round(adjustedUsage * fieldSize);

  // Adjust for rainfall
  const rainfallAdjustment = rainfall > 20 ? 0.8 : 1.0;
  const finalUsage = Math.round(totalUsage * rainfallAdjustment);

  const efficiency = Math.round(100 - (method.efficiency - 0.6) * 100);

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
    "cover-crops": 0.5,
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
    "cover-crop": { soil: 15, carbon: 10, water: 0, biodiversity: 20 },
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
