// Mock data for the Soma Dashboard application
// In production, this would be replaced with real API calls

export const weatherData = {
  temperature: 22,
  humidity: 65,
  rainfall: 2,
  condition: "Partly Cloudy",
};

export const soilHealthData = {
  score: 72,
  status: "Good",
  pH: 6.8,
  nitrogen: 25,
  phosphorus: 15,
  potassium: 120,
  organicMatter: 3.2,
};

export const carbonData = {
  totalSaved: 2.5,
  thisYear: 142,
  monthlyTrend: [
    { month: "Jan", co2: 3.2 },
    { month: "Feb", co2: 2.8 },
    { month: "Mar", co2: 2.1 },
    { month: "Apr", co2: 1.8 },
    { month: "May", co2: 1.5 },
    { month: "Jun", co2: 1.2 },
  ],
};

export const waterData = {
  efficiency: 78,
  monthlyUsage: [
    { month: "Jan", usage: 80, rainfall: 60 },
    { month: "Feb", usage: 90, rainfall: 55 },
    { month: "Mar", usage: 70, rainfall: 65 },
    { month: "Apr", usage: 100, rainfall: 50 },
    { month: "May", usage: 60, rainfall: 70 },
    { month: "Jun", usage: 85, rainfall: 45 },
  ],
};

export const practicesData = [
  {
    id: "cover-crop",
    name: "Cover Cropping",
    description: "Plant cover crops between growing seasons",
    benefit: "+15% Soil Health",
    adopted: false,
    impact: { soil: 15, carbon: 10, water: 0, biodiversity: 20 },
  },
  {
    id: "crop-rotation",
    name: "Crop Rotation",
    description: "Rotate different crops to improve soil nutrients",
    benefit: "+20% Yield",
    adopted: false,
    impact: { soil: 20, carbon: 5, water: 0, biodiversity: 15 },
  },
  {
    id: "no-till",
    name: "No-Till Farming",
    description: "Minimize soil disturbance during planting",
    benefit: "+25% Carbon Storage",
    adopted: false,
    impact: { soil: 10, carbon: 25, water: 0, biodiversity: 10 },
  },
  {
    id: "composting",
    name: "Organic Composting",
    description: "Use organic matter to enrich soil naturally",
    benefit: "+30% Organic Matter",
    adopted: false,
    impact: { soil: 30, carbon: 15, water: 0, biodiversity: 20 },
  },
  {
    id: "precision-irrigation",
    name: "Precision Irrigation",
    description: "Use sensors and data to optimize water usage",
    benefit: "-40% Water Use",
    adopted: false,
    impact: { soil: 0, carbon: 0, water: 40, biodiversity: 5 },
  },
];

export const carbonPractices = [
  { name: "Cover Crops", value: 0.5, unit: "tons CO₂/acre/year" },
  { name: "No-Till Farming", value: 0.8, unit: "tons CO₂/acre/year" },
  { name: "Crop Rotation", value: 0.3, unit: "tons CO₂/acre/year" },
  { name: "Organic Composting", value: 0.4, unit: "tons CO₂/acre/year" },
  { name: "Agroforestry", value: 0.2, unit: "tons CO₂/acre/year" },
];

export const sustainabilityMetrics = {
  soilHealthScore: 78,
  waterEfficiency: 85,
  co2Sequestered: 142,
  improvementFromLastYear: {
    soil: 12,
    water: 8,
    carbon: 28,
  },
  monthlyProgress: [65, 68, 72, 75, 78, 80, 82, 84, 86, 88, 90, 92],
  practiceAdoption: {
    coverCropping: 90,
    noTill: 75,
    cropRotation: 85,
    composting: 60,
  },
};

export const aiChatHistory = [
  {
    id: 1,
    message: "Hello! I'm your AI farming assistant. I can help you with crop management, sustainability practices, and answer any questions about your farm. What would you like to know?",
    isUser: false,
    timestamp: new Date(Date.now() - 5 * 60000),
  },
  {
    id: 2,
    message: "How can I reduce water usage for my corn crops this season?",
    isUser: true,
    timestamp: new Date(Date.now() - 3 * 60000),
  },
  {
    id: 3,
    message: "Great question! Here are several strategies to reduce water usage for corn:\n\n• Drip irrigation: Can reduce water usage by 30-50%\n• Soil moisture sensors: Prevent over-watering\n• Mulching: Reduces evaporation by 40%\n• Timing: Water early morning to minimize loss\n\nBased on your recent rainfall data (25mm), you could reduce irrigation by 20% this week. Would you like specific recommendations for your field size?",
    isUser: false,
    timestamp: new Date(Date.now() - 2 * 60000),
  },
];

export const cropTypes = [
  { value: "corn", label: "Corn", waterNeed: 1.25 },      // inches per week
  { value: "wheat", label: "Wheat", waterNeed: 0.9 },     // inches per week
  { value: "rice", label: "Rice", waterNeed: 2.0 },       // inches per week
  { value: "soy", label: "Soybean", waterNeed: 1.1 },     // inches per week
];

export const irrigationMethods = [
  { value: "drip", label: "Drip Irrigation", efficiency: 0.9 },      // High efficiency, low water loss
  { value: "sprinkler", label: "Sprinkler System", efficiency: 0.7 }, // Medium efficiency
  { value: "flood", label: "Flood Irrigation", efficiency: 0.5 },     // Low efficiency, high water loss
];
