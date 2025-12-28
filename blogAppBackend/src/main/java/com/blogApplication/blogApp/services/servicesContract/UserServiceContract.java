package com.blogApplication.blogApp.services.servicesContract;

import com.blogApplication.blogApp.dto.userDto.RegisterRequestDto;
import com.blogApplication.blogApp.dto.userDto.UserResponseDto;
import com.blogApplication.blogApp.dto.userDto.UserUpdateDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserServiceContract {


    UserResponseDto getUser(long id);
    UserResponseDto registerUser(RegisterRequestDto userDto, MultipartFile profileMedia);
    UserUpdateDto updateUser(UserUpdateDto userDto, long id, MultipartFile profileMedia);
    UserResponseDto activateAndDeActiveUser(long id);

    Page<UserResponseDto> getAllUsers(
            int pageNumber,
            int pageSize,
            Sort sort
    );

    // 🔹 NEW (search + pagination + sorting)
    Page<UserResponseDto> searchUsers(
            String keyword,
            int pageNumber,
            int pageSize,
            Sort sort
    );

}
