package com.soma.service;

import com.soma.dto.SustainabilityMetricsDto;
import com.soma.model.SustainabilityMetrics;
import com.soma.repository.SustainabilityMetricsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SustainabilityMetricsServiceTest {
    
    @Mock
    private SustainabilityMetricsRepository metricsRepository;
    
    @Mock
    private ModelMapper modelMapper;
    
    @InjectMocks
    private SustainabilityMetricsService metricsService;
    
    private SustainabilityMetricsDto metricsDto;
    private SustainabilityMetrics metrics;
    
    @BeforeEach
    void setUp() {
        metricsDto = new SustainabilityMetricsDto();
        metricsDto.setUserId(1L);
        metricsDto.setCarbonUsage(100.0);
        metricsDto.setWaterUsage(500.0);
        metricsDto.setDate(LocalDate.now());
        metricsDto.setAiInsights("Test insights");
        
        metrics = new SustainabilityMetrics();
        metrics.setId(1L);
        metrics.setUserId(1L);
        metrics.setCarbonUsage(100.0);
        metrics.setWaterUsage(500.0);
        metrics.setDate(LocalDate.now());
        metrics.setAiInsights("Test insights");
    }
    
    @Test
    void testSubmitMetrics() {
        // Arrange
        when(modelMapper.map(metricsDto, SustainabilityMetrics.class)).thenReturn(metrics);
        when(metricsRepository.save(any(SustainabilityMetrics.class))).thenReturn(metrics);
        
        // Act
        SustainabilityMetrics result = metricsService.submitMetrics(metricsDto);
        
        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(1L, result.getUserId());
        assertEquals(100.0, result.getCarbonUsage());
        assertEquals(500.0, result.getWaterUsage());
        
        verify(modelMapper).map(metricsDto, SustainabilityMetrics.class);
        verify(metricsRepository).save(any(SustainabilityMetrics.class));
    }
    
    @Test
    void testGetUserMetrics() {
        // Arrange
        List<SustainabilityMetrics> metricsList = Arrays.asList(metrics);
        when(metricsRepository.findByUserIdOrderByDateDesc(1L)).thenReturn(metricsList);
        
        // Act
        List<SustainabilityMetrics> result = metricsService.getUserMetrics(1L);
        
        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(metrics, result.get(0));
        
        verify(metricsRepository).findByUserIdOrderByDateDesc(1L);
    }
    
    @Test
    void testGetMetricsSummary() {
        // Arrange
        List<SustainabilityMetrics> allMetrics = Arrays.asList(metrics);
        when(metricsRepository.findAll()).thenReturn(allMetrics);
        
        // Act
        Map<String, Object> result = metricsService.getMetricsSummary();
        
        // Assert
        assertNotNull(result);
        assertEquals(1, result.get("totalRecords"));
        assertEquals(100.0, result.get("averageCarbonUsage"));
        assertEquals(500.0, result.get("averageWaterUsage"));
        
        verify(metricsRepository).findAll();
    }
}