package com.blogApplication.blogApp.services.servicesImpl;

import com.blogApplication.blogApp.dto.userDto.*;
import com.blogApplication.blogApp.entities.User;
import com.blogApplication.blogApp.exceptions.ResourceNotFoundException;
import com.blogApplication.blogApp.repositories.UserRepo;
import com.blogApplication.blogApp.services.servicesContract.UserServiceContract;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserServiceContract {

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private UserRepo userRepo;

    @Override
    public UserResponseDTO getUser(Long id) {

        User user = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User","id",id));
        return modelMapper.map(user, UserResponseDTO.class);
    }





    @Override
    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepo.findAll();
        if(users.isEmpty()){
            throw new ResourceNotFoundException("User",": there is no any user",null);
        }
        // This line maps entity to dto
        return users.stream().map(user->modelMapper.map(user,UserResponseDTO.class)).collect(Collectors.toList());

    }



    @Override
    public UserResponseDTO createUser(RegisterRequestDto userDto) {
        User createdUser = userRepo.save(modelMapper.map(userDto, User.class));

        return modelMapper.map(createdUser, UserResponseDTO.class);
    }

    @Override
    public UserResponseDTO updateUser(UserUpdateDTO userDto, Long id) {
        User existingUser = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User","id",id));

        User updatedUser = userRepo.save(modelMapper.map(userDto, User.class));

        return modelMapper.map(updatedUser, UserResponseDTO.class);

    }

    @Override
    public UserResponseDTO deleteUser(Long id) {
        User deletedUser = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User","id", id));
        userRepo.delete(deletedUser);

        return modelMapper.map(deletedUser, UserResponseDTO.class);

    }







}
