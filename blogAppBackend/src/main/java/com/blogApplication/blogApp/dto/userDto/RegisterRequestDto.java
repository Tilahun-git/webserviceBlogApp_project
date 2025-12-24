package com.blogApplication.blogApp.dto.userDto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDto {
    private String firstname;
    private String lastname;
    private String username;
    private String email;
    private String password;
}
