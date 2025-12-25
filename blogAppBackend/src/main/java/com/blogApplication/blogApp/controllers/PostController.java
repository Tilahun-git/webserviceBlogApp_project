package com.blogApplication.blogApp.controllers;

import com.blogApplication.blogApp.dto.postDto.PostDto;
import com.blogApplication.blogApp.services.servicesImpl.PostServiceImpl;
import com.blogApplication.blogApp.services.servicesImpl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostServiceImpl postService;
    @Autowired
    private UserServiceImpl userServiceImpl;

    // GET METHOD TO RETRIEVE ALL POSTS

    @GetMapping("/public")
    public ResponseEntity <List<PostDto>> getAllPosts() {
        List<PostDto> postsDto = postService.getAllPosts();

        return ResponseEntity.ok(postsDto);
    }

    //GET METHOD TO RETIEVE SINGLE POST

    @GetMapping("post/public/{id}")
    public ResponseEntity<PostDto> getPostById(@PathVariable long id) {
        return  ResponseEntity.ok( postService.getPostById(id));
    }

    //POST METHOD TO ADD POST

    @PostMapping("/user/{userId}/category/{categoryId}/posts")
    public ResponseEntity<?> addPost(@RequestPart PostDto postDto, @RequestPart MultipartFile imageFile ,@PathVariable long userId, @PathVariable long categoryId) throws IOException {
        return new ResponseEntity<PostDto>(postService.createPost(postDto,imageFile,userId,categoryId), HttpStatus.CREATED);
    }

    //PUT METHOD TO UPDATE THE EXISTING POST


    @PutMapping("/post/{postId}/update")
    public ResponseEntity<?> updatePost(@RequestPart PostDto postDto, @RequestPart MultipartFile imageFile, @PathVariable long postId) throws IOException {
        PostDto postDto1 = postService.updatePost(postDto,imageFile,postId);

        if(postDto1 != null)
            return ResponseEntity.ok(Map.of("message", "Post updated successfully", "data", postDto1));
        else
            return ResponseEntity.notFound().build();

    }

    //DELETE METHOD TO DELETE SINGLE POST

    @DeleteMapping("/post/user/{id}")
    public ResponseEntity<?> deletePost(@PathVariable long id) {
        PostDto postDto2= postService.deletePostById(id);
        if(postDto2 != null)
            return ResponseEntity.ok(Map.of("message", "User deleted successfully", "data", postDto2));
        else
            return ResponseEntity.notFound().build();
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

    // GET METHOD TO GET POSTS USING SEARCH QUERY

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
                :Sort.by(sortBy).descending();
        Page<PostDto> posts = postService.searchPosts(keyword, pageNumber, pageSize, sort);

        return ResponseEntity.ok(posts);
    }




}
