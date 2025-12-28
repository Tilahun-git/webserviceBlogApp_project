package com.blogApplication.blogApp.controllers;

import com.blogApplication.blogApp.dto.postDto.PostDto;
import com.blogApplication.blogApp.services.servicesImpl.PostServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostServiceImpl postService;



    // GET METHOD TO RETRIEVE SINGLE POST

    @GetMapping("/public")
    public ResponseEntity<Map<String, Object>> getAllPosts(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "4") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search // optional search by title/content
    ) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Page<PostDto> page = postService.getAllPosts(pageNumber, pageSize, sort, search);

        Map<String, Object> response = new HashMap<>();
        response.put("posts", page.getContent());
        response.put("currentPage", page.getNumber());
        response.put("totalItems", page.getTotalElements());
        response.put("totalPages", page.getTotalPages());

        return ResponseEntity.ok(response);
    }


    //GET METHOD TO RETRIEVE SINGLE POST

    @GetMapping("post/public/{id}")
    public ResponseEntity<PostDto> getPostById(@PathVariable long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    // POST METHOD TO ADD POST WITH MEDIA (IMAGE/VIDEO)
    @PostMapping("/user/{userId}/category/{categoryId}/posts")
    public ResponseEntity<?> addPost(
            @RequestPart("post") PostDto postDto,
            @RequestPart MultipartFile mediaFile,
            @PathVariable long userId,
            @PathVariable long categoryId
    ) throws IOException {

        PostDto createdPost = postService.createPost(postDto, mediaFile, userId, categoryId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Post created successfully",
                        "data", createdPost
                ));
    }

    // PUT METHOD TO UPDATE POST WITH OPTIONAL MEDIA
    @PutMapping("/post/{postId}/update")
    public ResponseEntity<?> updatePost(
            @RequestPart("post") PostDto postDto,
            @RequestPart MultipartFile mediaFile,
            @PathVariable long postId
    ) throws IOException {

        PostDto updatedPost = postService.updatePost(postDto, mediaFile, postId);
        return ResponseEntity.ok(Map.of(
                "message", "Post updated successfully",
                "data", updatedPost
        ));
    }



    //TOGGLE THE LIKE OF SPECIFIC POST

    @PutMapping("/public/{postId}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable long postId,
            @RequestParam long userId
    ) {
        boolean liked = postService.toggleLike(postId, userId);

        PostDto updatedPost = postService.getPostById(postId); // existing method
        Map<String, Object> response = new HashMap<>();
        response.put("post", updatedPost);
        response.put("likedByCurrentUser", liked);

        return ResponseEntity.ok(response);
    }


    //DELETE METHOD TO DELETE SINGLE POST
    @DeleteMapping("/post/user/{id}")
    public ResponseEntity<?> deletePost(@PathVariable long id) throws IOException {
        PostDto deletedPost = postService.deletePostById(id);
        return ResponseEntity.ok(Map.of(
                "message", "Post deleted successfully",
                "data", deletedPost
        ));
    }

    // GET METHOD TO FIND POSTS BY SPECIFIC USER
    @GetMapping("/public/user/{userId}/posts")
    public ResponseEntity<Page<PostDto>> getPostsByUser(
            @PathVariable("userId") long userId,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Page<PostDto> postsByUser = postService.getPostsByUser(userId, pageNumber, pageSize, sort);
        return ResponseEntity.ok(postsByUser);
    }

    // GET METHOD TO FIND POSTS BY SPECIFIC CATEGORY
    @GetMapping("/public/category/{categoryId}/posts")
    public ResponseEntity<Page<PostDto>> getPostsByCategory(

            @PathVariable("categoryId") long categoryId,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Page<PostDto> postsByCategory = postService.getPostsByCategory(categoryId, pageNumber, pageSize, sort);
        return ResponseEntity.ok(postsByCategory);

    }

    // GET METHOD TO SEARCH POSTS
    @GetMapping("/public/search")
    public ResponseEntity<Page<PostDto>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Page<PostDto> posts = postService.searchPosts(keyword, pageNumber, pageSize, sort);
        return ResponseEntity.ok(posts);
    }


}

