package com.example.cosmoconnect.Repo;

import com.example.cosmoconnect.Entity.Competition;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompetitionRepo extends MongoRepository<Competition, String> {

}