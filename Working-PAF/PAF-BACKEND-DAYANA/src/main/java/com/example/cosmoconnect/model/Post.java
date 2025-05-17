package com.example.cosmoconnect.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Document(collection = "posts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {
    @Id
    private String id;
    
    private String title;
    private String description;
    private String content; // For text content
    private List<String> mediaUrls; // For images/videos
    private String mediaType; // "IMAGE" or "VIDEO"
    private String telescopeUsed; // Optional field for astronomical equipment
    private String location; // Where the observation was made
    private String celestialObject; // e.g., "Moon", "Mars", "Andromeda Galaxy"
    private LocalDateTime observationDateTime;
    private String observationConditions; // Weather conditions, light pollution, etc.
    
    @DBRef
    private User author;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Builder.Default
    private List<String> likes = new ArrayList<>();
    
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();
    
    private boolean isPublic; // For private/public posts
    
    // Astronomical specific fields
    private String coordinates; // RA and DEC coordinates
    private String exposureTime; // For astrophotography
    private String equipmentDetails; // Detailed equipment information
    private String processingDetails; // Post-processing information

    // New fields for enhanced post features
    private String category; // AstroCapture, SkyLog, SkillTutorial, Location-based Spotting, Ask Cosmos
    private List<String> skillTags;
    private Poll poll;
    private String animationType; // For frontend animation hint

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Poll {
        private String question;
        private List<String> options;
        private Map<String, Integer> votes; // option -> vote count
    }
} 