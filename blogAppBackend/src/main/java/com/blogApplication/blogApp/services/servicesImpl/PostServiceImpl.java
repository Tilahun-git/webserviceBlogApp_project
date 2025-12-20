package com.blogApplication.blogApp.services.servicesImpl;

import com.blogApplication.blogApp.dto.postDto.PostDto;
import com.blogApplication.blogApp.entities.Category;
import com.blogApplication.blogApp.entities.Post;
import com.blogApplication.blogApp.entities.User;
import com.blogApplication.blogApp.exceptions.ResourceNotFoundException;
import com.blogApplication.blogApp.repositories.CategoryRepo;
import com.blogApplication.blogApp.repositories.PostRepo;
import com.blogApplication.blogApp.repositories.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl {

    private  final PostRepo postRepo;
    private final UserRepo userRepo;
    private final CategoryRepo categoryRepo;



    public  List<PostDto> getAllPosts() {
        List<Post> posts = postRepo.findAll();
        if (posts.isEmpty()) {
            throw new ResourceNotFoundException("Post","There is no post found",null);
        }
        return posts.stream().map(this::postToPostDto).collect(Collectors.toList());
    }

    public PostDto getPost(long id) {
        Post foundPost = postRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Post","id",id));
        return postToPostDto(foundPost);
    }


    public PostDto createPost(PostDto postDto) {


        User user = userRepo.findByUsername(postDto.getAuthor())
                .orElseThrow(() ->
                        new RuntimeException("User not found with username: " + postDto.getAuthor()));

        Category category = categoryRepo.findById(postDto.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found with id: " + postDto.getCategoryId()));
        Post postCreated = postDtoToPost(postDto);
        postCreated.setAuthor(user);
        postCreated.setCategory(category);
        Post savedPost = postRepo.save(postCreated);
        
        return postToPostDto(savedPost);
    }

    public PostDto updatePost(long id, PostDto postDto) {
        Post existingPost = postRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Post","id",id));
        existingPost.setTitle(postDto.getTitle());
        existingPost.setContent(postDto.getContent());
        postRepo.save(existingPost);
        return postToPostDto(existingPost);
    }






    //convert post to PostDto
    public PostDto postToPostDto(Post post) {
        PostDto postDto = new PostDto();
        postDto.setId(post.getId());
        postDto.setTitle(post.getTitle());
        postDto.setContent(post.getContent());
        postDto.setAuthor(post.getAuthor().getUsername());
        postDto.setCategoryId(post.getCategory().getId());
        return postDto;

    }


    //convert PostDto to Post
    public Post postDtoToPost(PostDto postDto) {
        Post post = new Post();
        post.setId(postDto.getId());
        post.setTitle(postDto.getTitle());
        post.setContent(postDto.getContent());
        return post;
    }


}
