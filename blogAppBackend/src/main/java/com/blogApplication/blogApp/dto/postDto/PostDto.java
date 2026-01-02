package com.blogApplication.blogApp.dto.postDto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {

    private long id;

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200)
    private String title;

    @NotBlank(message = "Content is required")
    private String content;
    private String mediaType;
    private String mediaUrl;
    private Integer likeCount;
    private String author;
    private long categoryId;
    private String categoryTitle;

}
