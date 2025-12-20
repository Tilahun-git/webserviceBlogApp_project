package com.blogApplication.blogApp.controllers;

import com.blogApplication.blogApp.dto.postDto.PostDto;
import com.blogApplication.blogApp.entities.Post;
import com.blogApplication.blogApp.services.servicesImpl.PostServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostServiceImpl postService;

    // GET METHOD TO RETRIEVE ALL POSTS

    @GetMapping("/posts")
    public ResponseEntity <List<PostDto>> getAllPosts() {
        List<PostDto> postsDto = postService.getAllPosts();

        return ResponseEntity.ok(postsDto);
    }

    //GET METHOD TO RETIEVE SINGLE POST

    @GetMapping("post/{id}")
    public ResponseEntity<PostDto> getPostById(@PathVariable long id) {
        return  ResponseEntity.ok( postService.getPost(id));
    }

    //POST METHOD TO ADD POST

    @PostMapping("/post/addPost")
    public ResponseEntity<PostDto> addPost(@RequestBody PostDto postDto) {
        return new ResponseEntity<PostDto>(postService.createPost(postDto), HttpStatus.CREATED);
    }

    //PUT METHOD TO UPDATE THE EXISTING POST

    @PutMapping("post/{id}")
    public ResponseEntity<String> updatePost(@PathVariable long id, @RequestBody PostDto postDto) {
        postService.updatePost(id, postDto);
        return ResponseEntity.ok("Post updated successfully");
    }
}
