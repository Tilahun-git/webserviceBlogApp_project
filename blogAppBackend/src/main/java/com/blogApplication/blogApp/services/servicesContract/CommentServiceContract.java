package com.blogApplication.blogApp.services.servicesContract;

import com.blogApplication.blogApp.dto.commentDto.CommentRequestDto;
import com.blogApplication.blogApp.dto.commentDto.CommentResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;

import java.util.List;

public interface CommentServiceContract {

     CommentResponseDto addComment(long postId, long userId, CommentRequestDto commentDto);
     CommentResponseDto updateComment(long commentId, long userId, CommentRequestDto commentDto);
     void deleteComment(long commentId, long userId);
     Page<CommentResponseDto> getCommentsByPost(
             long postId,
             int pageNumber,
             int pageSize,
             Sort sort
     );

     Page<CommentResponseDto> searchCommentsInPost(
             long postId,
             String keyword,
             int pageNumber,
             int pageSize,
             Sort sort
     );
}


