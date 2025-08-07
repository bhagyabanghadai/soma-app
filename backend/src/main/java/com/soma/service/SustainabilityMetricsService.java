package com.soma.service;

import com.soma.dto.SustainabilityMetricsDto;
import com.soma.exception.ResourceNotFoundException;
import com.soma.model.SustainabilityMetrics;
import com.soma.repository.SustainabilityMetricsRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class SustainabilityMetricsService {
    
    private final SustainabilityMetricsRepository metricsRepository;
    private final ModelMapper modelMapper;
    
    public SustainabilityMetrics submitMetrics(SustainabilityMetricsDto metricsDto) {
        SustainabilityMetrics metrics = modelMapper.map(metricsDto, SustainabilityMetrics.class);
        return metricsRepository.save(metrics);
    }
    
    @Transactional(readOnly = true)
    public List<SustainabilityMetrics> getUserMetrics(Long userId) {
        return metricsRepository.findByUserIdOrderByDateDesc(userId);
    }
    
    @Transactional(readOnly = true)
    public List<SustainabilityMetrics> getUserMetricsByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return metricsRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
    }
    
    @Transactional(readOnly = true)
    public Map<String, Object> getMetricsSummary() {
        List<SustainabilityMetrics> allMetrics = metricsRepository.findAll();
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalRecords", allMetrics.size());
        
        if (!allMetrics.isEmpty()) {
            double avgCarbonUsage = allMetrics.stream()
                    .filter(m -> m.getCarbonUsage() != null)
                    .mapToDouble(SustainabilityMetrics::getCarbonUsage)
                    .average()
                    .orElse(0.0);
                    
            double avgWaterUsage = allMetrics.stream()
                    .filter(m -> m.getWaterUsage() != null)
                    .mapToDouble(SustainabilityMetrics::getWaterUsage)
                    .average()
                    .orElse(0.0);
            
            summary.put("averageCarbonUsage", avgCarbonUsage);
            summary.put("averageWaterUsage", avgWaterUsage);
        } else {
            summary.put("averageCarbonUsage", 0.0);
            summary.put("averageWaterUsage", 0.0);
        }
        
        return summary;
    }
    
    @Transactional(readOnly = true)
    public Map<String, Object> getUserMetricsSummary(Long userId) {
        List<SustainabilityMetrics> userMetrics = metricsRepository.findByUserIdOrderByDateDesc(userId);
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalRecords", userMetrics.size());
        
        if (!userMetrics.isEmpty()) {
            Double avgCarbonUsage = metricsRepository.getAverageCarbonUsageByUserId(userId);
            Double avgWaterUsage = metricsRepository.getAverageWaterUsageByUserId(userId);
            
            summary.put("averageCarbonUsage", avgCarbonUsage != null ? avgCarbonUsage : 0.0);
            summary.put("averageWaterUsage", avgWaterUsage != null ? avgWaterUsage : 0.0);
            summary.put("latestMetrics", userMetrics.get(0));
        } else {
            summary.put("averageCarbonUsage", 0.0);
            summary.put("averageWaterUsage", 0.0);
            summary.put("latestMetrics", null);
        }
        
        return summary;
    }
}