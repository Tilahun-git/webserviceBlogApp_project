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

import java.util.HashMap;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostServiceImpl postService;

    // GET METHOD TO RETRIEVE ALL POSTS

    @GetMapping("/public")
    public ResponseEntity<Map<String, Object>> getAllPosts(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
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

    //POST METHOD TO ADD POST

    @PostMapping("/user/{userId}/category/{categoryId}/posts")
    public ResponseEntity<PostDto> addPost(@RequestPart PostDto postDto,@RequestPart MultipartFile imageFile, @PathVariable long userId, @PathVariable long categoryId) throws IOException {
        return new ResponseEntity<PostDto>(postService.createPost(postDto,imageFile, userId, categoryId), HttpStatus.CREATED);

    }

        //PUT METHOD TO UPDATE THE EXISTING POST

        @PutMapping("post/user/{id}")
        public ResponseEntity<?> updatePost ( @PathVariable long id, @RequestPart PostDto postDto ,@RequestPart MultipartFile imageFile) throws IOException {
            postService.updatePost(postDto,imageFile, id);
            return ResponseEntity.ok("Post updated successfully");
        }

        //DELETE METHOD TO DELETE SINGLE POST

        @DeleteMapping("/post/user/{id}")
        public ResponseEntity<?> deletePost ( @PathVariable long id){
            postService.deletePostById(id);
            return ResponseEntity.ok("User deleted successfully");
        }


        // GET METHOD TO FIND POSTS BY SPECIFIC USER

        @GetMapping("/public/user/{userId}/posts")
        public ResponseEntity<Page<PostDto>> getPostsByUser (
        @PathVariable("userId") long userId,
        @RequestParam(defaultValue = "0") int pageNumber,
        @RequestParam(defaultValue = "10") int pageSize,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String sortDir
    ){

            Sort sort = sortDir.equalsIgnoreCase("asc")
                    ? Sort.by(sortBy).ascending()
                    : Sort.by(sortBy).descending();
            Page<PostDto> postsByUser = postService.getPostsByUser(userId, pageNumber, pageSize, sort);
            return ResponseEntity.ok(postsByUser);
        }

        // GET METHOD TO FIND POSTS BY SPECIFIC CATEGORY

        @GetMapping("/public/category/{categoryId}/posts")

        public ResponseEntity<Map<String, Object>> getPostsByCategory (
        @PathVariable("categoryId") long categoryId,
        @RequestParam(defaultValue = "0") int pageNumber,
        @RequestParam(defaultValue = "10") int pageSize,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String sortDir
    ){
            Sort sort = sortDir.equalsIgnoreCase("asc")
                    ? Sort.by(sortBy).ascending()
                    : Sort.by(sortBy).descending();
            Page<PostDto> page = postService.getPostsByCategory(categoryId, pageNumber, pageSize, sort);
            Map<String, Object> response = new HashMap<>();
            response.put("posts", page.getContent());
            response.put("currentPage", page.getNumber());
            response.put("totalItems", page.getTotalElements());
            response.put("totalPages", page.getTotalPages());

            return ResponseEntity.ok(response);
        }

        // GET METHOD TO GET POSTS USING SEARCH QUERY

        @GetMapping("/public/search")
        public ResponseEntity<Page<PostDto>> searchPosts (
                @RequestParam String keyword,
                @RequestParam(defaultValue = "0") int pageNumber,
                @RequestParam(defaultValue = "10") int pageSize,
                @RequestParam(defaultValue = "createdAt") String sortBy,
                @RequestParam(defaultValue = "desc") String sortDir
    ){

            Sort sort = sortDir.equalsIgnoreCase("asc")
                    ? Sort.by(sortBy).ascending()
                    : Sort.by(sortBy).descending();
            Page<PostDto> posts = postService.searchPosts(keyword, pageNumber, pageSize, sort);

            return ResponseEntity.ok(posts);
        }


    }
