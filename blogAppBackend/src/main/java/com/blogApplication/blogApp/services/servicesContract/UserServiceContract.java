package com.blogApplication.blogApp.services.servicesContract;

import com.blogApplication.blogApp.dto.userDto.RegisterRequestDto;
import com.blogApplication.blogApp.dto.userDto.UserResponseDTO;
import com.blogApplication.blogApp.dto.userDto.UserUpdateDTO;
//import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.UUID;

public interface UserServiceContract {


    UserResponseDTO getUser(Long id);
    List<UserResponseDTO> getAllUsers();
    UserResponseDTO createUser(RegisterRequestDto user);
    UserResponseDTO updateUser(UserUpdateDTO user, Long id);
    UserResponseDTO deleteUser(Long id);

}
