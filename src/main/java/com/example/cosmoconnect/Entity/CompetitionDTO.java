package com.example.cosmoconnect.Entity;

import java.time.LocalDate;

/**
 * Data Transfer Object for Competition
 * Used to transfer competition data without binary file content
 */
public class CompetitionDTO {
    private String _id;
    private String competitionTitle;
    private String competitionCategory;
    private String competitionType;
    private Integer maxTeamSize;
    private String competitionDescription;
    private String problemStatement;
    private LocalDate startDate;
    private LocalDate submissionDeadline;
    private String competitionStatus;
    private Boolean countdownTimerEnabled;
    private String competition_instructions; // PDF URL
    private String competitionBanner; // Image URL

    public CompetitionDTO() {
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
        return "CompetitionDTO{" +
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