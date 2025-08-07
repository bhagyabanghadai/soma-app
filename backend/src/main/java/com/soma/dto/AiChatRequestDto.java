package com.soma.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AiChatRequestDto {
    
    @NotBlank(message = "Question is required")
    private String question;
}