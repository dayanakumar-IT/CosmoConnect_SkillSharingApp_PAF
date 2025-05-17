package com.example.cosmoconnect.service;

import com.example.cosmoconnect.dto.UserDto;
import com.example.cosmoconnect.exception.ResourceNotFoundException;
import com.example.cosmoconnect.model.User;
import com.example.cosmoconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public UserDto getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();

        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + currentUserEmail));

        return mapToUserDto(user);
    }

    public UserDto getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        return mapToUserDto(user);
    }

    public UserDto updateProfile(String userId, UserDto userDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Update user fields
        user.setFullName(userDto.getFullName());
        user.setBiography(userDto.getBiography());
        user.setLocation(userDto.getLocation());
        user.setTimezone(userDto.getTimezone());
        user.setAstronomyLevel(userDto.getAstronomyLevel());
        user.setAstronomyInterests(userDto.getAstronomyInterests());
        user.setObservationEquipment(userDto.getObservationEquipment());
        user.setWebsiteUrl(userDto.getWebsiteUrl());
        user.setInstagramProfile(userDto.getInstagramProfile());
        user.setTwitterProfile(userDto.getTwitterProfile());
        user.setKnownLanguages(userDto.getKnownLanguages());

        User updatedUser = userRepository.save(user);
        return mapToUserDto(updatedUser);
    }

    public UserDto updateProfilePhoto(String userId, MultipartFile photo) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        try {
            // Delete old photo if exists and is a local file
            if (user.getImageUrl() != null && !user.getImageUrl().startsWith("http")) {
                fileStorageService.deleteFile(user.getImageUrl());
            }

            // Store new photo
            String fileName = fileStorageService.storeFile(photo, "profile-photos");
            user.setImageUrl(fileName);

            User updatedUser = userRepository.save(user);
            return mapToUserDto(updatedUser);
        } catch (IOException e) {
            throw new RuntimeException("Failed to update profile photo: " + e.getMessage(), e);
        }
    }

    public void deleteProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Delete profile photo if exists and is a local file
        if (user.getImageUrl() != null && !user.getImageUrl().startsWith("http")) {
            fileStorageService.deleteFile(user.getImageUrl());
        }

        // Delete user from database
        userRepository.delete(user);
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .imageUrl(user.getImageUrl())
                .emailVerified(user.isEmailVerified())
                .username(user.getUsername())
                .dateOfBirth(user.getDateOfBirth())
                .location(user.getLocation())
                .timezone(user.getTimezone())
                .astronomyLevel(user.getAstronomyLevel())
                .astronomyInterests(user.getAstronomyInterests())
                .observationEquipment(user.getObservationEquipment())
                .websiteUrl(user.getWebsiteUrl())
                .instagramProfile(user.getInstagramProfile())
                .twitterProfile(user.getTwitterProfile())
                .biography(user.getBiography())
                .sharePersonalInfo(user.isSharePersonalInfo())
                .knownLanguages(user.getKnownLanguages())
                .certifications(user.getCertifications())
                .observationBadges(user.getObservationBadges())
                .accountCreated(user.getAccountCreated())
                .lastLogin(user.getLastLogin())
                .roles(user.getRoles())
                .provider(user.getProvider())
                .profileCompleteness(user.getProfileCompleteness())
                .build();
    }
}