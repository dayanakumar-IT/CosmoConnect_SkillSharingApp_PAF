package com.example.cosmoconnect.service;

import com.example.cosmoconnect.model.Competition;
import com.example.cosmoconnect.repository.CompetitionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import com.example.cosmoconnect.repository.UserRepository;
import com.example.cosmoconnect.model.User;
import com.example.cosmoconnect.service.NotificationService;

@Service
public class CompetitionService {
    private static final Logger logger = LoggerFactory.getLogger(CompetitionService.class);

    @Autowired
    private CompetitionRepo competitionRepo;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    public Competition saveorUpdate(Competition competition) {
        try {
            logger.info("Saving or updating competition: {}", competition);
            Competition saved = competitionRepo.save(competition);
            // Notify all users if this is a new competition (no _id before save)
            if (competition.get_id() == null) {
                List<User> allUsers = userRepository.findAll();
                for (User user : allUsers) {
                    notificationService.createNotification(
                        user.getId(),
                        "COMPETITION",
                        "A new competition was added: " + saved.getCompetitionTitle(),
                        "/competitions/" + saved.get_id()
                    );
                }
            }
            return saved;
        } catch (Exception e) {
            logger.error("Error saving competition: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save competition: " + e.getMessage());
        }
    }

    public List<Competition> listAll() {
        try {
            logger.info("Fetching all competitions");
            return competitionRepo.findAll();
        } catch (Exception e) {
            logger.error("Error fetching competitions: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch competitions: " + e.getMessage());
        }
    }

    public Competition getCompetitionByID(String id) {
        try {
            logger.info("Fetching competition with id: {}", id);
            Optional<Competition> competition = competitionRepo.findById(id);
            if (competition.isPresent()) {
                return competition.get();
            }
            throw new RuntimeException("Competition not found with id: " + id);
        } catch (Exception e) {
            logger.error("Error fetching competition: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch competition: " + e.getMessage());
        }
    }

    public void deleteCompetition(String id) {
        try {
            logger.info("Deleting competition with id: {}", id);
            if (!competitionRepo.existsById(id)) {
                throw new RuntimeException("Competition not found with id: " + id);
            }
            competitionRepo.deleteById(id);
        } catch (Exception e) {
            logger.error("Error deleting competition: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete competition: " + e.getMessage());
        }
    }

    public Competition save(Competition competition, MultipartFile competitionFile) throws IOException {
        if (competitionFile != null && !competitionFile.isEmpty()) {
            String fileUrl = fileStorageService.storeFile(competitionFile, "competitions");
            competition.setCompetition_instructions(fileUrl);
        }
        return competitionRepo.save(competition);
    }

    public Competition update(String id, Competition competition, MultipartFile competitionFile) throws IOException {
        Optional<Competition> opt = competitionRepo.findById(id);
        if (opt.isPresent()) {
            Competition existing = opt.get();
            
            if (competition != null) {
                existing.setCompetitionTitle(competition.getCompetitionTitle());
                existing.setCompetitionDescription(competition.getCompetitionDescription());
                // Add other fields as needed
            }

            if (competitionFile != null && !competitionFile.isEmpty()) {
                String fileUrl = fileStorageService.storeFile(competitionFile, "competitions");
                existing.setCompetition_instructions(fileUrl);
            }

            return competitionRepo.save(existing);
        }
        return null;
    }
} 