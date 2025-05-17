package com.example.cosmoconnect.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User implements UserDetails {

    @Id
    private String id;

    private String fullName;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String imageUrl;

    private boolean emailVerified;

    // Astronomy-specific profile fields
    private String username;

    private LocalDate dateOfBirth;

    private String location;

    private String timezone;

    // Astronomy Expertise
    private String astronomyLevel; // Beginner, Intermediate, Advanced, Professional

    private Set<String> astronomyInterests;

    private Set<String> observationEquipment;

    // Social Links
    private String websiteUrl;

    private String instagramProfile;

    private String twitterProfile;

    // Additional Profile Information
    private String biography;

    private boolean sharePersonalInfo;

    private Set<String> knownLanguages;

    // Astronomy Achievements
    private Set<String> certifications;

    private Set<String> observationBadges;

    // Account Metadata
    @Builder.Default
    private LocalDateTime accountCreated = LocalDateTime.now();

    private LocalDateTime lastLogin;

    // Roles and Permissions
    @Builder.Default
    private Set<String> roles = new HashSet<>();

    @Builder.Default
    private boolean enabled = true;

    @Builder.Default
    private AuthProvider provider = AuthProvider.local;

    private String providerId;

    // Social features
    @Builder.Default
    private List<String> following = new ArrayList<>(); // Users this user follows
    
    @Builder.Default
    private List<String> followers = new ArrayList<>(); // Users following this user

    // Profile Completeness
    public int getProfileCompleteness() {
        int completeness = 0;

        if (fullName != null && !fullName.isEmpty()) completeness += 10;
        if (email != null && !email.isEmpty()) completeness += 10;
        if (imageUrl != null && !imageUrl.isEmpty()) completeness += 10;
        if (dateOfBirth != null) completeness += 10;
        if (location != null && !location.isEmpty()) completeness += 10;
        if (astronomyLevel != null && !astronomyLevel.isEmpty()) completeness += 10;
        if (astronomyInterests != null && !astronomyInterests.isEmpty()) completeness += 10;
        if (biography != null && !biography.isEmpty()) completeness += 10;

        return Math.min(completeness, 100);
    }

    // UserDetails Interface Methods
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}

