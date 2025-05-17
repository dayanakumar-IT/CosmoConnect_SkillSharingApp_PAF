package com.example.cosmoconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
    private String id;
    private String content;
    private String authorId;
    private String authorName;
    private String authorImageUrl;
    private String postId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int likeCount;
    private boolean isLiked;
} 