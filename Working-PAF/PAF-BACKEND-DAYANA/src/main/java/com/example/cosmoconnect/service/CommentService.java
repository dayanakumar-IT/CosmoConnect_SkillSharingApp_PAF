package com.example.cosmoconnect.service;

import com.example.cosmoconnect.dto.CommentDto;
import com.example.cosmoconnect.exception.ResourceNotFoundException;
import com.example.cosmoconnect.model.Comment;
import com.example.cosmoconnect.model.Post;
import com.example.cosmoconnect.model.User;
import com.example.cosmoconnect.repository.CommentRepository;
import com.example.cosmoconnect.repository.PostRepository;
import com.example.cosmoconnect.repository.UserRepository;
import com.example.cosmoconnect.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public CommentDto createComment(CommentDto commentDto, String userEmail) {
        log.debug("Creating comment for user email: {}", userEmail);
        
        log.debug("Looking up user with email: {}", userEmail);
        var userOptional = userRepository.findByEmail(userEmail);
        if (userOptional.isEmpty()) {
            log.error("User not found with email: {}", userEmail);
            throw new ResourceNotFoundException("User not found with email: " + userEmail);
        }
        User author = userOptional.get();
        log.debug("Found user: {} with ID: {}", author.getEmail(), author.getId());

        log.debug("Looking up post with ID: {}", commentDto.getPostId());
        var postOptional = postRepository.findById(commentDto.getPostId());
        if (postOptional.isEmpty()) {
            log.error("Post not found with ID: {}", commentDto.getPostId());
            throw new ResourceNotFoundException("Post not found with ID: " + commentDto.getPostId());
        }
        Post post = postOptional.get();
        log.debug("Found post with ID: {}", post.getId());

        Comment comment = Comment.builder()
                .content(commentDto.getContent())
                .author(author)
                .postId(commentDto.getPostId())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Comment savedComment = commentRepository.save(comment);
        log.debug("Saved comment with ID: {} for post: {} by user: {}", 
            savedComment.getId(), post.getId(), author.getEmail());
        
        // Notify post owner if not self-comment
        if (!post.getAuthor().getId().equals(author.getId())) {
            notificationService.createNotification(
                post.getAuthor().getId(),
                "COMMENT",
                author.getFullName() + " commented on your post: " + post.getTitle(),
                "/posts/" + post.getId()
            );
        }
        
        return convertToDto(savedComment, author.getId());
    }

    public List<CommentDto> getPostComments(String postId, String userEmail) {
        log.debug("Getting comments for post: {} and user email: {}", postId, userEmail);
        
        // Verify post exists
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with ID: " + postId));
        log.debug("Found post with title: {} and ID: {}", post.getTitle(), post.getId());
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
        log.debug("Found user: {} with ID: {}", user.getEmail(), user.getId());
                
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
        log.debug("Found {} comments for post ID: {}", comments.size(), postId);
        
        if (comments.isEmpty()) {
            log.debug("No comments found for post. Post creation date: {}", post.getCreatedAt());
            // Check if the post has any comments in its comments list
            if (post.getComments() != null && !post.getComments().isEmpty()) {
                log.debug("Post has {} comments in its comments list", post.getComments().size());
            } else {
                log.debug("Post has no comments in its comments list");
            }
        } else {
            comments.forEach(comment -> 
                log.debug("Comment ID: {}, Author: {}, Content: {}, Created At: {}", 
                    comment.getId(), 
                    comment.getAuthor().getEmail(),
                    comment.getContent(),
                    comment.getCreatedAt())
            );
        }
        
        List<CommentDto> commentDtos = comments.stream()
                .map(comment -> convertToDto(comment, user.getId()))
                .collect(Collectors.toList());
        
        log.debug("Converted {} comments to DTOs", commentDtos.size());
        return commentDtos;
    }

    @Transactional
    public CommentDto updateComment(String commentId, CommentDto commentDto, String userEmail) {
        log.debug("Updating comment: {} for user email: {}", commentId, userEmail);
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to update this comment");
        }

        comment.setContent(commentDto.getContent());
        comment.setUpdatedAt(LocalDateTime.now());

        Comment updatedComment = commentRepository.save(comment);
        log.debug("Updated comment with ID: {}", updatedComment.getId());
        
        return convertToDto(updatedComment, user.getId());
    }

    @Transactional
    public void deleteComment(String commentId, String userEmail) {
        log.debug("Deleting comment: {} for user email: {}", commentId, userEmail);
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to delete this comment");
        }

        commentRepository.delete(comment);
        log.debug("Deleted comment with ID: {}", commentId);
    }

    @Transactional
    public void likeComment(String commentId, String userEmail) {
        log.debug("Liking comment: {} for user email: {}", commentId, userEmail);
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getLikes().contains(user.getId())) {
            comment.getLikes().add(user.getId());
            commentRepository.save(comment);
            log.debug("Added like to comment: {}", commentId);
        }
    }

    @Transactional
    public void unlikeComment(String commentId, String userEmail) {
        log.debug("Unliking comment: {} for user email: {}", commentId, userEmail);
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        comment.getLikes().remove(user.getId());
        commentRepository.save(comment);
        log.debug("Removed like from comment: {}", commentId);
    }

    private CommentDto convertToDto(Comment comment, String currentUserId) {
        return CommentDto.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .authorId(comment.getAuthor().getId())
                .authorName(comment.getAuthor().getFullName())
                .authorImageUrl(comment.getAuthor().getImageUrl())
                .postId(comment.getPostId())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .likeCount(comment.getLikes().size())
                .isLiked(comment.getLikes().contains(currentUserId))
                .build();
    }
} 