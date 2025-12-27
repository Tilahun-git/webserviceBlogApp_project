package com.blogApplication.blogApp.repositories;


import com.blogApplication.blogApp.entities.Like;
import com.blogApplication.blogApp.entities.Post;
import com.blogApplication.blogApp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LikeRepo extends JpaRepository<Like, Long> {
    Optional<Like> findByPostAndUser(Post post, User user);
    int countByPost(Post post);
}
