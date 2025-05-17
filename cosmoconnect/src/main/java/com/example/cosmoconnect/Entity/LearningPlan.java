package com.example.cosmoconnect.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "learningPlans")
public class LearningPlan {
    @Id
    private String _id;
    private String PlanTitle;
    private String Description;
    private String DifficultyLevel;
    private String Duration;
    private String PlanMaterials;
    private String Certificate;

    public LearningPlan(String _id, String certificate, String description, String duration, String planMaterials, String planTitle, String difficultyLevel) {
        this._id = _id;
        Certificate = certificate;
        Description = description;
        Duration = duration;
        PlanMaterials = planMaterials;
        PlanTitle = planTitle;
        DifficultyLevel = difficultyLevel;
    }

    public LearningPlan() {
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getCertificate() {
        return Certificate;
    }

    public void setCertificate(String certificate) {
        Certificate = certificate;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String description) {
        Description = description;
    }

    public String getDuration() {
        return Duration;
    }

    public void setDuration(String duration) {
        Duration = duration;
    }

    public String getPlanMaterials() {
        return PlanMaterials;
    }

    public void setPlanMaterials(String planMaterials) {
        PlanMaterials = planMaterials;
    }

    public String getPlanTitle() {
        return PlanTitle;
    }

    public void setPlanTitle(String planTitle) {
        PlanTitle = planTitle;
    }

    public String getDifficultyLevel() {
        return DifficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        DifficultyLevel = difficultyLevel;
    }
}
