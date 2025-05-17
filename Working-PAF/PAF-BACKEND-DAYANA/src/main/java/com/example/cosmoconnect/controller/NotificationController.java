package com.example.cosmoconnect.controller;

import com.example.cosmoconnect.model.Notification;
import com.example.cosmoconnect.service.NotificationService;
import com.example.cosmoconnect.repository.UserRepository;
import com.example.cosmoconnect.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println("[NotificationController] Fetching notifications for user: " + email + " (id: " + user.getId() + ")");
        List<Notification> notifications = notificationService.getNotificationsForUser(user.getId());
        System.out.println("[NotificationController] Found notifications: " + notifications.size());
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/mark-read/{id}")
    public ResponseEntity<Void> markAsRead(@PathVariable String id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
} 