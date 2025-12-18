package com.blogApplication.blogApp.services.servicesContract;

import com.blogApplication.blogApp.dto.userDto.UserDto;

import java.util.List;

public interface UserServiceContract {


    UserDto getUser(long id);
    List<UserDto> getAllUsers();
    UserDto createUser(UserDto user);
    UserDto updateUser(UserDto user, long id);
    UserDto deleteUser(long id);

}
