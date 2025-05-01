package com.example.cosmoconnect.service;

import com.example.cosmoconnect.dto.PostDto;
import com.example.cosmoconnect.exception.ResourceNotFoundException;
import com.example.cosmoconnect.model.Post;
import com.example.cosmoconnect.model.User;
import com.example.cosmoconnect.repository.PostRepository;
import com.example.cosmoconnect.repository.UserRepository;
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
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public PostDto createPost(PostDto postDto, String userEmail) {
        log.debug("Creating post for user with email: {}", userEmail);
        
        User author = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
        
        log.debug("Found user: {} with ID: {}", author.getEmail(), author.getId());

        Post post = Post.builder()
                .title(postDto.getTitle())
                .description(postDto.getDescription())
                .content(postDto.getContent())
                .mediaUrls(postDto.getMediaUrls())
                .mediaType(postDto.getMediaType())
                .telescopeUsed(postDto.getTelescopeUsed())
                .location(postDto.getLocation())
                .celestialObject(postDto.getCelestialObject())
                .observationDateTime(postDto.getObservationDateTime())
                .observationConditions(postDto.getObservationConditions())
                .author(author)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .isPublic(postDto.isPublic())
                .coordinates(postDto.getCoordinates())
                .exposureTime(postDto.getExposureTime())
                .equipmentDetails(postDto.getEquipmentDetails())
                .processingDetails(postDto.getProcessingDetails())
                .build();

        Post savedPost = postRepository.save(post);
        log.debug("Saved post with ID: {}", savedPost.getId());
        
        return convertToDto(savedPost, author.getId());
    }

    public PostDto getPost(String postId, String userEmail) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
                
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
                
        return convertToDto(post, user.getId());
    }

    public List<PostDto> getUserPosts(String userId) {
        List<Post> posts = postRepository.findByAuthorIdOrderByCreatedAtDesc(userId);
        return posts.stream()
                .map(post -> convertToDto(post, userId))
                .collect(Collectors.toList());
    }

    public List<PostDto> getFeedPosts(String userEmail) {
        log.debug("Fetching feed posts for user email: {}", userEmail);
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
        
        log.debug("Found user: {} with ID: {}", user.getEmail(), user.getId());
        
        List<String> followingIds = user.getFollowing();
        followingIds.add(user.getId()); // Include user's own posts
        
        log.debug("Looking for posts from users: {}", followingIds);
        
        List<Post> posts = postRepository.findByAuthorIdInOrderByCreatedAtDesc(followingIds);
        log.debug("Found {} posts", posts.size());
        
        if (posts.isEmpty()) {
            log.debug("No posts found. User following count: {}, Has own posts: {}", 
                followingIds.size() - 1, // Subtract 1 because we added the user's own ID
                posts.stream().anyMatch(post -> post.getAuthor().getId().equals(user.getId())));
        }
        
        return posts.stream()
                .map(post -> {
                    PostDto dto = convertToDto(post, user.getId());
                    log.debug("Converting post: id={}, title={}, author={}", 
                        post.getId(), post.getTitle(), post.getAuthor().getEmail());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public PostDto updatePost(String postId, PostDto postDto, String userEmail) {
        log.debug("Updating post {} for user {}", postId, userEmail);
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to update this post");
        }

        // Only update fields that are provided in the request
        if (postDto.getTitle() != null) {
            post.setTitle(postDto.getTitle());
        }
        if (postDto.getDescription() != null) {
            post.setDescription(postDto.getDescription());
        }
        if (postDto.getContent() != null) {
            post.setContent(postDto.getContent());
        }
        if (postDto.getMediaUrls() != null) {
            post.setMediaUrls(postDto.getMediaUrls());
        }
        if (postDto.getMediaType() != null) {
            post.setMediaType(postDto.getMediaType());
        }
        if (postDto.getTelescopeUsed() != null) {
            post.setTelescopeUsed(postDto.getTelescopeUsed());
        }
        if (postDto.getLocation() != null) {
            post.setLocation(postDto.getLocation());
        }
        if (postDto.getCelestialObject() != null) {
            post.setCelestialObject(postDto.getCelestialObject());
        }
        if (postDto.getObservationDateTime() != null) {
            post.setObservationDateTime(postDto.getObservationDateTime());
        }
        if (postDto.getObservationConditions() != null) {
            post.setObservationConditions(postDto.getObservationConditions());
        }
        if (postDto.getCoordinates() != null) {
            post.setCoordinates(postDto.getCoordinates());
        }
        if (postDto.getExposureTime() != null) {
            post.setExposureTime(postDto.getExposureTime());
        }
        if (postDto.getEquipmentDetails() != null) {
            post.setEquipmentDetails(postDto.getEquipmentDetails());
        }
        if (postDto.getProcessingDetails() != null) {
            post.setProcessingDetails(postDto.getProcessingDetails());
        }

        // Always update these fields
        post.setUpdatedAt(LocalDateTime.now());
        post.setPublic(postDto.isPublic()); // Boolean primitive is always present

        log.debug("Saving updated post with ID: {}", post.getId());
        Post updatedPost = postRepository.save(post);
        
        return convertToDto(updatedPost, user.getId());
    }

    @Transactional
    public void deletePost(String postId, String userEmail) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to delete this post");
        }

        postRepository.delete(post);
    }

    @Transactional
    public void likePost(String postId, String userEmail) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        if (!post.getLikes().contains(user.getId())) {
            post.getLikes().add(user.getId());
            postRepository.save(post);
        }
    }

    @Transactional
    public void unlikePost(String postId, String userEmail) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        post.getLikes().remove(user.getId());
        postRepository.save(post);
    }

    private PostDto convertToDto(Post post, String currentUserId) {
        PostDto dto = new PostDto();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setDescription(post.getDescription());
        dto.setContent(post.getContent());
        dto.setMediaUrls(post.getMediaUrls());
        dto.setMediaType(post.getMediaType());
        dto.setTelescopeUsed(post.getTelescopeUsed());
        dto.setLocation(post.getLocation());
        dto.setCelestialObject(post.getCelestialObject());
        dto.setObservationDateTime(post.getObservationDateTime());
        dto.setObservationConditions(post.getObservationConditions());
        dto.setAuthorId(post.getAuthor().getId());
        dto.setAuthorName(post.getAuthor().getFullName());
        dto.setAuthorImageUrl(post.getAuthor().getImageUrl());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        dto.setLikeCount(post.getLikes().size());
        dto.setCommentCount(post.getComments().size());
        dto.setLiked(post.getLikes().contains(currentUserId));
        dto.setPublic(post.isPublic());
        dto.setCoordinates(post.getCoordinates());
        dto.setExposureTime(post.getExposureTime());
        dto.setEquipmentDetails(post.getEquipmentDetails());
        dto.setProcessingDetails(post.getProcessingDetails());
        return dto;
    }

    // Add a new method to get all public posts
    public List<PostDto> getAllPublicPosts(String userEmail) {
        log.debug("Fetching all public posts for user email: {}", userEmail);
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
        
        List<Post> posts = postRepository.findByIsPublicTrueOrderByCreatedAtDesc();
        log.debug("Found {} public posts", posts.size());
        
        return posts.stream()
                .map(post -> convertToDto(post, user.getId()))
                .collect(Collectors.toList());
    }
} 