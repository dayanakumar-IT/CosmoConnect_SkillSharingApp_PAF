package com.example.cosmoconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PostDto {
    private String id;
    private String title;
    private String description;
    private String content;
    private List<String> mediaUrls;
    private String mediaType;
    private String telescopeUsed;
    private String location;
    private String celestialObject;
    private LocalDateTime observationDateTime;
    private String observationConditions;
    private String authorId;
    private String authorName;
    private String authorImageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int likeCount;
    private int commentCount;
    private boolean isLiked;
    private boolean isPublic;
    private String coordinates;
    private String exposureTime;
    private String equipmentDetails;
    private String processingDetails;
} 