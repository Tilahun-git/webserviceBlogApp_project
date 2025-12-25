package com.blogApplication.blogApp.dto.postDto;


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
    private String title;
    private String content;
    private String imageName;
    private String imageType;
    private byte[] imageData;
    private String author;
    private long authorId;
    private long categoryId;

}
