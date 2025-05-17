package com.example.cosmoconnect.model;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.util.List;

@Document(collection = "learnings")
public class Learning {
    @Id
    private String id;
    @NotBlank
    private String learningTopic;
    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    @NotBlank
    private String learningSubject;
    @NotBlank
    private String whatDidYouLearn;
    private int currentProgressStage;
    private double timeSpentInHours;
    @JsonProperty("public")
    private boolean isPublic;
    private List<String> skills;
    private String nextSteps;
    @NotBlank
    private String userId;

    public Learning(String id, String learningTopic, LocalDate startDate, LocalDate endDate, String learningSubject, String whatDidYouLearn, int currentProgressStage, double timeSpentInHours, boolean isPublic, List<String> skills, String nextSteps, String userId) {
        this.id = id;
        this.learningTopic = learningTopic;
        this.startDate = startDate;
        this.endDate = endDate;
        this.learningSubject = learningSubject;
        this.whatDidYouLearn = whatDidYouLearn;
        this.currentProgressStage = currentProgressStage;
        this.timeSpentInHours = timeSpentInHours;
        this.isPublic = isPublic;
        this.skills = skills;
        this.nextSteps = nextSteps;
        this.userId = userId;
    }

    public Learning() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLearningTopic() {
        return learningTopic;
    }

    public void setLearningTopic(String learningTopic) {
        this.learningTopic = learningTopic;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getLearningSubject() {
        return learningSubject;
    }

    public void setLearningSubject(String learningSubject) {
        this.learningSubject = learningSubject;
    }

    public String getWhatDidYouLearn() {
        return whatDidYouLearn;
    }

    public void setWhatDidYouLearn(String whatDidYouLearn) {
        this.whatDidYouLearn = whatDidYouLearn;
    }

    public int getCurrentProgressStage() {
        return currentProgressStage;
    }

    public void setCurrentProgressStage(int currentProgressStage) {
        this.currentProgressStage = currentProgressStage;
    }

    public double getTimeSpentInHours() {
        return timeSpentInHours;
    }

    public void setTimeSpentInHours(double timeSpentInHours) {
        this.timeSpentInHours = timeSpentInHours;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean aPublic) {
        isPublic = aPublic;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public String getNextSteps() {
        return nextSteps;
    }

    public void setNextSteps(String nextSteps) {
        this.nextSteps = nextSteps;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "Learning{" +
                "id='" + id + '\'' +
                ", learningTopic='" + learningTopic + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", learningSubject='" + learningSubject + '\'' +
                ", whatDidYouLearn='" + whatDidYouLearn + '\'' +
                ", currentProgressStage=" + currentProgressStage +
                ", timeSpentInHours=" + timeSpentInHours +
                ", isPublic=" + isPublic +
                ", skills=" + skills +
                ", nextSteps='" + nextSteps + '\'' +
                ", userId='" + userId + '\'' +
                '}';
    }
}
