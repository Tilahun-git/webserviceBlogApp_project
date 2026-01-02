package com.blogApplication.blogApp.services.servicesImpl;

import com.blogApplication.blogApp.config.RoleInitializer;
import com.blogApplication.blogApp.dto.roleDto.RoleDto;
import com.blogApplication.blogApp.dto.userDto.UserResponseDto;
import com.blogApplication.blogApp.dto.userDto.UserUpdateDto;
import com.blogApplication.blogApp.entities.Role;
import com.blogApplication.blogApp.entities.User;
import com.blogApplication.blogApp.exceptions.ResourceNotFoundException;
import com.blogApplication.blogApp.repositories.RoleRepo;
import com.blogApplication.blogApp.services.servicesContract.RoleServiceContract;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@AllArgsConstructor
public class RoleServiceImpl implements RoleServiceContract {

    private ModelMapper modelMapper;

    private RoleRepo roleRepo;

    @Override
    public RoleDto createRole(RoleDto roleDto) {

        if (roleRepo.existsByName(roleDto.getName())) {
            throw new IllegalArgumentException("Role already exists: " + roleDto.getName());
        }

        if (roleDto.getName().equals(RoleInitializer.ROLE_ADMIN) ||
                roleDto.getName().equals(RoleInitializer.ROLE_USER)) {
            throw new IllegalArgumentException("Cannot create system role");
        }

        Role role = new Role();
        Role savedRole = roleRepo.save(role);
        return modelMapper.map(savedRole, RoleDto.class);    }

    @Override
    public RoleDto updateRole(long id, RoleDto roleDTO) {

        Role role = roleRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", id));

        if (role.isSystem()) {
            throw new IllegalArgumentException("Cannot update system role");
        }

        if (!role.getName().equals(roleDTO.getName()) &&
                roleRepo.existsByName(roleDTO.getName())) {
            throw new IllegalArgumentException("Role name already exists: " + roleDTO.getName());
        }
        BeanUtils.copyProperties(roleDTO, role, "id", "system", "users", "createdAt");
        Role updatedRole = roleRepo.save(role);

        return modelMapper.map(updatedRole, RoleDto.class);

    }

    @Override
    public void deleteRole(long id) {

        Role role = roleRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role","id",+ id));

        if (role.isSystem()) {
            throw new IllegalArgumentException("Cannot delete system role");
        }

        if (!role.getUsers().isEmpty()) {
            throw new IllegalStateException("Cannot delete role that has users assigned");
        }

        roleRepo.delete(role);
    }

    @Override
    public RoleDto getRoleById(long id) {

        Role role = roleRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", id));

        return modelMapper.map(role, RoleDto.class);
    }

    @Override
    public RoleDto getRoleByName(String name) {

        Role role = roleRepo.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Role","name", name));

        return modelMapper.map(role, RoleDto.class);
    }

    @Override
    public List<RoleDto> getAllRoles() {

        List<Role> roles = roleRepo.findAll();

        return roles.stream()
                .map(role -> modelMapper.map(role, RoleDto.class))
                .collect(Collectors.toList());
    }


    @Override
    public boolean existsByName(String name) {
        return roleRepo.existsByName(name);
    }



}