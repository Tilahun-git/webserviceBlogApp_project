package com.blogApplication.blogApp.services.servicesImpl;

import com.blogApplication.blogApp.dto.userDto.UserDto;
import com.blogApplication.blogApp.entities.User;
import com.blogApplication.blogApp.exceptions.ResourceNotFoundException;
import com.blogApplication.blogApp.repositories.UserRepo;
import com.blogApplication.blogApp.services.servicesContract.UserServiceContract;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserServiceContract {


    private UserRepo userRepo;
    public UserServiceImpl(UserRepo userRepo){
        this.userRepo = userRepo;
    }
    @Override
    public UserDto getUser(long id) {

        User user = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User","id",id));
        UserDto userDtoFound = userToUserDto(user);
        return userDtoFound;
    }

    @Override
    public List<UserDto> getAllUsers() {
        List<User> users = userRepo.findAll();
        if(users.isEmpty()){
            throw new ResourceNotFoundException("User",": there is no any user",null);
        }
        // This line maps entity to dto
        return users.stream().map(this::userToUserDto).collect(Collectors.toList());

    }

    @Override
    public UserDto createUser(UserDto userDto) {
        User createdUser =userRepo.save(userDtoToUser(userDto));

        UserDto createdUserDto = userToUserDto(createdUser);
        return createdUserDto;
    }

    @Override
    public UserDto updateUser(UserDto userDto, long id) {
        User existingUser = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User","id",id));

        existingUser.setFirstName(userDto.getFirstName());
        existingUser.setLastName(userDto.getLastName());
        existingUser.setEmail(userDto.getEmail());
        existingUser.setPassword(userDto.getPassword());
        existingUser.setRole(userDto.getRole());

        User updatedUser = userRepo.save(existingUser);
        return userToUserDto(updatedUser);

    }

    @Override
    public UserDto deleteUser(long id) {
        User deletedUser = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User","id", id));
        UserDto deletedDto =userToUserDto(deletedUser);
        userRepo.delete(deletedUser);
        return deletedDto;

    }

    public  UserDto userToUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());

        dto.setRole(user.getRole());
        dto.setPassword(user.getPassword());
        return dto;
    }

    public  User userDtoToUser(UserDto dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
        user.setPassword(dto.getPassword());
        return user;
    }


}
