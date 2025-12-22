package com.blogApplication.blogApp.controllers;

import com.blogApplication.blogApp.dto.postDto.PostResponseDto;
import com.blogApplication.blogApp.services.servicesImpl.PostServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostServiceImpl postService;

    // GET METHOD TO RETRIEVE ALL POSTS

    @GetMapping("/posts")
    public ResponseEntity <List<PostResponseDto>> getAllPosts() {
        List<PostResponseDto> postsDto = postService.getAllPosts();

        return ResponseEntity.ok(postsDto);
    }

    //GET METHOD TO RETRIEVE SINGLE POST

    @GetMapping("post/{id}")
    public ResponseEntity<PostResponseDto> getPostById(@PathVariable long id) {
        return  ResponseEntity.ok( postService.getPost(id));
    }

    //POST METHOD TO ADD POST

    @PostMapping(value ="/user/{userId}/category/{categoryId}/posts",consumes = "application/json")
    public ResponseEntity<Map<String, Object>> addPost(@RequestBody PostResponseDto postDto, @PathVariable long userId, @PathVariable long categoryId) {
        PostResponseDto createdPost = postService.createPost(postDto, userId, categoryId);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Post created successfully");
        response.put("post", createdPost);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    //PUT METHOD TO UPDATE THE EXISTING POST

    @PutMapping("post/{id}")
    public ResponseEntity<Map<String,Object>> updatePost(@PathVariable long id, @RequestBody PostResponseDto postDto) {

        PostResponseDto updatedPost = postService.updatePost(postDto,id);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Post updated successfully");
        response.put("post", updatedPost);

        return ResponseEntity.ok(response);
    }

    //DELETE  METHOD TO DELETE SINGLE POST
    @DeleteMapping("/post/{id}")
    public ResponseEntity<Map<String, Object>> deletePost(@PathVariable long id) {
        PostResponseDto deletedPost = postService.deletePostById(id);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Post deleted successfully");
        response.put("post", deletedPost);

        return ResponseEntity.ok(response);
    }


    // GET METHOD TO RETRIEVE ALL POSTS OF SINGLE USER

    @GetMapping("/user/{userId}/posts")
    public ResponseEntity<List<PostResponseDto>> getPostsByUser(@PathVariable long userId) {
        List<PostResponseDto> postDtosUser = postService.getAllPostsByUser(userId);
        return new ResponseEntity<List<PostResponseDto>>(postDtosUser,HttpStatus.OK);
    }

    // GET METHOD TO RETRIEVE ALL POSTS OF SINGLE CATEGORY

    @GetMapping("/category/{categoryId}/posts")
    public ResponseEntity<List<PostResponseDto>> getPostsByCategory(@PathVariable long categoryId) {
        List<PostResponseDto> postDtosCategory = postService.getAllPostsByCategory(categoryId);
        return new ResponseEntity<List<PostResponseDto>>(postDtosCategory,HttpStatus.OK);
    }
}
