package com.blogApplication.blogApp.dto.postDto;


import com.blogApplication.blogApp.dto.categoryDto.CategoryDto;
import com.blogApplication.blogApp.dto.userDto.UserDto;
import com.blogApplication.blogApp.entities.Category;
import com.blogApplication.blogApp.entities.User;
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
    private String imageName = "default.png";
    private String author;
    private CategoryDto category;
    private UserDto user;

}
