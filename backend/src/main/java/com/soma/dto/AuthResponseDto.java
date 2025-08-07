package com.soma.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDto {
    private String token;
    private String type = "Bearer";
    private UserProfileDto user;
    
    public AuthResponseDto(String token, UserProfileDto user) {
        this.token = token;
        this.user = user;
    }
}