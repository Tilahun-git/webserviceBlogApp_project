package com.blogApplication.blogApp.controllers;

import com.blogApplication.blogApp.dto.postDto.PostDto;
import com.blogApplication.blogApp.payloads.ApiResponse;
import com.blogApplication.blogApp.services.servicesContract.PostServiceContract;
import com.blogApplication.blogApp.services.servicesImpl.PostServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
@RequiredArgsConstructor
public class PostController {

    private final PostServiceContract postService;

    // GET METHOD TO RETRIEVE ALL POSTs

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<List<PostDto>>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        List<PostDto> posts = postService.getAllPosts(pageable, search);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Posts fetched successfully", posts)
        );
    }


    //GET METHOD TO RETRIEVE SINGLE POST
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PostDto>> getPostById(@PathVariable long id) {
        PostDto post = postService.getPostById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Post fetched successfully", post)
        );
    }

    // POST METHOD TO ADD POST WITH MEDIA (IMAGE/VIDEO)
    @PostMapping("/createPost/{categoryId}")
    public ResponseEntity<ApiResponse<PostDto>> createPost(
            @RequestPart("post") PostDto postDto,
            @RequestPart("file") MultipartFile mediaFile,
            @PathVariable long categoryId
    ) throws IOException {
        PostDto createdPost = postService.createPost(postDto, mediaFile, categoryId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Post created successfully", createdPost));
    }
    @PutMapping("/{postId}/update")
    public ResponseEntity<ApiResponse<PostDto>> updatePost(
            @RequestPart("post") PostDto postDto,
            @RequestPart(required = false) MultipartFile mediaFile,
            @PathVariable Long postId
    ) throws IOException {
        PostDto updatedPost = postService.updatePost(postDto, mediaFile, postId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Post updated successfully", updatedPost));
    }

    //TOGGLE THE LIKE OF SPECIFIC POST

    @PutMapping("/public/{postId}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable long postId,
            @RequestParam long userId
    ) {
        boolean liked = postService.toggleLike(postId, userId);

        PostDto updatedPost = postService.getPostById(postId);
        Map<String, Object> response = new HashMap<>();
        response.put("post", updatedPost);
        response.put("likedByCurrentUser", liked);

        return ResponseEntity.ok(response);
    }


    //DELETE METHOD TO DELETE SINGLE POST

    @DeleteMapping("/post/{id}")
    public ResponseEntity<ApiResponse<PostDto>> deletePost(@PathVariable Long id) throws IOException {
        PostDto deletedPost = postService.deletePostById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Post deleted successfully", deletedPost)
        );
    }


    @GetMapping("/user/posts")
    public ResponseEntity<ApiResponse<List<PostDto>>> getUserPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        List<PostDto> posts = postService.getPostsByUser(pageable);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Posts fetched successfully for user", posts)
        );
    }




    // GET METHOD TO FIND POSTS BY SPECIFIC CATEGORY
    @GetMapping("/{categoryId}/posts")
    public ResponseEntity<ApiResponse<List<PostDto>>> getPostsByCategory(
            @PathVariable long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        List<PostDto> posts = postService.getPostsByCategory(categoryId, pageable);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Posts fetched successfully for category", posts)
        );
    }


    // GET METHOD TO SEARCH POSTS
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<PostDto>>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        List<PostDto> posts = postService.searchPosts(keyword, pageable);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Search results fetched successfully", posts)
        );
    }



}

