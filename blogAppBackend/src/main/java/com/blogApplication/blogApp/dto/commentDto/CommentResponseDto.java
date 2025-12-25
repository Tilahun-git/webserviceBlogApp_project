package com.blogApplication.blogApp.dto.commentDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponseDto {


    private long id;
    private String content;
    private String username;
    private long postId;
}
