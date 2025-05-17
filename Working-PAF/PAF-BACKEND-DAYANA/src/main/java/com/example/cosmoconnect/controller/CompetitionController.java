package com.example.cosmoconnect.controller;

import com.example.cosmoconnect.model.Competition;
import com.example.cosmoconnect.service.CompetitionService;
import com.example.cosmoconnect.service.CompetitionFileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/v1/competitions")
public class CompetitionController {
    private static final Logger logger = LoggerFactory.getLogger(CompetitionController.class);

    @Autowired
    private CompetitionService competitionService;

    @Autowired
    private CompetitionFileStorageService competitionFileStorageService;

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addCompetition(
            @RequestParam("competitionTitle") String competitionTitle,
            @RequestParam("competitionCategory") String competitionCategory,
            @RequestParam("competitionType") String competitionType,
            @RequestParam("maxTeamSize") Integer maxTeamSize,
            @RequestParam("competitionDescription") String competitionDescription,
            @RequestParam("problemStatement") String problemStatement,
            @RequestParam("startDate") String startDate,
            @RequestParam("submissionDeadline") String submissionDeadline,
            @RequestParam("competitionStatus") String competitionStatus,
            @RequestParam("countdownTimerEnabled") Boolean countdownTimerEnabled,
            @RequestParam(value = "competitionBanner", required = false) MultipartFile competitionBanner,
            @RequestParam(value = "competitionInstructions", required = false) MultipartFile competitionInstructions) {
        try {
            logger.info("Received request to add new competition: {}", competitionTitle);
            Competition competition = new Competition();
            competition.setCompetitionTitle(competitionTitle);
            competition.setCompetitionCategory(competitionCategory);
            competition.setCompetitionType(competitionType);
            competition.setMaxTeamSize(maxTeamSize);
            competition.setCompetitionDescription(competitionDescription);
            competition.setProblemStatement(problemStatement);
            competition.setStartDate(java.time.LocalDate.parse(startDate));
            competition.setSubmissionDeadline(java.time.LocalDate.parse(submissionDeadline));
            competition.setCompetitionStatus(competitionStatus);
            competition.setCountdownTimerEnabled(countdownTimerEnabled);

            if (competitionBanner != null && !competitionBanner.isEmpty()) {
                String bannerFilename = competitionFileStorageService.storeFile(competitionBanner);
                competition.setCompetitionBanner("/api/competitions/files/" + bannerFilename.replaceFirst("^competitions/", ""));
            }

            if (competitionInstructions != null && !competitionInstructions.isEmpty()) {
                String instructionsFilename = competitionFileStorageService.storeFile(competitionInstructions);
                competition.setCompetition_instructions("/api/competitions/files/" + instructionsFilename.replaceFirst("^competitions/", ""));
            }

            Competition savedCompetition = competitionService.saveorUpdate(competition);
            return new ResponseEntity<>(savedCompetition, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error creating competition: {}", e.getMessage(), e);
            return new ResponseEntity<>("Error creating competition: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<?> getCompetitions() {
        try {
            logger.info("Received request to get all competitions");
            List<Competition> competitions = competitionService.listAll();
            return new ResponseEntity<>(competitions, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching competitions: {}", e.getMessage(), e);
            return new ResponseEntity<>("Error fetching competitions: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/edit/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateCompetition(
            @PathVariable(name = "id") String id,
            @RequestParam("competitionTitle") String competitionTitle,
            @RequestParam("competitionCategory") String competitionCategory,
            @RequestParam("competitionType") String competitionType,
            @RequestParam("maxTeamSize") Integer maxTeamSize,
            @RequestParam("competitionDescription") String competitionDescription,
            @RequestParam("problemStatement") String problemStatement,
            @RequestParam("startDate") String startDate,
            @RequestParam("submissionDeadline") String submissionDeadline,
            @RequestParam("competitionStatus") String competitionStatus,
            @RequestParam("countdownTimerEnabled") Boolean countdownTimerEnabled,
            @RequestParam(value = "competitionBanner", required = false) MultipartFile competitionBanner,
            @RequestParam(value = "competitionInstructions", required = false) MultipartFile competitionInstructions) {
        try {
            logger.info("Received request to update competition with id: {}", id);
            Competition competition = competitionService.getCompetitionByID(id);
            
            competition.setCompetitionTitle(competitionTitle);
            competition.setCompetitionCategory(competitionCategory);
            competition.setCompetitionType(competitionType);
            competition.setMaxTeamSize(maxTeamSize);
            competition.setCompetitionDescription(competitionDescription);
            competition.setProblemStatement(problemStatement);
            competition.setStartDate(java.time.LocalDate.parse(startDate));
            competition.setSubmissionDeadline(java.time.LocalDate.parse(submissionDeadline));
            competition.setCompetitionStatus(competitionStatus);
            competition.setCountdownTimerEnabled(countdownTimerEnabled);

            if (competitionBanner != null && !competitionBanner.isEmpty()) {
                if (competition.getCompetitionBanner() != null) {
                    String oldBanner = competition.getCompetitionBanner().replace("/api/competitions/files/", "competitions/");
                    competitionFileStorageService.deleteFile(oldBanner);
                }
                String bannerFilename = competitionFileStorageService.storeFile(competitionBanner);
                competition.setCompetitionBanner("/api/competitions/files/" + bannerFilename.replaceFirst("^competitions/", ""));
            }

            if (competitionInstructions != null && !competitionInstructions.isEmpty()) {
                if (competition.getCompetition_instructions() != null) {
                    String oldInstructions = competition.getCompetition_instructions().replace("/api/competitions/files/", "competitions/");
                    competitionFileStorageService.deleteFile(oldInstructions);
                }
                String instructionsFilename = competitionFileStorageService.storeFile(competitionInstructions);
                competition.setCompetition_instructions("/api/competitions/files/" + instructionsFilename.replaceFirst("^competitions/", ""));
            }

            Competition updatedCompetition = competitionService.saveorUpdate(competition);
            return new ResponseEntity<>(updatedCompetition, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error updating competition: {}", e.getMessage(), e);
            return new ResponseEntity<>("Error updating competition: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCompetition(@PathVariable("id") String id) {
        try {
            logger.info("Received request to delete competition with id: {}", id);
            Competition competition = competitionService.getCompetitionByID(id);

            if (competition.getCompetitionBanner() != null) {
                String oldBanner = competition.getCompetitionBanner().replace("/api/competitions/files/", "competitions/");
                competitionFileStorageService.deleteFile(oldBanner);
            }
            if (competition.getCompetition_instructions() != null) {
                String oldInstructions = competition.getCompetition_instructions().replace("/api/competitions/files/", "competitions/");
                competitionFileStorageService.deleteFile(oldInstructions);
            }

            competitionService.deleteCompetition(id);
            return new ResponseEntity<>("Competition deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error deleting competition: {}", e.getMessage(), e);
            return new ResponseEntity<>("Error deleting competition: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCompetitionById(@PathVariable(name = "id") String id) {
        try {
            logger.info("Received request to get competition with id: {}", id);
            Competition competition = competitionService.getCompetitionByID(id);
            return new ResponseEntity<>(competition, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching competition: {}", e.getMessage(), e);
            return new ResponseEntity<>("Error fetching competition: " + e.getMessage(),
                    HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        return competitionFileStorageService.loadFile("competitions/" + filename);
    }
}