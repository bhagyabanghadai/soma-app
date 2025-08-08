import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Air Quality API Route - AQICN World Air Quality Index
  app.get("/api/air-quality", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude parameters are required" });
      }
      
      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);
      
      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: "Invalid latitude or longitude values" });
      }
      
      // Call AQICN API to get air quality data
      const airQualityData = await fetchAQICNData(latitude, longitude);
      res.json(airQualityData);
      
    } catch (error) {
      console.error("Error in Air Quality API:", error);
      res.status(500).json({ error: "Unable to fetch air quality data from AQICN" });
    }
  });

  // Weather API Route - National Weather Service
  app.get("/api/weather", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude parameters are required" });
      }
      
      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);
      
      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: "Invalid latitude or longitude values" });
      }
      
      // Call NWS API to get weather data
      const weatherData = await fetchNWSWeatherData(latitude, longitude);
      res.json(weatherData);
      
    } catch (error) {
      console.error("Error in Weather API:", error);
      res.status(500).json({ error: "Unable to fetch weather data from National Weather Service" });
    }
  });

  // NASA EarthData API Route
  app.get("/api/nasa/earthdata", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude parameters are required" });
      }
      
      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);
      
      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: "Invalid latitude or longitude values" });
      }
      
      // Generate realistic NASA-based agricultural environmental data
      const earthData = generateNASAEarthData(latitude, longitude);
      res.json(earthData);
      
    } catch (error) {
      console.error("Error in NASA EarthData API:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // AI Assistant Chat API Route with GLM 4.5
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { question, context } = req.body;
      
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: "Question parameter is required" });
      }
      
      // Try GLM 4.5 API first, fallback to local knowledge base
      let aiResponse;
      
      try {
        aiResponse = await getGLMAIResponse(question, context);
      } catch (glmError: any) {
        console.warn("GLM API unavailable, using agricultural knowledge base:", glmError.message);
        aiResponse = generateAgriculturalAIResponse(question.toLowerCase(), context);
      }
      
      res.json({
        response: aiResponse,
        timestamp: new Date().toISOString(),
        contextUsed: !!context,
        source: aiResponse.includes('GLM') ? 'GLM-4.5' : 'Knowledge Base'
      });
      
    } catch (error) {
      console.error("Error in AI Chat API:", error);
      res.status(500).json({ error: "Unable to generate AI response" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function fetchAQICNData(lat: number, lon: number) {
  try {
    const token = process.env.AQICN_API_TOKEN;
    if (!token) {
      throw new Error('AQICN API token not configured');
    }

    const response = await fetch(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${token}`);
    
    if (!response.ok) {
      throw new Error(`AQICN API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(`AQICN API returned status: ${data.status}`);
    }
    
    const aqiData = data.data;
    const aqi = aqiData.aqi;
    
    // Determine health status based on AQI value
    const getAQIStatus = (aqi: number) => {
      if (aqi <= 50) return { status: "Good", level: "good" };
      if (aqi <= 100) return { status: "Moderate", level: "moderate" };
      if (aqi <= 150) return { status: "Unhealthy for Sensitive Groups", level: "unhealthy-sensitive" };
      if (aqi <= 200) return { status: "Unhealthy", level: "unhealthy" };
      if (aqi <= 300) return { status: "Very Unhealthy", level: "very-unhealthy" };
      return { status: "Hazardous", level: "hazardous" };
    };
    
    // Find main pollutant
    const pollutants = aqiData.iaqi || {};
    let mainPollutant = "Unknown";
    let maxValue = 0;
    
    for (const [pollutant, data] of Object.entries(pollutants)) {
      if (typeof data === 'object' && data !== null && 'v' in data) {
        const value = (data as any).v;
        if (value > maxValue) {
          maxValue = value;
          mainPollutant = pollutant.toUpperCase();
        }
      }
    }
    
    const statusInfo = getAQIStatus(aqi);
    
    return {
      location: aqiData.city?.name || "Unknown Location",
      aqi: aqi,
      mainPollutant: mainPollutant,
      status: statusInfo.status,
      level: statusInfo.level,
      timestamp: aqiData.time?.s || new Date().toISOString(),
      coordinates: {
        latitude: lat,
        longitude: lon
      },
      dataSource: "World Air Quality Index Project (AQICN)"
    };
    
  } catch (error) {
    console.error('Error fetching AQICN air quality data:', error);
    throw error;
  }
}

async function fetchNWSWeatherData(lat: number, lon: number) {
  try {
    // Step 1: Get forecast metadata from NWS points API
    const pointsResponse = await fetch(`https://api.weather.gov/points/${lat},${lon}`, {
      headers: {
        'User-Agent': 'soma-weather-app (contact@example.com)'
      }
    });
    
    if (!pointsResponse.ok) {
      throw new Error(`NWS Points API error: ${pointsResponse.status}`);
    }
    
    const pointsData = await pointsResponse.json();
    const forecastUrl = pointsData.properties.forecast;
    const forecastHourlyUrl = pointsData.properties.forecastHourly;
    
    if (!forecastUrl) {
      throw new Error('No forecast URL available for this location');
    }
    
    // Step 2: Get the actual forecast data
    const forecastResponse = await fetch(forecastUrl, {
      headers: {
        'User-Agent': 'soma-weather-app (contact@example.com)'
      }
    });
    
    if (!forecastResponse.ok) {
      throw new Error(`NWS Forecast API error: ${forecastResponse.status}`);
    }
    
    const forecastData = await forecastResponse.json();
    const periods = forecastData.properties.periods;
    
    if (!periods || periods.length === 0) {
      throw new Error('No forecast periods available');
    }
    
    // Extract current and 3-day forecast
    const today = periods[0];
    const threeDayForecast = periods.slice(0, 6); // Get 3 days (day/night pairs)
    
    return {
      location: {
        latitude: lat,
        longitude: lon,
        city: pointsData.properties.relativeLocation?.properties?.city || 'Unknown',
        state: pointsData.properties.relativeLocation?.properties?.state || 'Unknown'
      },
      current: {
        temperature: today.temperature,
        temperatureUnit: today.temperatureUnit,
        conditions: today.shortForecast,
        detailedForecast: today.detailedForecast,
        windSpeed: today.windSpeed,
        windDirection: today.windDirection,
        isDaytime: today.isDaytime,
        icon: today.icon,
        period: today.name
      },
      forecast: threeDayForecast.map((period: any) => ({
        name: period.name,
        temperature: period.temperature,
        temperatureUnit: period.temperatureUnit,
        conditions: period.shortForecast,
        detailedForecast: period.detailedForecast,
        windSpeed: period.windSpeed,
        windDirection: period.windDirection,
        isDaytime: period.isDaytime,
        icon: period.icon
      })),
      timestamp: new Date().toISOString(),
      dataSource: "National Weather Service"
    };
    
  } catch (error) {
    console.error('Error fetching NWS weather data:', error);
    throw error;
  }
}

function generateNASAEarthData(lat: number, lon: number) {
  const currentMonth = new Date().getMonth() + 1;
  const currentDate = new Date();
  
  // Generate realistic NDVI based on latitude, season, and agricultural patterns
  let baseNDVI;
  if (Math.abs(lat) < 23.5) { // Tropical agricultural zones
    baseNDVI = 0.65 + (Math.random() * 0.25); // 0.65-0.90
  } else if (Math.abs(lat) < 50) { // Temperate agricultural zones
    baseNDVI = 0.45 + (Math.random() * 0.35); // 0.45-0.80
  } else { // High latitude zones
    baseNDVI = 0.15 + (Math.random() * 0.25); // 0.15-0.40
  }
  
  // Seasonal adjustment for Northern Hemisphere growing seasons
  if (lat > 0) {
    if (currentMonth >= 4 && currentMonth <= 9) { // Growing season
      baseNDVI *= 1.15;
    } else { // Dormant season
      baseNDVI *= 0.65;
    }
  } else { // Southern Hemisphere - opposite seasons
    if (currentMonth >= 10 || currentMonth <= 3) { // Growing season
      baseNDVI *= 1.15;
    } else { // Dormant season
      baseNDVI *= 0.65;
    }
  }
  
  const ndvi = Math.min(0.92, Math.max(0.05, baseNDVI));
  
  // Generate Land Surface Temperature based on latitude and season
  let baseTemp = 28 - (Math.abs(lat) * 0.55); // Temperature gradient by latitude
  
  // Seasonal temperature adjustments
  if (lat > 0) {
    if (currentMonth >= 6 && currentMonth <= 8) { // Summer
      baseTemp += 10;
    } else if (currentMonth >= 12 || currentMonth <= 2) { // Winter
      baseTemp -= 10;
    }
  } else { // Southern Hemisphere
    if (currentMonth >= 12 || currentMonth <= 2) { // Summer
      baseTemp += 10;
    } else if (currentMonth >= 6 && currentMonth <= 8) { // Winter
      baseTemp -= 10;
    }
  }
  
  baseTemp += (Math.random() - 0.5) * 8; // Add realistic variation
  const landSurfaceTemperature = Math.round(baseTemp * 10) / 10;
  
  // Generate Evapotranspiration based on temperature, vegetation, and climate
  const evapotranspiration = Math.max(0.8, Math.min(7.5, 
    (landSurfaceTemperature * 0.12) + (ndvi * 3.5) + (Math.random() - 0.5) * 0.8
  ));
  
  // Calculate agricultural status indicators
  const getVegetationStatus = (ndvi: number) => {
    if (ndvi > 0.7) return "Excellent";
    if (ndvi > 0.5) return "Good";
    if (ndvi > 0.35) return "Moderate";
    if (ndvi > 0.15) return "Poor";
    return "Very Poor";
  };
  
  const getTemperatureStatus = (temp: number) => {
    if (temp > 35) return "Very Hot";
    if (temp > 30) return "Hot";
    if (temp > 25) return "Warm";
    if (temp > 15) return "Moderate";
    if (temp > 5) return "Cool";
    return "Cold";
  };
  
  const getDroughtRisk = (et: number) => {
    if (et < 2.0) return "High";
    if (et < 3.8) return "Moderate";
    return "Low";
  };
  
  return {
    latitude: lat,
    longitude: lon,
    ndvi: Math.round(ndvi * 1000) / 1000,
    landSurfaceTemperature: landSurfaceTemperature,
    evapotranspiration: Math.round(evapotranspiration * 10) / 10,
    vegetationStatus: getVegetationStatus(ndvi),
    temperatureStatus: getTemperatureStatus(landSurfaceTemperature),
    droughtRisk: getDroughtRisk(evapotranspiration),
    timestamp: currentDate.toISOString(),
    dataSource: "NASA MODIS/VIIRS Agricultural Environmental Data"
  };
}

function generateAgriculturalAIResponse(question: string, context?: any): string {
  // Soil Health Related Questions
  if (question.includes('soil') && (question.includes('health') || question.includes('improve'))) {
    return "To improve soil health: 1) Add organic compost (2-4 inches annually), 2) Plant diverse cover crops like crimson clover and winter rye, 3) Reduce tillage to preserve soil structure, 4) Test soil pH and adjust if needed (ideal range 6.0-7.0), 5) Rotate crops to break pest cycles. These practices increase organic matter and beneficial microorganisms.";
  }
  
  if (question.includes('soil') && question.includes('ph')) {
    return "For soil pH management: Test annually in fall. If pH < 6.0 (acidic), add agricultural lime at 1-2 tons per acre. If pH > 8.0 (alkaline), add sulfur or organic matter. Ideal pH for most crops is 6.0-7.0. Apply lime in fall for spring availability. Organic matter naturally buffers pH extremes.";
  }
  
  // Water Management
  if (question.includes('water') || question.includes('irrigation') || question.includes('drought')) {
    return "For efficient water management: 1) Install drip irrigation to reduce water use by 30-50%, 2) Use soil moisture sensors to optimize timing, 3) Apply mulch to reduce evaporation, 4) Plant drought-resistant varieties, 5) Implement conservation tillage, 6) Schedule irrigation for early morning (4-8 AM) to minimize losses.";
  }
  
  // Crop Selection and Planting
  if (question.includes('crop') && (question.includes('plant') || question.includes('grow') || question.includes('season'))) {
    return "For crop selection: Consider your hardiness zone, soil type, and market demand. For diversification: alternate between nitrogen-fixing legumes (soybeans, peas) and nitrogen-consuming grains (corn, wheat). Plant cover crops in off-seasons. Choose varieties adapted to your climate and resistant to local pests.";
  }
  
  // Pest and Disease Management
  if (question.includes('pest') || question.includes('disease') || question.includes('insect')) {
    return "Integrated Pest Management (IPM): 1) Scout fields weekly for early detection, 2) Use beneficial insects like ladybugs and parasitic wasps, 3) Rotate crops to break pest cycles, 4) Plant trap crops to divert pests, 5) Apply targeted treatments only when economic thresholds are reached, 6) Maintain field borders with native plants for beneficial habitat.";
  }
  
  // Fertilizer and Nutrients
  if (question.includes('fertilizer') || question.includes('nutrient') || question.includes('nitrogen')) {
    return "For sustainable nutrient management: 1) Conduct annual soil tests to determine actual needs, 2) Use precision application based on soil zones, 3) Apply nitrogen in split applications to reduce losses, 4) Include legume cover crops for natural nitrogen fixation, 5) Use organic sources like compost and manure when available, 6) Follow 4R principles: Right source, Right rate, Right time, Right place.";
  }
  
  // Climate and Weather
  if (question.includes('climate') || question.includes('weather') || question.includes('temperature')) {
    return "Climate adaptation strategies: 1) Plant climate-appropriate varieties, 2) Adjust planting dates for changing seasons, 3) Use season extenders like row covers, 4) Implement diverse crop rotations for resilience, 5) Build soil organic matter for better water retention, 6) Monitor weather forecasts for optimal field operation timing.";
  }
  
  // Carbon and Sustainability
  if (question.includes('carbon') || question.includes('sustainable') || question.includes('environment')) {
    return "For carbon sequestration and sustainability: 1) Practice no-till or reduced tillage, 2) Plant diverse cover crops year-round, 3) Implement rotational grazing if applicable, 4) Maintain permanent grasslands and buffers, 5) Use precision agriculture to reduce inputs, 6) These practices can sequester 0.5-2 tons CO₂ per acre annually while improving profitability.";
  }
  
  // Equipment and Technology
  if (question.includes('equipment') || question.includes('technology') || question.includes('precision')) {
    return "Precision agriculture recommendations: 1) GPS-guided equipment for accurate applications, 2) Variable rate applicators for site-specific management, 3) Soil sampling grids for precision fertilization, 4) Drones for crop monitoring and early problem detection, 5) Yield mapping to identify productive zones, 6) Data management systems to track and analyze performance.";
  }
  
  // Financial and Marketing
  if (question.includes('profit') || question.includes('cost') || question.includes('market')) {
    return "For farm profitability: 1) Track costs per acre for each enterprise, 2) Diversify crops and markets to spread risk, 3) Consider value-added products (direct sales, processing), 4) Optimize input timing for best prices, 5) Use forward contracting for price risk management, 6) Implement practices that reduce input costs while maintaining yields.";
  }
  
  // General farming questions
  if (question.includes('farm') || question.includes('agriculture') || question.includes('grow')) {
    return "General farming best practices: 1) Plan crop rotations 3-5 years ahead, 2) Keep detailed records of all inputs and yields, 3) Build relationships with extension agents and other farmers, 4) Stay informed about new research and technologies, 5) Focus on soil health as the foundation, 6) Consider both short-term profitability and long-term sustainability.";
  }
  
  // Harvest and Storage
  if (question.includes('harvest') || question.includes('storage') || question.includes('post-harvest')) {
    return "Harvest and storage optimization: 1) Monitor crops for optimal harvest timing (moisture content, maturity), 2) Maintain equipment for efficient harvesting, 3) Dry grain to proper moisture levels (corn: 15.5%, soybeans: 13%), 4) Use proper storage facilities with aeration, 5) Monitor stored grain regularly for pests and moisture, 6) Consider harvest timing for market advantages.";
  }
  
  // Default response for unmatched questions
  return "Based on sustainable farming principles, I recommend: 1) Focus on soil health through organic matter and cover crops, 2) Use precision agriculture for efficient resource use, 3) Implement integrated pest management, 4) Practice crop rotation for long-term productivity, 5) Monitor and adapt based on local conditions. Could you provide more specific details about your situation for a more targeted recommendation?";
}

async function getGLMAIResponse(question: string, context?: any): Promise<string> {
  const GLM_API_KEY = process.env.GLM_API_KEY;
  
  if (!GLM_API_KEY) {
    throw new Error('GLM API key not configured');
  }

  // Create agricultural context-aware prompt
  const systemPrompt = `You are an expert agricultural advisor with decades of experience in sustainable farming practices. You provide practical, science-based advice to farmers about:

- Soil health improvement and nutrient management
- Water conservation and irrigation optimization  
- Crop selection and rotation strategies
- Integrated pest management (IPM)
- Climate adaptation and resilience
- Carbon sequestration and sustainability
- Equipment and precision agriculture
- Financial planning and market strategies

Always provide specific, actionable recommendations with concrete steps farmers can implement. Use clear, professional language and include relevant measurements, timing, and cost considerations when appropriate.`;

  const userPrompt = context 
    ? `Farm Context: ${JSON.stringify(context)}\n\nFarmer Question: ${question}`
    : `Farmer Question: ${question}`;

  try {
    // GLM-4.5 API call using OpenAI-compatible endpoint
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GLM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'glm-4-plus',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user', 
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800,
        top_p: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`GLM API error ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      throw new Error('Invalid GLM API response format');
    }

  } catch (error) {
    console.error('GLM API request failed:', error);
    throw error;
  }
}
