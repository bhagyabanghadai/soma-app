package com.soma.service;

import com.soma.dto.AuthResponseDto;
import com.soma.dto.UserLoginDto;
import com.soma.dto.UserProfileDto;
import com.soma.dto.UserRegistrationDto;
import com.soma.model.User;
import com.soma.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    
    @Mock
    private AuthenticationManager authenticationManager;
    
    @Mock
    private UserService userService;
    
    @Mock
    private JwtUtil jwtUtil;
    
    @InjectMocks
    private AuthService authService;
    
    private UserRegistrationDto registrationDto;
    private UserLoginDto loginDto;
    private UserProfileDto userProfile;
    private User user;
    
    @BeforeEach
    void setUp() {
        registrationDto = new UserRegistrationDto();
        registrationDto.setName("Test User");
        registrationDto.setEmail("test@example.com");
        registrationDto.setPassword("password123");
        
        loginDto = new UserLoginDto();
        loginDto.setEmail("test@example.com");
        loginDto.setPassword("password123");
        
        userProfile = new UserProfileDto();
        userProfile.setId(1L);
        userProfile.setName("Test User");
        userProfile.setEmail("test@example.com");
        userProfile.setRole(User.Role.ROLE_USER);
        
        user = new User();
        user.setId(1L);
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setPassword("hashedPassword");
        user.setRole(User.Role.ROLE_USER);
    }
    
    @Test
    void testRegister() {
        // Arrange
        when(userService.registerUser(registrationDto)).thenReturn(userProfile);
        when(userService.loadUserByUsername(userProfile.getEmail())).thenReturn(user);
        when(jwtUtil.generateToken(user)).thenReturn("test-token");
        
        // Act
        AuthResponseDto result = authService.register(registrationDto);
        
        // Assert
        assertNotNull(result);
        assertEquals("test-token", result.getToken());
        assertEquals("Bearer", result.getType());
        assertEquals(userProfile, result.getUser());
        
        verify(userService).registerUser(registrationDto);
        verify(userService).loadUserByUsername(userProfile.getEmail());
        verify(jwtUtil).generateToken(user);
    }
    
    @Test
    void testLogin() {
        // Arrange
        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(user);
        when(jwtUtil.generateToken(user)).thenReturn("test-token");
        when(userService.getUserProfile(user.getUsername())).thenReturn(userProfile);
        
        // Act
        AuthResponseDto result = authService.login(loginDto);
        
        // Assert
        assertNotNull(result);
        assertEquals("test-token", result.getToken());
        assertEquals("Bearer", result.getType());
        assertEquals(userProfile, result.getUser());
        
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtUtil).generateToken(user);
        verify(userService).getUserProfile(user.getUsername());
    }
}