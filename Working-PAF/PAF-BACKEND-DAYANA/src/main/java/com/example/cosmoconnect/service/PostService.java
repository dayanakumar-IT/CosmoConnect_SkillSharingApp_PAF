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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;

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
                .category(postDto.getCategory())
                .skillTags(postDto.getSkillTags())
                .poll(postDto.getPoll() != null ? Post.Poll.builder()
                        .question(postDto.getPoll().getQuestion())
                        .options(postDto.getPoll().getOptions())
                        .votes(postDto.getPoll().getVotes())
                        .build() : null)
                .animationType(postDto.getAnimationType())
                .build();

        Post savedPost = postRepository.save(post);
        log.debug("Saved post with ID: {}", savedPost.getId());
        
        return convertToDto(savedPost, author.getId());
    }

    @Transactional
    public PostDto createPostWithMedia(PostDto postDto, MultipartFile[] media, String userEmail) {
        log.debug("Creating post with media for user: {}", userEmail);
        log.debug("Post DTO: {}", postDto);
        log.debug("Media files: {}", media != null ? media.length : 0);
        
        User author = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
        log.debug("Found author: {}", author.getEmail());

        List<String> mediaUrls = new ArrayList<>();
        String mediaType = null;
        if (media != null && media.length > 0) {
            try {
                for (MultipartFile file : media) {
                    String fileName = fileStorageService.storeFile(file, "posts");
                    mediaUrls.add(fileName);
                }
                // Determine media type based on first file
                String contentType = media[0].getContentType();
                if (contentType != null && contentType.startsWith("video")) {
                    mediaType = "VIDEO";
                } else {
                    mediaType = "IMAGE";
                }
            } catch (IOException e) {
                log.error("Error storing media files: {}", e.getMessage(), e);
                throw new RuntimeException("Failed to store media files: " + e.getMessage());
            }
        }

        Post post = Post.builder()
                .title(postDto.getTitle())
                .description(postDto.getDescription())
                .content(postDto.getContent())
                .mediaUrls(mediaUrls)
                .mediaType(mediaType)
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
                .category(postDto.getCategory())
                .skillTags(postDto.getSkillTags())
                .poll(postDto.getPoll() != null ? Post.Poll.builder()
                        .question(postDto.getPoll().getQuestion())
                        .options(postDto.getPoll().getOptions())
                        .votes(postDto.getPoll().getVotes())
                        .build() : null)
                .animationType(postDto.getAnimationType())
                .build();

        Post savedPost = postRepository.save(post);
        log.debug("Saved post with ID: {} (with media)", savedPost.getId());
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
        if (postDto.getCategory() != null) {
            post.setCategory(postDto.getCategory());
        }
        if (postDto.getSkillTags() != null) {
            post.setSkillTags(postDto.getSkillTags());
        }
        if (postDto.getPoll() != null) {
            post.setPoll(Post.Poll.builder()
                .question(postDto.getPoll().getQuestion())
                .options(postDto.getPoll().getOptions())
                .votes(postDto.getPoll().getVotes())
                .build());
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

        String userIdStr = user.getId().toString();
        if (!post.getLikes().contains(userIdStr)) {
            post.getLikes().add(userIdStr);
            postRepository.save(post);
            // Notify post owner if not self-like
            if (!post.getAuthor().getId().equals(user.getId())) {
                notificationService.createNotification(
                    post.getAuthor().getId(),
                    "LIKE",
                    user.getFullName() + " liked your post: " + post.getTitle(),
                    "/posts/" + post.getId()
                );
            }
        }
    }

    @Transactional
    public void unlikePost(String postId, String userEmail) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        String userIdStr = user.getId().toString();
        post.getLikes().remove(userIdStr);
        postRepository.save(post);
    }

    @Transactional
    public PostDto updatePostWithMedia(String postId, PostDto postDto, MultipartFile[] media, String userEmail) {
        log.debug("Updating post with media for user: {}", userEmail);

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to update this post");
        }

        // Handle new media files
        List<String> mediaUrls = post.getMediaUrls() != null ? new ArrayList<>(post.getMediaUrls()) : new ArrayList<>();
        String mediaType = post.getMediaType();

        if (media != null && media.length > 0) {
            try {
                for (MultipartFile file : media) {
                    String fileName = fileStorageService.storeFile(file, "posts");
                    mediaUrls.add(fileName);
                }
                // Determine media type based on first file
                String contentType = media[0].getContentType();
                if (contentType != null && contentType.startsWith("video")) {
                    mediaType = "VIDEO";
                } else {
                    mediaType = "IMAGE";
                }
            } catch (IOException e) {
                log.error("Error storing media files: {}", e.getMessage(), e);
                throw new RuntimeException("Failed to store media files: " + e.getMessage());
            }
        }

        // Remove media URLs if specified
        if (postDto.getRemovedMedia() != null && !postDto.getRemovedMedia().isEmpty()) {
            mediaUrls.removeAll(postDto.getRemovedMedia());
            // Optionally: delete files from storage as well
            for (String fileName : postDto.getRemovedMedia()) {
                try {
                    fileStorageService.deleteFile(fileName);
                } catch (Exception e) {
                    log.warn("Failed to delete file: {}", fileName, e);
                }
            }
        }

        // Update fields from postDto
        if (postDto.getTitle() != null) post.setTitle(postDto.getTitle());
        if (postDto.getDescription() != null) post.setDescription(postDto.getDescription());
        if (postDto.getContent() != null) post.setContent(postDto.getContent());
        if (mediaUrls != null) post.setMediaUrls(mediaUrls);
        if (mediaType != null) post.setMediaType(mediaType);
        if (postDto.getTelescopeUsed() != null) post.setTelescopeUsed(postDto.getTelescopeUsed());
        if (postDto.getLocation() != null) post.setLocation(postDto.getLocation());
        if (postDto.getCelestialObject() != null) post.setCelestialObject(postDto.getCelestialObject());
        if (postDto.getObservationDateTime() != null) post.setObservationDateTime(postDto.getObservationDateTime());
        if (postDto.getObservationConditions() != null) post.setObservationConditions(postDto.getObservationConditions());
        if (postDto.getCoordinates() != null) post.setCoordinates(postDto.getCoordinates());
        if (postDto.getExposureTime() != null) post.setExposureTime(postDto.getExposureTime());
        if (postDto.getEquipmentDetails() != null) post.setEquipmentDetails(postDto.getEquipmentDetails());
        if (postDto.getProcessingDetails() != null) post.setProcessingDetails(postDto.getProcessingDetails());
        if (postDto.getCategory() != null) post.setCategory(postDto.getCategory());
        if (postDto.getSkillTags() != null) post.setSkillTags(postDto.getSkillTags());
        if (postDto.getAnimationType() != null) post.setAnimationType(postDto.getAnimationType());
        if (postDto.getPoll() != null) {
            post.setPoll(Post.Poll.builder()
                .question(postDto.getPoll().getQuestion())
                .options(postDto.getPoll().getOptions())
                .votes(postDto.getPoll().getVotes())
                .build());
        } else {
            post.setPoll(null);
        }
        post.setUpdatedAt(LocalDateTime.now());
        post.setPublic(postDto.isPublic());

        Post updatedPost = postRepository.save(post);
        log.debug("Saved updated post with ID: {} (with media)", updatedPost.getId());
        return convertToDto(updatedPost, user.getId());
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
        
        // Add new fields
        dto.setCategory(post.getCategory());
        dto.setSkillTags(post.getSkillTags());
        dto.setAnimationType(post.getAnimationType());
        
        // Convert Poll if exists
        if (post.getPoll() != null) {
            PostDto.PollDto pollDto = PostDto.PollDto.builder()
                .question(post.getPoll().getQuestion())
                .options(post.getPoll().getOptions())
                .votes(post.getPoll().getVotes())
                .build();
            dto.setPoll(pollDto);
        }
        
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