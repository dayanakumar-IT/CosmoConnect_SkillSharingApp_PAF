package com.example.cosmoconnect.service;

import com.example.cosmoconnect.config.JwtTokenProvider;
import com.example.cosmoconnect.dto.AuthRequest;
import com.example.cosmoconnect.dto.AuthResponse;
import com.example.cosmoconnect.dto.RegistrationRequest;
import com.example.cosmoconnect.dto.UserDto;
import com.example.cosmoconnect.exception.BadRequestException;
import com.example.cosmoconnect.model.AuthProvider;
import com.example.cosmoconnect.model.User;
import com.example.cosmoconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthResponse registerUser(RegistrationRequest registrationRequest) {
        // Check if passwords match
        if (!registrationRequest.getPassword().equals(registrationRequest.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        // Check if email exists
        if (userRepository.existsByEmail(registrationRequest.getEmail())) {
            throw new BadRequestException("Email is already in use");
        }

        // Create new user
        User user = User.builder()
                .fullName(registrationRequest.getFullName())
                .email(registrationRequest.getEmail())
                .password(passwordEncoder.encode(registrationRequest.getPassword()))
                .provider(AuthProvider.local)
                .roles(Collections.singleton("ROLE_USER"))
                .build();

        // Save user to database
        User savedUser = userRepository.save(user);

        // Skip authentication and generate token directly
        String token = tokenProvider.generateTokenFromEmail(
                savedUser.getEmail(),
                savedUser.getAuthorities()
        );

        // Return response with token and user data
        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .user(mapToUserDto(savedUser))
                .build();
    }

    public AuthResponse authenticateUser(AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .user(mapToUserDto(user))
                .build();
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .imageUrl(user.getImageUrl())
                .emailVerified(user.isEmailVerified())
                .roles(user.getRoles())
                .provider(user.getProvider())
                .build();
    }
}