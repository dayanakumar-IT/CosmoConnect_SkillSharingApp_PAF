package com.example.cosmoconnect.repository;

import com.example.cosmoconnect.model.Comment;
import com.example.cosmoconnect.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    @Query("{ 'post.$id' : ?0 }")
    List<Comment> findByPostIdOrderByCreatedAtDesc(String postId);
    
    List<Comment> findByAuthorIdOrderByCreatedAtDesc(String authorId);
    
    void deleteByPostId(String postId);
} 