package com.blogApplication.blogApp.dto.postDto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostResponseDto {

    private long id;
    private String title;
    private String content;
    private String imageName = "default.png";
    private String author;
    private long authorId;
    private long categoryId;
    private Long likeCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
