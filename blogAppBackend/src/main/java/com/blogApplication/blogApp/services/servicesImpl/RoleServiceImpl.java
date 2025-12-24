package com.blogApplication.blogApp.services.servicesImpl;

import com.blogApplication.blogApp.dto.roleDto.RoleDto;
import com.blogApplication.blogApp.dto.userDto.UserResponseDto;
import com.blogApplication.blogApp.dto.userDto.UserUpdateDto;
import com.blogApplication.blogApp.entities.Role;
import com.blogApplication.blogApp.entities.User;
import com.blogApplication.blogApp.exceptions.ResourceNotFoundException;
import com.blogApplication.blogApp.repositories.RoleRepo;
import com.blogApplication.blogApp.services.servicesContract.RoleServiceContract;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@AllArgsConstructor
public class RoleServiceImpl implements RoleServiceContract {

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private RoleRepo roleRepo;


    @Override
    public List<RoleDto> getAllRoles() {
        List<Role> roles = roleRepo.findAll();

        if(roles.isEmpty()){
            throw new ResourceNotFoundException("Role",": there is no any role",null);
        }
        return roles.stream().map(role -> modelMapper.map(role, RoleDto.class))
                .collect(Collectors.toList());

    }

    @Override
    public RoleDto getRoleById(long id) {
        Role role = roleRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Role","id",id));
        return modelMapper.map(role, RoleDto.class);
    }

    @Override
    public RoleDto createRole(RoleDto roleDto) {
        Role role = modelMapper.map(roleDto, Role.class);
        role.setId(null);
        Role createdRole = roleRepo.save(role);
        return modelMapper.map(createdRole, RoleDto.class);
    }

    @Override
    public RoleDto updateRole(long id, RoleDto roleDto) {
        Role existingRole = roleRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", id));

        modelMapper.map(roleDto, existingRole); // map into existingUser

        Role updatedRole = roleRepo.save(existingRole);

        return modelMapper.map(updatedRole, RoleDto.class);
    }

    @Override
    public RoleDto deleteRole(long id) {
        Role deletedRole = roleRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Role","id", id));
        roleRepo.delete(deletedRole);

        return modelMapper.map(deletedRole, RoleDto.class);    }
}