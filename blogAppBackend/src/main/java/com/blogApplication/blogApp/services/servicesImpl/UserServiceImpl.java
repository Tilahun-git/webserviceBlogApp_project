package com.blogApplication.blogApp.services.servicesImpl;

import com.blogApplication.blogApp.config.ModelMapperConfig;
import com.blogApplication.blogApp.dto.auth.RegisterRequestDTO;
import com.blogApplication.blogApp.dto.userDto.UserResponseDTO;
import com.blogApplication.blogApp.dto.userDto.UserUpdateDTO;
import com.blogApplication.blogApp.entities.User;
import com.blogApplication.blogApp.exceptions.ResourceNotFoundException;
import com.blogApplication.blogApp.repositories.UserRepo;
import com.blogApplication.blogApp.services.servicesContract.UserServiceContract;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@AllArgsConstructor
public class UserServiceImpl implements UserServiceContract {

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private UserRepo userRepo;

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
        return  modelMapper.map(dto, User.class);
    }

    public  User userUpdateDTOToUser(UserUpdateDTO userDto, User existingUser)
    {
         modelMapper.map(userDto, existingUser);

        return existingUser;

    }





}
