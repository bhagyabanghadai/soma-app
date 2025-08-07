package com.soma.service;

import com.soma.dto.AiChatRequestDto;
import com.soma.dto.AiChatResponseDto;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class AiChatService {
    
    private final Map<String, String> responses = new HashMap<>();
    private final Random random = new Random();
    
    public AiChatService() {
        initializeResponses();
    }
    
    public AiChatResponseDto getChatResponse(AiChatRequestDto request) {
        String question = request.getQuestion().toLowerCase();
        String response = findBestResponse(question);
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        
        return new AiChatResponseDto(response, timestamp);
    }
    
    private String findBestResponse(String question) {
        // Check for keyword matches
        for (Map.Entry<String, String> entry : responses.entrySet()) {
            if (question.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        
        // Default responses if no keyword match
        String[] defaultResponses = {
            "Based on current agricultural best practices, I recommend focusing on soil health and water conservation for sustainable farming.",
            "For optimal crop yield, consider implementing precision agriculture techniques and monitoring soil moisture levels regularly.",
            "Sustainable farming practices include crop rotation, cover cropping, and reduced tillage to maintain soil health.",
            "To improve your farm's sustainability, focus on reducing chemical inputs and increasing organic matter in your soil."
        };
        
        return defaultResponses[random.nextInt(defaultResponses.length)];
    }
    
    private void initializeResponses() {
        responses.put("soil", "For optimal soil health, I recommend regular soil testing, adding organic compost, and implementing cover crops during off-seasons. This will improve soil structure and nutrient retention.");
        responses.put("water", "Water conservation is crucial for sustainable farming. Consider drip irrigation systems, mulching, and rainwater harvesting to optimize water usage and reduce waste.");
        responses.put("carbon", "To reduce your carbon footprint, focus on no-till farming, cover crops, agroforestry, and reducing synthetic fertilizer use. These practices sequester carbon while improving soil health.");
        responses.put("crop rotation", "Crop rotation is essential for breaking pest cycles and maintaining soil fertility. Rotate between nitrogen-fixing legumes and nutrient-demanding crops for best results.");
        responses.put("pest", "Integrated Pest Management (IPM) combines biological, cultural, and chemical controls. Use beneficial insects, crop rotation, and targeted pesticide application only when necessary.");
        responses.put("fertilizer", "Reduce synthetic fertilizer use by implementing precision agriculture, using organic compost, and planting nitrogen-fixing cover crops. Soil testing will help optimize application rates.");
        responses.put("yield", "To improve crop yields sustainably, focus on soil health, proper irrigation, crop selection suited to your climate, and integrated nutrient management.");
        responses.put("organic", "Transitioning to organic farming requires 3-year certification period. Focus on building soil health, using approved inputs, and implementing natural pest control methods.");
        responses.put("climate", "Climate-smart agriculture includes drought-resistant varieties, improved water management, carbon sequestration practices, and diversified cropping systems.");
        responses.put("regenerative", "Regenerative agriculture practices include no-till farming, diverse cover crops, integrated livestock grazing, and reducing external inputs to restore ecosystem health.");
    }
}