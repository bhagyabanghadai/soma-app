package com.soma.dto;

import com.soma.model.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserProfileDto {
    private Long id;
    private String name;
    private String email;
    private User.Role role;
    private LocalDateTime createdAt;
}