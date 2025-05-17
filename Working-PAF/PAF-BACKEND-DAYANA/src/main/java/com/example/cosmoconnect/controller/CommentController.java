package com.example.cosmoconnect.controller;

import com.example.cosmoconnect.dto.CommentDto;
import com.example.cosmoconnect.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@Slf4j
public class CommentController {

    private final CommentService commentService;

    private String getUserEmail(Authentication authentication) {
        if (authentication == null) {
            log.error("Authentication object is null");
            throw new IllegalStateException("No authentication present");
        }

        Object principal = authentication.getPrincipal();
        log.debug("Authentication principal type: {}", principal.getClass().getName());
        log.debug("Authentication details: {}", authentication.getDetails());
        log.debug("Authentication name: {}", authentication.getName());

        if (principal instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) principal;
            String email = oauth2User.getAttribute("email");
            if (email == null) {
                log.error("Email not found in OAuth2User attributes. Available attributes: {}", oauth2User.getAttributes());
                throw new IllegalStateException("Email not found in OAuth2User attributes");
            }
            log.debug("OAuth2 user email: {}", email);
            return email;
        } else if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            log.debug("UserDetails username (email): {}", username);
            return username;
        } else {
            String name = authentication.getName();
            log.debug("Using authentication name as email: {}", name);
            return name;
        }
    }

    @PostMapping
    public ResponseEntity<CommentDto> createComment(
            @RequestBody CommentDto commentDto,
            Authentication authentication
    ) {
        log.debug("Received comment creation request with authentication: {}", authentication);
        String userEmail = getUserEmail(authentication);
        log.debug("Creating comment for user: {} on post: {}", userEmail, commentDto.getPostId());
        return ResponseEntity.ok(commentService.createComment(commentDto, userEmail));
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentDto>> getPostComments(
            @PathVariable String postId,
            Authentication authentication
    ) {
        log.debug("Getting comments for post ID: {}", postId);
        String userEmail = getUserEmail(authentication);
        log.debug("User email for get comments: {}", userEmail);
        List<CommentDto> comments = commentService.getPostComments(postId, userEmail);
        log.debug("Retrieved {} comments", comments.size());
        return ResponseEntity.ok(comments);
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentDto> updateComment(
            @PathVariable String commentId,
            @RequestBody CommentDto commentDto,
            Authentication authentication
    ) {
        log.debug("Updating comment with ID: {} and content: {}", commentId, commentDto.getContent());
        String userEmail = getUserEmail(authentication);
        log.debug("User email for update: {}", userEmail);
        return ResponseEntity.ok(commentService.updateComment(commentId, commentDto, userEmail));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String commentId,
            Authentication authentication
    ) {
        log.debug("Deleting comment with ID: {}", commentId);
        String userEmail = getUserEmail(authentication);
        log.debug("User email for delete: {}", userEmail);
        commentService.deleteComment(commentId, userEmail);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{commentId}/like")
    public ResponseEntity<Void> likeComment(
            @PathVariable String commentId,
            Authentication authentication
    ) {
        String userEmail = getUserEmail(authentication);
        commentService.likeComment(commentId, userEmail);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{commentId}/unlike")
    public ResponseEntity<Void> unlikeComment(
            @PathVariable String commentId,
            Authentication authentication
    ) {
        String userEmail = getUserEmail(authentication);
        commentService.unlikeComment(commentId, userEmail);
        return ResponseEntity.ok().build();
    }
} 