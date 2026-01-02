package com.blogApplication.blogApp.repositories;


import com.blogApplication.blogApp.entities.Like;
import com.blogApplication.blogApp.entities.Post;
import com.blogApplication.blogApp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface LikeRepo extends JpaRepository<Like, Long> {
    Optional<Like> findByPostIdAndUserId(Long postId, Long userId);

    @Query("SELECT COUNT(l) FROM Like l WHERE l.post.id = :postId")
    Long countByPostId(@Param("postId") Long postId);

    boolean existsByPostIdAndUserId(Long postId, Long userId);
}
