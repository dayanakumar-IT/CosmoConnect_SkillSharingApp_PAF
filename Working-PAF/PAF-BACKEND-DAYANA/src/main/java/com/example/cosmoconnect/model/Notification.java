package com.example.cosmoconnect.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    private String id;
    private String userId; // Recipient user
    private String type;   // LIKE, COMMENT, COMPETITION, LEARNING_PLAN
    private String message;
    private String link;   // Optional: link to resource
    private boolean isRead;
    private LocalDateTime createdAt;
} 