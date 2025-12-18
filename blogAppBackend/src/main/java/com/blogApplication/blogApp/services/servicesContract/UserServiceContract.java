package com.blogApplication.blogApp.services.servicesContract;

import com.blogApplication.blogApp.dto.UserDto;

import java.util.List;

public interface UserServiceContract {


    UserDto getUser(long id);
    List<UserDto> getAllUsers();
    UserDto createUser(UserDto user);
    UserDto updateUser(UserDto user, long id);
    void deleteUser(long id);

}
