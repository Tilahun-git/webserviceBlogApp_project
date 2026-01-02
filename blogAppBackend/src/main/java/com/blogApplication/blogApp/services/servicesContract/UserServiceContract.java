package com.blogApplication.blogApp.services.servicesContract;

import com.blogApplication.blogApp.dto.userDto.RegisterRequestDto;
import com.blogApplication.blogApp.dto.userDto.UserChangePassword;
import com.blogApplication.blogApp.dto.userDto.UserResponseDto;
import com.blogApplication.blogApp.dto.userDto.UserUpdateDto;
import com.blogApplication.blogApp.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface UserServiceContract {


    UserResponseDto getUser();
    UserResponseDto registerUser(RegisterRequestDto userDto);
     UserUpdateDto updateProfile(UserUpdateDto userDto, MultipartFile profileMedia);

    String generatePasswordResetToken(String email);

    void changePassword(String username, UserChangePassword changePasswordDto);

    void resetForgottenPassword(String email,
                                String newPassword, String confirmNewPassword);
    User validatePasswordResetToken(String email, Long passwordResetToken);

        void deleteUser(long id);
    void activateUser(long id);
    void deActivateUser(long id);

    UserResponseDto grantRole(Long userId, String roleName);
    UserResponseDto revokeRole(Long userId, String roleName);
//
    Set<String> getUserPermissions(long userId);
    UserResponseDto updateUserRoles(long userId, Set<String> roleNames);

    Page<UserResponseDto> getAllUsers(Pageable pageable);
    Page<UserResponseDto> searchUsers(String keyword,int pageNumber, int pageSize, Sort sort);

     Map<String, Long> getDashboardCounts();

    }
