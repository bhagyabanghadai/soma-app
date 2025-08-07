package com.soma.service;

import com.soma.dto.AiChatRequestDto;
import com.soma.dto.AiChatResponseDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AiChatServiceTest {
    
    private AiChatService aiChatService;
    
    @BeforeEach
    void setUp() {
        aiChatService = new AiChatService();
    }
    
    @Test
    void testGetChatResponseWithSoilKeyword() {
        // Arrange
        AiChatRequestDto request = new AiChatRequestDto();
        request.setQuestion("How can I improve my soil health?");
        
        // Act
        AiChatResponseDto response = aiChatService.getChatResponse(request);
        
        // Assert
        assertNotNull(response);
        assertNotNull(response.getResponse());
        assertNotNull(response.getTimestamp());
        assertTrue(response.getResponse().contains("soil"));
    }
    
    @Test
    void testGetChatResponseWithWaterKeyword() {
        // Arrange
        AiChatRequestDto request = new AiChatRequestDto();
        request.setQuestion("What are the best water conservation practices?");
        
        // Act
        AiChatResponseDto response = aiChatService.getChatResponse(request);
        
        // Assert
        assertNotNull(response);
        assertNotNull(response.getResponse());
        assertNotNull(response.getTimestamp());
        assertTrue(response.getResponse().contains("water") || response.getResponse().contains("irrigation"));
    }
    
    @Test
    void testGetChatResponseWithUnknownKeyword() {
        // Arrange
        AiChatRequestDto request = new AiChatRequestDto();
        request.setQuestion("Tell me about quantum physics");
        
        // Act
        AiChatResponseDto response = aiChatService.getChatResponse(request);
        
        // Assert
        assertNotNull(response);
        assertNotNull(response.getResponse());
        assertNotNull(response.getTimestamp());
        assertTrue(response.getResponse().contains("agricultural") || 
                  response.getResponse().contains("farming") ||
                  response.getResponse().contains("sustainable"));
    }
}