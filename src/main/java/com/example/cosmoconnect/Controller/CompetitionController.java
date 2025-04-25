package com.example.cosmoconnect.Controller;

import com.example.cosmoconnect.Entity.Competition;
import com.example.cosmoconnect.Service.CompetitionServices;
import com.example.cosmoconnect.Service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/v1/competition")
public class CompetitionController {

    @Autowired
    private CompetitionServices competitionServices;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> addCompetition(
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
                String bannerFilename = fileStorageService.storeFile(competitionBanner);
                competition.setCompetitionBanner(bannerFilename);
            }

            if (competitionInstructions != null && !competitionInstructions.isEmpty()) {
                String instructionsFilename = fileStorageService.storeFile(competitionInstructions);
                competition.setCompetition_instructions(instructionsFilename);
            }

            competitionServices.addorUpdate(competition);
            return new ResponseEntity<>(competition.get_id(), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating competition: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/getAll")
    public ResponseEntity<List<Competition>> getCompetitions() {
        try {
            List<Competition> competitions = competitionServices.listAll();
            return new ResponseEntity<>(competitions, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/edit/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Competition> updateCompetition(
            @PathVariable(name = "id") String _id,
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
            Competition competition = competitionServices.getCompetitionByID(_id);
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
                // Delete old banner if exists
                if (competition.getCompetitionBanner() != null) {
                    fileStorageService.deleteFile(competition.getCompetitionBanner());
                }
                String bannerFilename = fileStorageService.storeFile(competitionBanner);
                competition.setCompetitionBanner(bannerFilename);
            }

            if (competitionInstructions != null && !competitionInstructions.isEmpty()) {
                // Delete old instructions if exists
                if (competition.getCompetition_instructions() != null) {
                    fileStorageService.deleteFile(competition.getCompetition_instructions());
                }
                String instructionsFilename = fileStorageService.storeFile(competitionInstructions);
                competition.setCompetition_instructions(instructionsFilename);
            }

            competitionServices.addorUpdate(competition);
            return new ResponseEntity<>(competition, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCompetition(@PathVariable("id") String _id) {
        try {
            Competition competition = competitionServices.getCompetitionByID(_id);

            // Delete associated files
            if (competition.getCompetitionBanner() != null) {
                fileStorageService.deleteFile(competition.getCompetitionBanner());
            }
            if (competition.getCompetition_instructions() != null) {
                fileStorageService.deleteFile(competition.getCompetition_instructions());
            }

            competitionServices.deleteCompetition(_id);
            return new ResponseEntity<>("Competition deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting competition: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/competition/{id}")
    public ResponseEntity<Competition> getCompetitionById(@PathVariable(name = "id") String competitionId) {
        try {
            Competition competition = competitionServices.getCompetitionByID(competitionId);
            return new ResponseEntity<>(competition, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path file = fileStorageService.loadFile(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}