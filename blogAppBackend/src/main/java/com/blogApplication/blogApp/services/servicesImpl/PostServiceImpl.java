package com.blogApplication.blogApp.services.servicesImpl;

import com.blogApplication.blogApp.dto.postDto.PostResponseDto;
import com.blogApplication.blogApp.entities.Category;
import com.blogApplication.blogApp.entities.Post;
import com.blogApplication.blogApp.entities.User;
import com.blogApplication.blogApp.exceptions.ResourceNotFoundException;
import com.blogApplication.blogApp.repositories.CategoryRepo;
import com.blogApplication.blogApp.repositories.PostRepo;
import com.blogApplication.blogApp.repositories.UserRepo;
import com.blogApplication.blogApp.services.servicesContract.PostServiceContract;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostServiceContract {

    private  final PostRepo postRepo;
    private final UserRepo userRepo;
    private final CategoryRepo categoryRepo;
    private final ModelMapper modelMapper;



    @Override
    public  List<PostResponseDto> getAllPosts() {
        List<Post> posts = postRepo.findAll();
        if (posts.isEmpty()) {
            throw new ResourceNotFoundException("Post","There is no post found",null);
        }
        return posts.stream().map(this::postToPostDto).collect(Collectors.toList());
    }
    @Override
    public PostResponseDto getPost(long id) {
        Post foundPost = postRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Post","id",id));
        return postToPostDto(foundPost);
    }

    @Override
    public PostResponseDto createPost(PostResponseDto postDto, long authorId, long categoryId) {


        User user = userRepo.findById(authorId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User","id",authorId));

        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category","id",categoryId));
        Post postCreated = postDtoToPost(postDto);
        postCreated.setAuthor(user);
        postCreated.setCategory(category);
        postCreated.setImageName("post.png");
        Post savedPost = postRepo.save(postCreated);
        PostResponseDto responseDto = postToPostDto(savedPost);
        responseDto.setAuthorId(savedPost.getAuthor().getId());
        responseDto.setCategoryId(savedPost.getCategory().getId());
        return responseDto;

    }

    @Override
    public PostResponseDto updatePost(PostResponseDto postDto, long id) {
        Post existingPost = postRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Post","id",id));
        existingPost.setTitle(postDto.getTitle());
        existingPost.setContent(postDto.getContent());
        postRepo.save(existingPost);
        return postToPostDto(existingPost);    }

    @Override
    public PostResponseDto deletePostById(long id) {
        Post deletedPost = postRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Post","id",id));
        postRepo.delete(deletedPost);
        return postToPostDto(deletedPost);
    }


    // method to get all posts in authored by a certain user

    @Override
    public List<PostResponseDto> getAllPostsByUser(long id) {

        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User","id",id));

        List<Post> posts = postRepo.getAllByAuthor(user);

        return posts.stream()
                .map(this::postToPostDto)
                .collect(Collectors.toList());
    }

    // method to get all posts in a certain category
    @Override
    public List<PostResponseDto> getAllPostsByCategory(long id) {
        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category","id",id));

        List<Post> posts = postRepo.getAllByCategory(category);

        return posts.stream()
                .map(this::postToPostDto)
                .collect(Collectors.toList());
    }

    // method to search posts using keyword
    @Override
    public List<PostResponseDto> searchPosts(String keyword) {
        return List.of();
    }


    //convert post -> PostDto
    private PostResponseDto postToPostDto(Post post) {


        return modelMapper.map(post, PostResponseDto.class);
    }

    //convert PostDto -> Post

    private Post postDtoToPost(PostResponseDto postDto) {
        return modelMapper.map(postDto, Post.class);
    }



}
