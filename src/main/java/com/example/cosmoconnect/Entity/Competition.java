package com.example.cosmoconnect.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Document(collection = "competitions")
public class Competition {

    @Id
    private String _id;
    private String competitionTitle;
    private String competitionCategory;
    private String competitionType;
    private Integer maxTeamSize;

    // Detailed Description
    private String competitionDescription;
    private String problemStatement;

    // Dates
    private LocalDate startDate;
    private LocalDate submissionDeadline;
    private String competitionStatus;

    // Countdown Timer Setting
    private Boolean countdownTimerEnabled;

    // File References (store file paths or URLs)
    private String competition_instructions; // PDF URL
    private String competitionBanner; // Image URL

    public Competition(String _id, String competitionTitle, String competitionCategory, String competitionType,
                       Integer maxTeamSize, String competitionDescription, String problemStatement,
                       LocalDate startDate, LocalDate submissionDeadline, String competitionStatus,
                       Boolean countdownTimerEnabled, String competition_instructions, String competitionBanner) {
        this._id = _id;
        this.competitionTitle = competitionTitle;
        this.competitionCategory = competitionCategory;
        this.competitionType = competitionType;
        this.maxTeamSize = maxTeamSize;
        this.competitionDescription = competitionDescription;
        this.problemStatement = problemStatement;
        this.startDate = startDate;
        this.submissionDeadline = submissionDeadline;
        this.competitionStatus = competitionStatus;
        this.countdownTimerEnabled = countdownTimerEnabled;
        this.competition_instructions = competition_instructions;
        this.competitionBanner = competitionBanner;
    }

    public Competition() {
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getCompetitionTitle() {
        return competitionTitle;
    }

    public void setCompetitionTitle(String competitionTitle) {
        this.competitionTitle = competitionTitle;
    }

    public String getCompetitionCategory() {
        return competitionCategory;
    }

    public void setCompetitionCategory(String competitionCategory) {
        this.competitionCategory = competitionCategory;
    }

    public String getCompetitionType() {
        return competitionType;
    }

    public void setCompetitionType(String competitionType) {
        this.competitionType = competitionType;
    }

    public Integer getMaxTeamSize() {
        return maxTeamSize;
    }

    public void setMaxTeamSize(Integer maxTeamSize) {
        this.maxTeamSize = maxTeamSize;
    }

    public String getCompetitionDescription() {
        return competitionDescription;
    }

    public void setCompetitionDescription(String competitionDescription) {
        this.competitionDescription = competitionDescription;
    }

    public String getProblemStatement() {
        return problemStatement;
    }

    public void setProblemStatement(String problemStatement) {
        this.problemStatement = problemStatement;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getSubmissionDeadline() {
        return submissionDeadline;
    }

    public void setSubmissionDeadline(LocalDate submissionDeadline) {
        this.submissionDeadline = submissionDeadline;
    }

    public String getCompetitionStatus() {
        return competitionStatus;
    }

    public void setCompetitionStatus(String competitionStatus) {
        this.competitionStatus = competitionStatus;
    }

    public Boolean getCountdownTimerEnabled() {
        return countdownTimerEnabled;
    }

    public void setCountdownTimerEnabled(Boolean countdownTimerEnabled) {
        this.countdownTimerEnabled = countdownTimerEnabled;
    }

    public String getCompetition_instructions() {
        return competition_instructions;
    }

    public void setCompetition_instructions(String competition_instructions) {
        this.competition_instructions = competition_instructions;
    }

    public String getCompetitionBanner() {
        return competitionBanner;
    }

    public void setCompetitionBanner(String competitionBanner) {
        this.competitionBanner = competitionBanner;
    }

    @Override
    public String toString() {
        return "Competition{" +
                "_id='" + _id + '\'' +
                ", competitionTitle='" + competitionTitle + '\'' +
                ", competitionCategory='" + competitionCategory + '\'' +
                ", competitionType='" + competitionType + '\'' +
                ", maxTeamSize=" + maxTeamSize +
                ", competitionDescription='" + competitionDescription + '\'' +
                ", problemStatement='" + problemStatement + '\'' +
                ", startDate=" + startDate +
                ", submissionDeadline=" + submissionDeadline +
                ", competitionStatus='" + competitionStatus + '\'' +
                ", countdownTimerEnabled=" + countdownTimerEnabled +
                ", competition_instructions='" + competition_instructions + '\'' +
                ", competitionBanner='" + competitionBanner + '\'' +
                '}';
    }
}