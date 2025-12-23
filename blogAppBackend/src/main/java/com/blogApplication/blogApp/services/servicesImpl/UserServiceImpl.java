package com.blogApplication.blogApp.services.servicesImpl;

import com.blogApplication.blogApp.dto.userDto.RegisterRequestDTO;
import com.blogApplication.blogApp.dto.userDto.UserResponseDTO;
import com.blogApplication.blogApp.dto.userDto.UserUpdateDTO;
import com.blogApplication.blogApp.entities.User;
import com.blogApplication.blogApp.exceptions.ResourceNotFoundException;
import com.blogApplication.blogApp.repositories.UserRepo;
import com.blogApplication.blogApp.services.servicesContract.UserServiceContract;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
    public UserResponseDTO getUser(Long id) {

        User user = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User","id",id));
        UserResponseDTO userDtoFound = userToUserResponseDTO(user);
        return userDtoFound;
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepo.findAll();
        if(users.isEmpty()){
            throw new ResourceNotFoundException("User",": there is no any user",null);
        }
        // This line maps entity to dto
        return users.stream().map(this::userToUserResponseDTO).collect(Collectors.toList());

    }

    @Override
    public UserResponseDTO createUser(RegisterRequestDTO userDto) {

        User createdUser = userRepo.save(RegisterRequestDTOToUser(userDto));

        UserResponseDTO createdUserDto = userToUserResponseDTO(createdUser);
        return createdUserDto;
    }

    @Override
    public UserResponseDTO updateUser(UserUpdateDTO userDto, Long id) {
        User existingUser = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User","id",id));

        User updatedUser = userRepo.save(userUpdateDTOToUser(userDto,existingUser));

        UserResponseDTO  updatedUserDto = userToUserResponseDTO(updatedUser);

        return updatedUserDto;

    }

    @Override
    public UserResponseDTO deleteUser(Long id) {
        User deletedUser = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User","id", id));
        userRepo.delete(deletedUser);

        UserResponseDTO deletedDto =userToUserResponseDTO(deletedUser);
        return deletedDto;

    }


    // convert user -> dto
    public  UserResponseDTO userToUserResponseDTO(User user) {
        return  modelMapper.map(user, UserResponseDTO.class);
    }

    // convert dto -> user
    public  User RegisterRequestDTOToUser(RegisterRequestDTO dto) {

        User user = modelMapper.map(dto, User.class);

        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        return  user;
    }

    public  User userUpdateDTOToUser(UserUpdateDTO userDto, User existingUser)
    {
         modelMapper.map(userDto, existingUser);

        return existingUser;

    }





}
