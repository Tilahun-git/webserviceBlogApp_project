package com.blogApplication.blogApp.services.servicesImpl;

import com.blogApplication.blogApp.dto.commentDto.CommentRequestDto;
import com.blogApplication.blogApp.dto.commentDto.CommentResponseDto;
import com.blogApplication.blogApp.entities.Comment;
import com.blogApplication.blogApp.entities.Post;
import com.blogApplication.blogApp.entities.User;
import com.blogApplication.blogApp.exceptions.ResourceNotFoundException;
import com.blogApplication.blogApp.repositories.CommentRepo;
import com.blogApplication.blogApp.repositories.PostRepo;
import com.blogApplication.blogApp.repositories.UserRepo;
import com.blogApplication.blogApp.services.servicesContract.CommentServiceContract;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentServiceContract {


    @Autowired
    private final CommentRepo commentRepo;
    @Autowired
    private final PostRepo postRepo;
    @Autowired
    private final UserRepo userRepo;
    @Autowired
    private final ModelMapper modelMapper;


    @Override
    public CommentResponseDto addComment(long postId, long userId, CommentRequestDto commentDto) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Post post = postRepo.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        Comment comment = new Comment();
        comment.setContent(commentDto.getContent());
        comment.setUser(user);
        comment.setPost(post);

        Comment savedComment = commentRepo.save(comment);

        CommentResponseDto response = modelMapper.map(savedComment, CommentResponseDto.class);
        response.setUsername(user.getUsername());
        response.setPostId(post.getId());

        return response;
    }


    // Update comment
    @Override
    public CommentResponseDto updateComment(long commentId, long userId, CommentRequestDto commentDto) {
        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to update this comment");
        }

        comment.setContent(commentDto.getContent());
        Comment updated = commentRepo.save(comment);

        CommentResponseDto response = modelMapper.map(updated, CommentResponseDto.class);
        response.setUsername(updated.getUser().getUsername());
        response.setPostId(updated.getPost().getId());
        return response;
    }

    // Delete comment
    @Override
    public void deleteComment(long commentId, long userId) {
        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to delete this comment");
        }

        commentRepo.delete(comment);
    }


    @Override
    public Page<CommentResponseDto> getCommentsByPost(
            long postId,
            int pageNumber,
            int pageSize,
            Sort sort
    ) {
        Post post = postRepo.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));



        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<Comment> commentPage = commentRepo.findByPost(post, pageable);

        return commentPage.map(comment -> {
            CommentResponseDto dto = modelMapper.map(comment, CommentResponseDto.class);
            dto.setUsername(comment.getUser().getUsername());
            dto.setPostId(comment.getPost().getId());
            return dto;
        });
    }

    @Override
    public Page<CommentResponseDto> searchCommentsInPost(
            long postId,
            String keyword,
            int pageNumber,
            int pageSize,
            Sort sort
    ) {
        Post post = postRepo.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));



        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<Comment> commentPage =
                commentRepo.findByPostAndContentContainingIgnoreCase(post, keyword, pageable);

        return commentPage.map(comment -> {
            CommentResponseDto dto = modelMapper.map(comment, CommentResponseDto.class);
            dto.setUsername(comment.getUser().getUsername());
            dto.setPostId(comment.getPost().getId());
            return dto;
        });
    }




}
