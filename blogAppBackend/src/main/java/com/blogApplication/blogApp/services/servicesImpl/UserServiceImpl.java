package com.blogApplication.blogApp.services.servicesImpl;

import com.blogApplication.blogApp.dto.UserDto;
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

        User user = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        UserDto userDtoFound = userToUserDto(user);
        return userDtoFound;
    }

    @Override
    public List<UserDto> getAllUsers() {
        List<User> users = userRepo.findAll();
        if(users.isEmpty()){
            throw new ResourceNotFoundException("No users found");
        }
        //mapping entity to dto
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
        User existingUser = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        existingUser.setFirstName(userDto.getFirstName());
        existingUser.setLastName(userDto.getLastName());
        existingUser.setEmail(userDto.getEmail());
        existingUser.setPassword(userDto.getPassword());
        existingUser.setRole(userDto.getRole());

        User updatedUser = userRepo.save(existingUser);
        return userToUserDto(updatedUser);

    }

    @Override
    public void deleteUser(long id) {
        userRepo.deleteById(id);

    }

    public  UserDto userToUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setPassword(user.getPassword());
        return dto;
    }

    public  User userDtoToUser(UserDto dto) {
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
        user.setPassword(dto.getPassword());
        return user;
    }


}
