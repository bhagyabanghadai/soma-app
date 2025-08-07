package com.soma.controller;

import com.soma.dto.AuthResponseDto;
import com.soma.dto.UserLoginDto;
import com.soma.dto.UserProfileDto;
import com.soma.dto.UserRegistrationDto;
import com.soma.service.AuthService;
import com.soma.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User authentication endpoints")
public class AuthController {
    
    private final AuthService authService;
    private final UserService userService;
    
    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody UserRegistrationDto registrationDto) {
        AuthResponseDto response = authService.register(registrationDto);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    @Operation(summary = "Login user")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody UserLoginDto loginDto) {
        AuthResponseDto response = authService.login(loginDto);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/profile")
    @Operation(summary = "Get user profile")
    public ResponseEntity<UserProfileDto> getProfile(Authentication authentication) {
        UserProfileDto profile = userService.getUserProfile(authentication.getName());
        return ResponseEntity.ok(profile);
    }
    
    @PutMapping("/profile")
    @Operation(summary = "Update user profile")
    public ResponseEntity<UserProfileDto> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UserRegistrationDto updateDto
    ) {
        UserProfileDto updatedProfile = userService.updateUserProfile(authentication.getName(), updateDto);
        return ResponseEntity.ok(updatedProfile);
    }
}