package com.blogApplication.blogApp.services.servicesImpl;

import com.blogApplication.blogApp.dto.userDto.UserDto;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@AllArgsConstructor
public class UserServiceImpl implements UserServiceContract {
    @Autowired
    private  ModelMapper modelMapper;
    @Autowired
    private UserRepo userRepo;

    @Override
    public UserDto getUser(long id) {

        User user = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User","id",id));
        return userToUserDto(user);
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

        return userToUserDto(createdUser);
    }

    @Override
    public UserDto updateUser(UserDto userDto, long id) {
        User existingUser = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User","id",id));

        existingUser.setFirstName(userDto.getFirstName());
        existingUser.setLastName(userDto.getLastName());
        existingUser.setEmail(userDto.getEmail());

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

    // convert user -> dto
    public  UserDto userToUserDto(User user) {
        return  modelMapper.map(user, UserDto.class);
    }

    // convert dto -> user
    public  User userDtoToUser(UserDto dto) {
        return  modelMapper.map(dto, User.class);
    }


}
