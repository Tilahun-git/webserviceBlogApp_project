package com.blogApplication.blogApp.repositories;

import com.blogApplication.blogApp.entities.Category;
import com.blogApplication.blogApp.entities.Post;
import com.blogApplication.blogApp.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface PostRepo extends JpaRepository<Post, Long> {
    Page<Post> findAllByAuthor(User author, Pageable sort);
    Page<Post> findAllByCategory(Category category, Pageable  pageable);

    Page<Post> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
            String title,
            String content,
            Pageable pageable
    );


    @Query("SELECT COUNT(l) FROM Like l WHERE l.post.id = :postId")
    Long countLikesByPostId(@Param("postId") Long postId);

}
