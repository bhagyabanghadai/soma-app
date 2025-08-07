package com.soma.service;

import com.soma.dto.UserProfileDto;
import com.soma.dto.UserRegistrationDto;
import com.soma.exception.ResourceNotFoundException;
import com.soma.exception.UserAlreadyExistsException;
import com.soma.model.User;
import com.soma.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService implements UserDetailsService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
    
    public UserProfileDto registerUser(UserRegistrationDto registrationDto) {
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new UserAlreadyExistsException("User already exists with email: " + registrationDto.getEmail());
        }
        
        User user = new User();
        user.setName(registrationDto.getName());
        user.setEmail(registrationDto.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user.setRole(User.Role.ROLE_USER);
        
        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser, UserProfileDto.class);
    }
    
    public UserProfileDto getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return modelMapper.map(user, UserProfileDto.class);
    }
    
    public UserProfileDto updateUserProfile(String email, UserRegistrationDto updateDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        if (!email.equals(updateDto.getEmail()) && userRepository.existsByEmail(updateDto.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists: " + updateDto.getEmail());
        }
        
        user.setName(updateDto.getName());
        user.setEmail(updateDto.getEmail());
        if (updateDto.getPassword() != null && !updateDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updateDto.getPassword()));
        }
        
        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser, UserProfileDto.class);
    }
    
    @Transactional(readOnly = true)
    public List<UserProfileDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> modelMapper.map(user, UserProfileDto.class))
                .toList();
    }
    
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        userRepository.deleteById(userId);
    }
}