package com.soma.controller;

import com.soma.service.WeatherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/weather")
@RequiredArgsConstructor
@Tag(name = "Weather", description = "Weather information endpoints")
public class WeatherController {
    
    private final WeatherService weatherService;
    
    @GetMapping("/current")
    @Operation(summary = "Get current weather for a location")
    public ResponseEntity<Map<String, Object>> getCurrentWeather(@RequestParam String location) {
        Map<String, Object> weather = weatherService.getCurrentWeather(location);
        return ResponseEntity.ok(weather);
    }
}