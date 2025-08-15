// Test scenarios for comprehensive dashboard testing
export interface TestScenario {
  id: string;
  name: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    locationName: string;
  };
  mockData: {
    earthData: any;
    weatherData: any;
    airQualityData: any;
  };
  expectedInsights: string[];
  farmProfile: {
    cropTypes: string[];
    farmSize: number;
    equipment: string[];
  };
}

export const testScenarios: TestScenario[] = [
  {
    id: "drought-stress",
    name: "Drought Stress Scenario",
    description: "High temperature, low NDVI, poor air quality - stress conditions",
    location: {
      latitude: 38.2904,
      longitude: -92.6390,
      locationName: "Central Missouri Farmland"
    },
    mockData: {
      earthData: {
        ndvi: 0.25,
        landSurfaceTemperature: 35,
        evapotranspiration: 1.2,
        vegetationStatus: "Poor",
        temperatureStatus: "Very Hot",
        droughtRisk: "High",
        timestamp: new Date().toISOString(),
        dataSource: "NASA MODIS/VIIRS Agricultural Environmental Data"
      },
      weatherData: {
        location: { latitude: 38.2904, longitude: -92.6390, locationName: "Central Missouri" },
        current: {
          temperature: 95,
          temperatureUnit: "F",
          conditions: "Hot and Sunny",
          windSpeed: "5 mph",
          humidity: "25%",
          pressure: "29.85 in"
        },
        forecast: [
          { day: "Today", high: 95, low: 72, conditions: "Hot", precipitation: "0%" },
          { day: "Tomorrow", high: 97, low: 75, conditions: "Sunny", precipitation: "0%" },
          { day: "Wednesday", high: 92, low: 70, conditions: "Partly Cloudy", precipitation: "10%" }
        ]
      },
      airQualityData: {
        location: "Central Missouri",
        aqi: 125,
        status: "Unhealthy for Sensitive Groups",
        pm25: 65,
        pm10: 89,
        ozone: 145,
        timestamp: new Date().toISOString()
      }
    },
    expectedInsights: [
      "Critical irrigation needed due to high drought risk",
      "Consider heat-resistant crop varieties",
      "Air quality may affect field operations",
      "Implement water conservation strategies"
    ],
    farmProfile: {
      cropTypes: ["corn", "wheat"],
      farmSize: 500,
      equipment: ["center pivot irrigation", "GPS-guided combine"]
    }
  },
  {
    id: "optimal-growing",
    name: "Optimal Growing Conditions",
    description: "Perfect conditions - high NDVI, moderate temperature, excellent air quality",
    location: {
      latitude: 42.0308,
      longitude: -93.6319,
      locationName: "Iowa Corn Belt Premium"
    },
    mockData: {
      earthData: {
        ndvi: 0.85,
        landSurfaceTemperature: 24,
        evapotranspiration: 4.2,
        vegetationStatus: "Excellent",
        temperatureStatus: "Moderate",
        droughtRisk: "Low",
        timestamp: new Date().toISOString(),
        dataSource: "NASA MODIS/VIIRS Agricultural Environmental Data"
      },
      weatherData: {
        location: { latitude: 42.0308, longitude: -93.6319, locationName: "Iowa Corn Belt" },
        current: {
          temperature: 75,
          temperatureUnit: "F",
          conditions: "Partly Cloudy",
          windSpeed: "8 mph",
          humidity: "65%",
          pressure: "30.15 in"
        },
        forecast: [
          { day: "Today", high: 78, low: 62, conditions: "Partly Cloudy", precipitation: "20%" },
          { day: "Tomorrow", high: 80, low: 65, conditions: "Sunny", precipitation: "10%" },
          { day: "Wednesday", high: 76, low: 60, conditions: "Light Rain", precipitation: "60%" }
        ]
      },
      airQualityData: {
        location: "Iowa Corn Belt",
        aqi: 32,
        status: "Good",
        pm25: 8,
        pm10: 15,
        ozone: 42,
        timestamp: new Date().toISOString()
      }
    },
    expectedInsights: [
      "Excellent growing conditions detected",
      "Optimal time for precision nutrient application",
      "Consider increasing planting density next season",
      "Monitor for potential pest activity in warm conditions"
    ],
    farmProfile: {
      cropTypes: ["corn", "soybeans"],
      farmSize: 200,
      equipment: ["GPS-guided planter", "variable rate spreader", "drone sprayer"]
    }
  },
  {
    id: "spring-planting",
    name: "Spring Planting Season",
    description: "Early season conditions - moderate NDVI, cool temperatures, variable weather",
    location: {
      latitude: 44.9778,
      longitude: -93.2650,
      locationName: "Minnesota Prairie Region"
    },
    mockData: {
      earthData: {
        ndvi: 0.45,
        landSurfaceTemperature: 12,
        evapotranspiration: 2.8,
        vegetationStatus: "Moderate",
        temperatureStatus: "Cool",
        droughtRisk: "Low",
        timestamp: new Date().toISOString(),
        dataSource: "NASA MODIS/VIIRS Agricultural Environmental Data"
      },
      weatherData: {
        location: { latitude: 44.9778, longitude: -93.2650, locationName: "Minnesota Prairie" },
        current: {
          temperature: 55,
          temperatureUnit: "F",
          conditions: "Overcast",
          windSpeed: "12 mph",
          humidity: "78%",
          pressure: "29.95 in"
        },
        forecast: [
          { day: "Today", high: 58, low: 45, conditions: "Cloudy", precipitation: "40%" },
          { day: "Tomorrow", high: 62, low: 48, conditions: "Light Rain", precipitation: "70%" },
          { day: "Wednesday", high: 65, low: 50, conditions: "Partly Sunny", precipitation: "30%" }
        ]
      },
      airQualityData: {
        location: "Minnesota Prairie",
        aqi: 45,
        status: "Good",
        pm25: 12,
        pm10: 20,
        ozone: 38,
        timestamp: new Date().toISOString()
      }
    },
    expectedInsights: [
      "Soil temperature suitable for spring planting",
      "Monitor soil moisture before field operations",
      "Good conditions for cover crop establishment",
      "Consider delayed release fertilizers"
    ],
    farmProfile: {
      cropTypes: ["soybeans", "alfalfa", "winter wheat"],
      farmSize: 320,
      equipment: ["no-till planter", "field cultivator", "manure spreader"]
    }
  },
  {
    id: "california-specialty",
    name: "California Specialty Crops",
    description: "Mediterranean climate - high value crops, irrigation intensive",
    location: {
      latitude: 36.7783,
      longitude: -119.4179,
      locationName: "Central Valley California"
    },
    mockData: {
      earthData: {
        ndvi: 0.65,
        landSurfaceTemperature: 28,
        evapotranspiration: 5.8,
        vegetationStatus: "Good",
        temperatureStatus: "Warm",
        droughtRisk: "Moderate",
        timestamp: new Date().toISOString(),
        dataSource: "NASA MODIS/VIIRS Agricultural Environmental Data"
      },
      weatherData: {
        location: { latitude: 36.7783, longitude: -119.4179, locationName: "Central Valley CA" },
        current: {
          temperature: 82,
          temperatureUnit: "F",
          conditions: "Sunny",
          windSpeed: "6 mph",
          humidity: "45%",
          pressure: "30.05 in"
        },
        forecast: [
          { day: "Today", high: 85, low: 58, conditions: "Sunny", precipitation: "0%" },
          { day: "Tomorrow", high: 87, low: 60, conditions: "Clear", precipitation: "0%" },
          { day: "Wednesday", high: 84, low: 59, conditions: "Sunny", precipitation: "5%" }
        ]
      },
      airQualityData: {
        location: "Central Valley California",
        aqi: 85,
        status: "Moderate",
        pm25: 35,
        pm10: 55,
        ozone: 92,
        timestamp: new Date().toISOString()
      }
    },
    expectedInsights: [
      "High evapotranspiration requires precise irrigation scheduling",
      "Consider micro-sprinkler systems for efficiency",
      "Air quality may impact worker schedules",
      "Optimal conditions for high-value specialty crops"
    ],
    farmProfile: {
      cropTypes: ["almonds", "grapes", "tomatoes"],
      farmSize: 150,
      equipment: ["drip irrigation system", "micro-sprinklers", "precision pruning tools"]
    }
  },
  {
    id: "southeastern-humid",
    name: "Southeastern Humid Conditions",
    description: "High humidity, warm temperatures, pest pressure concerns",
    location: {
      latitude: 32.8407,
      longitude: -83.6324,
      locationName: "Central Georgia Farmland"
    },
    mockData: {
      earthData: {
        ndvi: 0.72,
        landSurfaceTemperature: 30,
        evapotranspiration: 4.8,
        vegetationStatus: "Good",
        temperatureStatus: "Hot",
        droughtRisk: "Low",
        timestamp: new Date().toISOString(),
        dataSource: "NASA MODIS/VIIRS Agricultural Environmental Data"
      },
      weatherData: {
        location: { latitude: 32.8407, longitude: -83.6324, locationName: "Central Georgia" },
        current: {
          temperature: 88,
          temperatureUnit: "F",
          conditions: "Humid",
          windSpeed: "3 mph",
          humidity: "85%",
          pressure: "29.92 in"
        },
        forecast: [
          { day: "Today", high: 90, low: 72, conditions: "Thunderstorms", precipitation: "80%" },
          { day: "Tomorrow", high: 87, low: 70, conditions: "Partly Cloudy", precipitation: "40%" },
          { day: "Wednesday", high: 89, low: 73, conditions: "Humid", precipitation: "60%" }
        ]
      },
      airQualityData: {
        location: "Central Georgia",
        aqi: 55,
        status: "Moderate",
        pm25: 18,
        pm10: 28,
        ozone: 65,
        timestamp: new Date().toISOString()
      }
    },
    expectedInsights: [
      "High humidity increases fungal disease risk",
      "Monitor for pest activity in warm, humid conditions",
      "Good soil moisture but watch for waterlogging",
      "Consider fungicide applications as preventive measure"
    ],
    farmProfile: {
      cropTypes: ["cotton", "peanuts", "sweet corn"],
      farmSize: 400,
      equipment: ["center pivot irrigation", "fungicide sprayer", "GPS-guided cotton picker"]
    }
  }
];

export const getRandomTestScenario = (): TestScenario => {
  return testScenarios[Math.floor(Math.random() * testScenarios.length)];
};

export const getScenarioById = (id: string): TestScenario | undefined => {
  return testScenarios.find(scenario => scenario.id === id);
};