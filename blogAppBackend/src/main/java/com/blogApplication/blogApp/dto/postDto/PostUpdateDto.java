package com.blogApplication.blogApp.dto.postDto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostUpdateDto {
    private String title;
    private String content;
    private  String ImageName;
}
