package com.example.cosmoconnect.controller;

import com.example.cosmoconnect.dto.AuthRequest;
import com.example.cosmoconnect.dto.AuthResponse;
import com.example.cosmoconnect.dto.RegistrationRequest;
import com.example.cosmoconnect.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody RegistrationRequest registrationRequest) {
        log.info("Registration attempt for email: {}", registrationRequest.getEmail());
        try {
            AuthResponse response = authService.registerUser(registrationRequest);
            log.info("User registered successfully: {}", registrationRequest.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Registration error for email: {}", registrationRequest.getEmail(), e);
            throw e;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@Valid @RequestBody AuthRequest loginRequest) {
        log.info("Login attempt for email: {}", loginRequest.getEmail());
        try {
            AuthResponse response = authService.authenticateUser(loginRequest);
            log.info("User logged in successfully: {}", loginRequest.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login error for email: {}", loginRequest.getEmail(), e);
            throw e;
        }
    }

    // Exception handler for validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        log.warn("Validation errors: {}", errors);
        return ResponseEntity.badRequest().body(errors);
    }
}