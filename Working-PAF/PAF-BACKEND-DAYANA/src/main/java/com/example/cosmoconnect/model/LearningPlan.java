package com.example.cosmoconnect.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "learningplan")
public class LearningPlan {
    @Id
    private String id;
    private String title;
    private String description;
    private String difficultyLevel;
    private String duration;
    private String certificate;
    private List<String> learningMaterials;
    private Double price;
    @JsonProperty("isPublic")
    private boolean isPublic;
    private String createdBy;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getCertificate() { return certificate; }
    public void setCertificate(String certificate) { this.certificate = certificate; }
    public List<String> getLearningMaterials() { return learningMaterials; }
    public void setLearningMaterials(List<String> learningMaterials) { this.learningMaterials = learningMaterials; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public boolean getIsPublic() { return isPublic; }
    public void setIsPublic(boolean isPublic) { this.isPublic = isPublic; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
} 