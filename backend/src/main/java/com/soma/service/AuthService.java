package com.soma.service;

import com.soma.dto.AuthResponseDto;
import com.soma.dto.UserLoginDto;
import com.soma.dto.UserProfileDto;
import com.soma.dto.UserRegistrationDto;
import com.soma.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    
    public AuthResponseDto register(UserRegistrationDto registrationDto) {
        UserProfileDto user = userService.registerUser(registrationDto);
        UserDetails userDetails = userService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        
        return new AuthResponseDto(token, user);
    }
    
    public AuthResponseDto login(UserLoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getEmail(),
                        loginDto.getPassword()
                )
        );
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);
        UserProfileDto user = userService.getUserProfile(userDetails.getUsername());
        
        return new AuthResponseDto(token, user);
    }
}