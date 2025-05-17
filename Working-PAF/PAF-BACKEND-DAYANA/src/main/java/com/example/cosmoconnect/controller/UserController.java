package com.example.cosmoconnect.controller;

import com.example.cosmoconnect.dto.UserDto;
import com.example.cosmoconnect.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.cosmoconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.cosmoconnect.model.User;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDto> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDto> updateProfile(
            @PathVariable String id,
            @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.updateProfile(id, userDto));
    }

    @PutMapping("/{id}/photo")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDto> updateProfilePhoto(
            @PathVariable String id,
            @RequestParam("photo") MultipartFile photo) {
        return ResponseEntity.ok(userService.updateProfilePhoto(id, photo));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated() and #id == authentication.principal.id")
    public ResponseEntity<Void> deleteProfile(@PathVariable String id) {
        userService.deleteProfile(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("")
    public List<User> getAllUsers() {
        System.out.println("[UserController] getAllUsers endpoint called");
        return userRepository.findAll();
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<?> followUser(@PathVariable String id, Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email).orElse(null);
        User targetUser = userRepository.findById(id).orElse(null);
        if (currentUser == null || targetUser == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        if (currentUser.getFollowing() == null) currentUser.setFollowing(new java.util.ArrayList<>());
        if (targetUser.getFollowers() == null) targetUser.setFollowers(new java.util.ArrayList<>());
        if (!currentUser.getFollowing().contains(id)) {
            currentUser.getFollowing().add(id);
            targetUser.getFollowers().add(currentUser.getId());
            userRepository.save(currentUser);
            userRepository.save(targetUser);
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/unfollow")
    public ResponseEntity<?> unfollowUser(@PathVariable String id, Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email).orElse(null);
        User targetUser = userRepository.findById(id).orElse(null);
        if (currentUser == null || targetUser == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        if (currentUser.getFollowing() == null) currentUser.setFollowing(new java.util.ArrayList<>());
        if (targetUser.getFollowers() == null) targetUser.setFollowers(new java.util.ArrayList<>());
        if (currentUser.getFollowing().contains(id)) {
            currentUser.getFollowing().remove(id);
            targetUser.getFollowers().remove(currentUser.getId());
            userRepository.save(currentUser);
            userRepository.save(targetUser);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/followers")
    public List<User> getFollowers(@PathVariable String id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null || user.getFollowers() == null) return java.util.Collections.emptyList();
        return userRepository.findAllById(user.getFollowers());
    }

    @GetMapping("/{id}/following")
    public List<User> getFollowing(@PathVariable String id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null || user.getFollowing() == null) return java.util.Collections.emptyList();
        return userRepository.findAllById(user.getFollowing());
    }
}