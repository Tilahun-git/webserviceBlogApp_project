package com.blogApplication.blogApp.repositories;

import com.blogApplication.blogApp.entities.Comment;
import com.blogApplication.blogApp.entities.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepo extends JpaRepository<Comment, Long> {

//    List<Comment> findByPostId(long postId);
//
//
//    Page<Comment> findByPost(Post post, Pageable pageable);
//
//    Page<Comment> findByPostAndContentContainingIgnoreCase(
//            Post post,
//            String keyword,
//            Pageable pageable
//    );

    List<Comment> findByPostId(Long postId);
    List<Comment> findByUserId(Long userId);

    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId ORDER BY c.createdAt DESC")
    List<Comment> findByPostIdOrderByCreatedAtDesc(@Param("postId") long postId);

}
