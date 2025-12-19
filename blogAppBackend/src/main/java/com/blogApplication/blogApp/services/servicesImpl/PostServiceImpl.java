package com.blogApplication.blogApp.services.servicesImpl;

import com.blogApplication.blogApp.dto.categoryDto.CategoryDto;
import com.blogApplication.blogApp.dto.postDto.PostDto;
import com.blogApplication.blogApp.dto.userDto.UserDto;
import com.blogApplication.blogApp.entities.Category;
import com.blogApplication.blogApp.entities.Post;
import com.blogApplication.blogApp.entities.User;
import com.blogApplication.blogApp.exceptions.ResourceNotFoundException;
import com.blogApplication.blogApp.repositories.CategoryRepo;
import com.blogApplication.blogApp.repositories.PostRepo;
import com.blogApplication.blogApp.repositories.UserRepo;
import com.blogApplication.blogApp.services.servicesContract.PostServiceContract;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostServiceContract {

    private  final PostRepo postRepo;
    private final UserRepo userRepo;
    private final CategoryRepo categoryRepo;


    @Override
    public  List<PostDto> getAllPosts() {
        List<Post> posts = postRepo.findAll();
        if (posts.isEmpty()) {
            throw new ResourceNotFoundException("Post","There is no post found",null);
        }
        return posts.stream().map(this::postToPostDto).collect(Collectors.toList());
    }
    @Override
    public PostDto getPost(long id) {
        Post foundPost = postRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Post","id",id));
        return postToPostDto(foundPost);
    }

    @Override
    public PostDto createPost(PostDto postDto,long authorId, long categoryId) {


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
        return postToPostDto(savedPost);

    }

    @Override
    public PostDto updatePost(PostDto postDto, long id) {
        Post existingPost = postRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Post","id",id));
        existingPost.setTitle(postDto.getTitle());
        existingPost.setContent(postDto.getContent());
        postRepo.save(existingPost);
        return postToPostDto(existingPost);    }

    @Override
    public PostDto deletePostById(long id) {
        Post deletedPost = postRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Post","id",id));
        postRepo.delete(deletedPost);
        return postToPostDto(deletedPost);
    }


    // method to get all posts in authored by a certain user

    @Override
    public List<PostDto> getAllPostsByUser(long id) {

        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User","id",id));

        List<Post> posts = postRepo.getAllByAuthor(user);

        return posts.stream()
                .map(this::postToPostDto)
                .collect(Collectors.toList());
    }

    // method to get all posts in a certain category
    @Override
    public List<PostDto> getAllPostsByCategory(long id) {
        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category","id",id));

        List<Post> posts = postRepo.getAllByCategory(category);

        return posts.stream()
                .map(this::postToPostDto)
                .collect(Collectors.toList());
    }

    // method to search posts using keyword
    @Override
    public List<PostDto> searchPosts(String keyword) {
        return List.of();
    }


    //convert post to PostDto
    public PostDto postToPostDto(Post post) {
        PostDto postDto = new PostDto();
        postDto.setId(post.getId());
        postDto.setTitle(post.getTitle());
        postDto.setContent(post.getContent());

        if (post.getAuthor() != null) {
            UserDto userDto = new UserDto();
            userDto.setFirstName(post.getAuthor().getFirstName());
            userDto.setLastName(post.getAuthor().getLastName());
            userDto.setPassword(post.getAuthor().getPassword());
            userDto.setRole(post.getAuthor().getRole());
            userDto.setId(post.getAuthor().getId());
            userDto.setUsername(post.getAuthor().getUsername());
            userDto.setEmail(post.getAuthor().getEmail());
            postDto.setUser(userDto);

            // Optionally also set author name as a string
            postDto.setAuthor(post.getAuthor().getUsername());
        }

        // Map category to CategoryDto
        if (post.getCategory() != null) {
            CategoryDto categoryDto = new CategoryDto();
            categoryDto.setId(post.getCategory().getId());
            categoryDto.setTitle(post.getCategory().getTitle());
            postDto.setCategory(categoryDto);
        }
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
