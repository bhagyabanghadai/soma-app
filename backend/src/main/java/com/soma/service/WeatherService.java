package com.soma.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class WeatherService {
    
    private final Random random = new Random();
    
    public Map<String, Object> getCurrentWeather(String location) {
        // Mock weather data - in production this would call OpenWeatherMap API
        Map<String, Object> weather = new HashMap<>();
        
        weather.put("location", location);
        weather.put("temperature", 20 + random.nextInt(15)); // 20-35°C
        weather.put("humidity", 40 + random.nextInt(40)); // 40-80%
        weather.put("precipitation", random.nextDouble() * 10); // 0-10mm
        weather.put("windSpeed", 5 + random.nextInt(15)); // 5-20 km/h
        weather.put("condition", getRandomCondition());
        weather.put("uvIndex", random.nextInt(11)); // 0-10
        weather.put("visibility", 5 + random.nextInt(15)); // 5-20 km
        
        // Agricultural specific data
        weather.put("soilMoisture", 30 + random.nextInt(40)); // 30-70%
        weather.put("growingDegreeDays", 10 + random.nextInt(20)); // 10-30
        weather.put("recommendation", generateRecommendation(weather));
        
        return weather;
    }
    
    private String getRandomCondition() {
        String[] conditions = {"Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Overcast"};
        return conditions[random.nextInt(conditions.length)];
    }
    
    private String generateRecommendation(Map<String, Object> weather) {
        int temperature = (Integer) weather.get("temperature");
        int humidity = (Integer) weather.get("humidity");
        String condition = (String) weather.get("condition");
        
        if (temperature > 30 && humidity < 50) {
            return "High temperature and low humidity detected. Consider increasing irrigation frequency.";
        } else if ("Rainy".equals(condition)) {
            return "Rainfall expected. Good time to reduce irrigation and check for proper drainage.";
        } else if (temperature < 15) {
            return "Cool temperatures detected. Consider protecting sensitive crops and adjusting planting schedules.";
        } else {
            return "Weather conditions are favorable for most farming activities.";
        }
    }
}