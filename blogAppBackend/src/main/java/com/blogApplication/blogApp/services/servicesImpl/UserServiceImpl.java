package com.blogApplication.blogApp.services.servicesImpl;

import com.blogApplication.blogApp.dto.userDto.RegisterRequestDto;
import com.blogApplication.blogApp.dto.userDto.UserResponseDto;
import com.blogApplication.blogApp.dto.userDto.UserUpdateDto;
import com.blogApplication.blogApp.entities.User;
import com.blogApplication.blogApp.exceptions.ResourceNotFoundException;
import com.blogApplication.blogApp.repositories.UserRepo;
import com.blogApplication.blogApp.services.servicesContract.UserServiceContract;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@AllArgsConstructor
public class UserServiceImpl implements UserServiceContract {

    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CloudinaryMediaServiceImpl cloudinaryMediaService; // Changed to Media service


    @Override
    public UserResponseDto getUser(long id) {

        User user = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User","id",id));
        user.setActive(true);
        return modelMapper.map(user, UserResponseDto.class);
    }

    @Override
    public Page<UserResponseDto> getAllUsers(
            int pageNumber,
            int pageSize,
            Sort sort
    ) {

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<User> userPage = userRepo.findAll(pageable);

        return userPage.map(user -> modelMapper.map(user, UserResponseDto.class));
    }

    @Override
    public UserResponseDto registerUser(RegisterRequestDto userDto, MultipartFile profileMedia) {
        if(userRepo.findByUsername(userDto.getUsername()).isPresent()){
            throw new ResourceNotFoundException("User",": username is already in use",null);
        }
        if(userRepo.findByEmail(userDto.getEmail()).isPresent()){
            throw new ResourceNotFoundException("User",": email is already registered",null);
        }
        User user = modelMapper.map(userDto, User.class);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setMediaUrl(cloudinaryMediaService.uploadMedia(profileMedia));
        User createdUser = userRepo.save(user);
        return modelMapper.map(createdUser, UserResponseDto.class);
    }

    public UserUpdateDto updateUser(UserUpdateDto userDto, long id, MultipartFile profileMedia) {
        User existingUser = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        modelMapper.map(userDto, existingUser); // map into existingUser

        User updatedUser = userRepo.save(existingUser);
        updatedUser.setMediaUrl(cloudinaryMediaService.uploadMedia(profileMedia));

        return modelMapper.map(updatedUser, UserUpdateDto.class);
    }

    @Override
    public UserResponseDto activateAndDeActiveUser(long id) {
        User user = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (user.isActive())
            user.setActive(false);
        else
            user.setActive(true);

        userRepo.save(user);

        return modelMapper.map(user, UserResponseDto.class);

    }

    @Override
        public Page<UserResponseDto> searchUsers (
                String keyword,
        int pageNumber,
        int pageSize,
        Sort sort
    ){

            Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

            Page<User> userPage =
                    userRepo.findByUsernameContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                            keyword,
                            keyword,
                            keyword,
                            pageable
                    );

            return userPage.map(user -> modelMapper.map(user, UserResponseDto.class));
        }


    }
