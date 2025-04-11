package com.example.cosmoconnect.controller;

import com.example.cosmoconnect.dto.PostDto;
import com.example.cosmoconnect.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Slf4j
public class PostController {

    private final PostService postService;

    private String getUserEmail(Authentication authentication) {
        if (authentication == null) {
            throw new IllegalStateException("No authentication present");
        }

        Object principal = authentication.getPrincipal();
        log.debug("Authentication principal type: {}", principal.getClass().getName());

        if (principal instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) principal;
            String email = oauth2User.getAttribute("email");
            if (email == null) {
                throw new IllegalStateException("Email not found in OAuth2User attributes");
            }
            log.debug("OAuth2 user email: {}", email);
            return email;
        } else if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            log.debug("UserDetails username (email): {}", username);
            return username;
        } else {
            try {
                OAuth2User oauth2User = (OAuth2User) principal;
                String email = oauth2User.getAttribute("email");
                if (email != null) {
                    log.debug("Found email in OAuth2User attributes: {}", email);
                    return email;
                }
            } catch (Exception e) {
                log.debug("Failed to cast principal to OAuth2User", e);
            }
            
            String name = authentication.getName();
            log.debug("Using authentication name as email: {}", name);
            return name;
        }
    }

    @PostMapping
    public ResponseEntity<PostDto> createPost(@RequestBody PostDto postDto, Authentication authentication) {
        log.debug("Creating post with authentication: {}", authentication);
        String userEmail = getUserEmail(authentication);
        log.info("Creating post for user: {}", userEmail);
        return ResponseEntity.ok(postService.createPost(postDto, userEmail));
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDto> getPost(@PathVariable String postId, Authentication authentication) {
        String userEmail = getUserEmail(authentication);
        return ResponseEntity.ok(postService.getPost(postId, userEmail));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostDto>> getUserPosts(@PathVariable String userId, Authentication authentication) {
        String userEmail = getUserEmail(authentication);
        return ResponseEntity.ok(postService.getUserPosts(userId));
    }

    @GetMapping("/feed")
    public ResponseEntity<List<PostDto>> getFeedPosts(Authentication authentication) {
        log.debug("Getting feed posts with authentication: {}", authentication);
        String userEmail = getUserEmail(authentication);
        return ResponseEntity.ok(postService.getFeedPosts(userEmail));
    }

    @GetMapping("/public")
    public ResponseEntity<List<PostDto>> getPublicPosts(Authentication authentication) {
        log.debug("Getting public posts with authentication: {}", authentication);
        String userEmail = getUserEmail(authentication);
        return ResponseEntity.ok(postService.getAllPublicPosts(userEmail));
    }

    @PutMapping("/{postId}")
    public ResponseEntity<PostDto> updatePost(
            @PathVariable String postId,
            @RequestBody PostDto postDto,
            Authentication authentication
    ) {
        String userEmail = getUserEmail(authentication);
        return ResponseEntity.ok(postService.updatePost(postId, postDto, userEmail));
    }

    @PatchMapping("/{postId}")
    public ResponseEntity<PostDto> patchPost(
            @PathVariable String postId,
            @RequestBody PostDto postDto,
            Authentication authentication
    ) {
        String userEmail = getUserEmail(authentication);
        return ResponseEntity.ok(postService.updatePost(postId, postDto, userEmail));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable String postId, Authentication authentication) {
        String userEmail = getUserEmail(authentication);
        postService.deletePost(postId, userEmail);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<Void> likePost(@PathVariable String postId, Authentication authentication) {
        String userEmail = getUserEmail(authentication);
        postService.likePost(postId, userEmail);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{postId}/unlike")
    public ResponseEntity<Void> unlikePost(@PathVariable String postId, Authentication authentication) {
        String userEmail = getUserEmail(authentication);
        postService.unlikePost(postId, userEmail);
        return ResponseEntity.ok().build();
    }
} 