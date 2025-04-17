package com.example.cosmoconnect.Services;

import com.example.cosmoconnect.Entity.Learning;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LearningRepo extends MongoRepository<Learning,String> {
}
