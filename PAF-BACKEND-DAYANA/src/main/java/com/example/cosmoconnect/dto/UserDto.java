package com.example.cosmoconnect.dto;

import com.example.cosmoconnect.model.AuthProvider;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    // Basic User Information
    private String id;
    private String fullName;
    private String email;
    private String imageUrl;
    private boolean emailVerified;

    // Profile Details
    private String username;
    private LocalDate dateOfBirth;
    private String location;
    private String timezone;

    // Astronomy Expertise
    private String astronomyLevel;
    private Set<String> astronomyInterests;
    private Set<String> observationEquipment;

    // Social Links
    private String websiteUrl;
    private String instagramProfile;
    private String twitterProfile;

    // Additional Information
    private String biography;
    private boolean sharePersonalInfo;
    private Set<String> knownLanguages;

    // Achievements
    private Set<String> certifications;
    private Set<String> observationBadges;

    // Account Metadata
    private LocalDateTime accountCreated;
    private LocalDateTime lastLogin;

    // Roles and Permissions
    private Set<String> roles;
    private AuthProvider provider;

    // Profile Completeness
    private int profileCompleteness;
}