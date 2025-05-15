package com.example.cosmoconnect.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

@Document(collection = "learningplan")
public class LearningPlan {
    @Id
    private String id;
    private String planTitle;
    private String description;
    private String difficultyLevel;
    private String duration;
    private String certificate;
    private List<String> learningMaterials;
    private Double price;
    @JsonProperty("isPublic")
    private boolean isPublic;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPlanTitle() { return planTitle; }
    public void setPlanTitle(String planTitle) { this.planTitle = planTitle; }
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
    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }
} 