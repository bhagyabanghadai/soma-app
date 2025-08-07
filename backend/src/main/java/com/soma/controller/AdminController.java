package com.soma.controller;

import com.soma.dto.UserProfileDto;
import com.soma.service.SustainabilityMetricsService;
import com.soma.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Administrative endpoints")
public class AdminController {
    
    private final UserService userService;
    private final SustainabilityMetricsService metricsService;
    
    @GetMapping("/users")
    @Operation(summary = "Get all users (Admin only)")
    public ResponseEntity<List<UserProfileDto>> getAllUsers() {
        List<UserProfileDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/metrics")
    @Operation(summary = "Get all metrics summary (Admin only)")
    public ResponseEntity<Map<String, Object>> getAllMetrics() {
        Map<String, Object> metrics = metricsService.getMetricsSummary();
        return ResponseEntity.ok(metrics);
    }
    
    @DeleteMapping("/user/{userId}")
    @Operation(summary = "Delete user (Admin only)")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}