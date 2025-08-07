package com.soma.controller;

import com.soma.dto.SustainabilityMetricsDto;
import com.soma.model.SustainabilityMetrics;
import com.soma.service.SustainabilityMetricsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/metrics")
@RequiredArgsConstructor
@Tag(name = "Sustainability Metrics", description = "Sustainability metrics management")
public class MetricsController {
    
    private final SustainabilityMetricsService metricsService;
    
    @PostMapping("/submit")
    @Operation(summary = "Submit sustainability metrics")
    public ResponseEntity<SustainabilityMetrics> submitMetrics(@Valid @RequestBody SustainabilityMetricsDto metricsDto) {
        SustainabilityMetrics metrics = metricsService.submitMetrics(metricsDto);
        return ResponseEntity.ok(metrics);
    }
    
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get metrics for a specific user")
    public ResponseEntity<List<SustainabilityMetrics>> getUserMetrics(@PathVariable Long userId) {
        List<SustainabilityMetrics> metrics = metricsService.getUserMetrics(userId);
        return ResponseEntity.ok(metrics);
    }
    
    @GetMapping("/summary")
    @Operation(summary = "Get overall metrics summary")
    public ResponseEntity<Map<String, Object>> getMetricsSummary() {
        Map<String, Object> summary = metricsService.getMetricsSummary();
        return ResponseEntity.ok(summary);
    }
    
    @GetMapping("/summary/user/{userId}")
    @Operation(summary = "Get user-specific metrics summary")
    public ResponseEntity<Map<String, Object>> getUserMetricsSummary(@PathVariable Long userId) {
        Map<String, Object> summary = metricsService.getUserMetricsSummary(userId);
        return ResponseEntity.ok(summary);
    }
}