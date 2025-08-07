package com.soma.controller;

import com.soma.dto.AiChatRequestDto;
import com.soma.dto.AiChatResponseDto;
import com.soma.service.AiChatService;
import com.soma.service.SustainabilityMetricsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
@Tag(name = "AI Assistant", description = "AI-powered farming assistance")
public class AiController {
    
    private final AiChatService aiChatService;
    private final SustainabilityMetricsService metricsService;
    
    @PostMapping("/chat")
    @Operation(summary = "Chat with AI assistant")
    public ResponseEntity<AiChatResponseDto> chat(@Valid @RequestBody AiChatRequestDto request) {
        AiChatResponseDto response = aiChatService.getChatResponse(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/recommendations")
    @Operation(summary = "Get AI recommendations based on user metrics")
    public ResponseEntity<Map<String, Object>> getRecommendations(@RequestParam Long userId) {
        Map<String, Object> recommendations = metricsService.getUserMetricsSummary(userId);
        return ResponseEntity.ok(recommendations);
    }
}