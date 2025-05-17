package com.example.cosmoconnect.repository;

import com.example.cosmoconnect.model.Competition;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompetitionRepo extends MongoRepository<Competition, String> {

}