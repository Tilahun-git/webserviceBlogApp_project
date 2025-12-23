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

import java.util.List;
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


    @Override
    public UserResponseDto getUser(long id) {

        User user = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User","id",id));
        return modelMapper.map(user, UserResponseDto.class);
    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        List<User> users = userRepo.findAll();
        if(users.isEmpty()){
            throw new ResourceNotFoundException("User",": there is no any user",null);
        }
        return users.stream().map(user -> modelMapper.map(user, UserResponseDto.class))
                .collect(Collectors.toList());

    }


    @Override
    public UserResponseDto registerUser(RegisterRequestDto userDto) {
        if(userRepo.findByUsername(userDto.getUsername()).isPresent()){
            throw new ResourceNotFoundException("User",": username is already in use",null);
        }
        if(userRepo.findByEmail(userDto.getEmail()).isPresent()){
            throw new ResourceNotFoundException("User",": email is already registered",null);
        }
        User user = modelMapper.map(userDto, User.class);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User createdUser = userRepo.save(user);
        return modelMapper.map(createdUser, UserResponseDto.class);
    }

    public UserUpdateDto updateUser(UserUpdateDto userDto, long id) {
        User existingUser = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        modelMapper.map(userDto, existingUser); // map into existingUser

        User updatedUser = userRepo.save(existingUser);

        return modelMapper.map(updatedUser, UserUpdateDto.class);
    }

    @Override
    public UserResponseDto deleteUser(long id) {
        User deletedUser = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User","id", id));
        userRepo.delete(deletedUser);

        return modelMapper.map(deletedUser, UserResponseDto.class);

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
    public Page<UserResponseDto> searchUsers(
            String keyword,
            int pageNumber,
            int pageSize,
            Sort sort
    ) {

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
