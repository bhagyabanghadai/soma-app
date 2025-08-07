package com.soma.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SustainabilityMetricsDto {
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    private Double carbonUsage;
    
    private Double waterUsage;
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    private String aiInsights;
}