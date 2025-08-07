package com.soma.repository;

import com.soma.model.SustainabilityMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SustainabilityMetricsRepository extends JpaRepository<SustainabilityMetrics, Long> {
    
    List<SustainabilityMetrics> findByUserIdOrderByDateDesc(Long userId);
    
    @Query("SELECT sm FROM SustainabilityMetrics sm WHERE sm.userId = :userId AND sm.date BETWEEN :startDate AND :endDate ORDER BY sm.date DESC")
    List<SustainabilityMetrics> findByUserIdAndDateBetween(
        @Param("userId") Long userId, 
        @Param("startDate") LocalDate startDate, 
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT AVG(sm.carbonUsage) FROM SustainabilityMetrics sm WHERE sm.userId = :userId")
    Double getAverageCarbonUsageByUserId(@Param("userId") Long userId);
    
    @Query("SELECT AVG(sm.waterUsage) FROM SustainabilityMetrics sm WHERE sm.userId = :userId")
    Double getAverageWaterUsageByUserId(@Param("userId") Long userId);
}