package com.blogApplication.blogApp.services.servicesContract;

import com.blogApplication.blogApp.dto.auth.RegisterRequestDTO;
import com.blogApplication.blogApp.dto.userDto.UserResponseDTO;
import com.blogApplication.blogApp.dto.userDto.UserUpdateDTO;

import java.util.List;
import java.util.UUID;

public interface UserServiceContract {


    UserResponseDTO getUser(Long id);
    List<UserResponseDTO> getAllUsers();
    UserResponseDTO createUser(RegisterRequestDTO user);
    UserResponseDTO updateUser(UserUpdateDTO user, Long id);
    UserResponseDTO deleteUser(Long id);

}
