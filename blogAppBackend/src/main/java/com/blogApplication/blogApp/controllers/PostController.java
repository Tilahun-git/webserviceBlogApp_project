package com.blogApplication.blogApp.controllers;

import com.blogApplication.blogApp.dto.postDto.PostDto;
import com.blogApplication.blogApp.entities.Post;
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
    public ResponseEntity <List<PostDto>> getAllPosts() {
        List<PostDto> postsDto = postService.getAllPosts();

        return ResponseEntity.ok(postsDto);
    }

    //GET METHOD TO RETRIEVE SINGLE POST

    @GetMapping("post/{id}")
    public ResponseEntity<PostDto> getPostById(@PathVariable long id) {
        return  ResponseEntity.ok( postService.getPostById(id));
    }

    //POST METHOD TO ADD POST

    @PostMapping(value ="/user/{userId}/category/{categoryId}/posts",consumes = "application/json")
    public ResponseEntity<Map<String, Object>> addPost(@RequestBody PostDto postDto, @PathVariable long userId, @PathVariable long categoryId) {

            PostDto createdPost = postService.createPost(postDto, userId, categoryId);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Post created successfully");
            response.put("post", createdPost);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        //PUT METHOD TO UPDATE THE EXISTING POST


        @PutMapping("post/{id}")
        public ResponseEntity<Map<String, Object>> updatePost ( @PathVariable long id, @RequestBody PostDto postDto){

            PostDto updatedPost = postService.updatePost(postDto, id);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Post updated successfully");
            response.put("post", updatedPost);

            return ResponseEntity.ok(response);
        }

        //DELETE  METHOD TO DELETE SINGLE POST
        @DeleteMapping("/post/{id}")
        public ResponseEntity<Map<String, Object>> deletePostById ( @PathVariable long id){
            PostDto deletedPost = postService.deletePost(id);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Post deleted successfully");
            response.put("post", deletedPost);

            return ResponseEntity.ok(response);
        }


        // GET METHOD TO RETRIEVE ALL POSTS OF SINGLE USER

        @GetMapping("/user/{userId}/posts")
        public ResponseEntity<List<PostDto>> getPostsByUser ( @PathVariable long userId){
            List<PostDto> postDtosUser = postService.getAllPostsByUser(userId);
            return new ResponseEntity<List<PostDto>>(postDtosUser, HttpStatus.OK);
        }



        // GET METHOD TO RETRIEVE ALL POSTS OF SINGLE CATEGORY

        @GetMapping("/category/{categoryId}/posts")
        public ResponseEntity<List<PostDto>> getPostsByCategory ( @PathVariable long categoryId){
            List<PostDto> postDtosCategory = postService.getAllPostsByCategory(categoryId);
            return new ResponseEntity<List<PostDto>>(postDtosCategory, HttpStatus.OK);
        }
    }
