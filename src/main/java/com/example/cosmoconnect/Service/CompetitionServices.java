package com.example.cosmoconnect.Service;

import com.example.cosmoconnect.Entity.Competition;
import com.example.cosmoconnect.Repo.CompetitionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CompetitionServices {
    @Autowired
    private CompetitionRepo repo;

    public void addorUpdate(Competition competition) {

        repo.save(competition);
    }

    public List<Competition> listAll(){
        return repo.findAll();
    }

    public void deleteCompetition(String id) {
        repo.deleteById(id);
    }

    public Competition getCompetitionByID(String competitionid) {
        Optional<Competition> result = repo.findById(competitionid);
        if(result.isPresent()) {
            return result.get();
        } else {
            throw new RuntimeException("Competition not found with ID: " + competitionid);
        }
    }
}