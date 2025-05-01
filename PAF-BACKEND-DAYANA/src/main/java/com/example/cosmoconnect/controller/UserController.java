package com.example.cosmoconnect.controller;

import com.example.cosmoconnect.dto.UserDto;
import com.example.cosmoconnect.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("Attempt to access current user without authentication");
            throw new AccessDeniedException("User not authenticated");
        }

        log.info("Retrieving current user: {}", authentication.getName());
        UserDto currentUser = userService.getCurrentUser();
        log.info("Current user retrieved successfully: {}", currentUser.getEmail());

        return ResponseEntity.ok(currentUser);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserDto> getUserById(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        log.info("Attempt to retrieve user by ID: {} by user: {}",
                id,
                authentication != null ? authentication.getName() : "Unknown");

        UserDto user = userService.getUserById(id);

        log.info("User retrieved successfully: {}", user.getEmail());
        return ResponseEntity.ok(user);
    }
}