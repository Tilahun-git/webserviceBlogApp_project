package com.blogApplication.blogApp.services.servicesContract;

import com.blogApplication.blogApp.dto.userDto.RegisterRequestDTO;
import com.blogApplication.blogApp.dto.userDto.UserResponseDTO;
import com.blogApplication.blogApp.dto.userDto.UserUpdateDTO;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface UserServiceContract {


    UserResponseDTO getUser(Long id);
    List<UserResponseDTO> getAllUsers();
    UserResponseDTO createUser(RegisterRequestDTO user);
    UserResponseDTO updateUser(UserUpdateDTO user, Long id);
    UserResponseDTO deleteUser(Long id);

}
