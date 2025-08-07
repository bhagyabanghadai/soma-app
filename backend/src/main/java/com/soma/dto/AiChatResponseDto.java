package com.soma.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AiChatResponseDto {
    private String response;
    private String timestamp;
}