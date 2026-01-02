package com.blogApplication.blogApp.services.servicesContract;

import com.blogApplication.blogApp.dto.roleDto.RoleDto;
import org.springframework.stereotype.Service;

import java.util.List;

public interface RoleServiceContract {

    public RoleDto createRole(RoleDto roleDTO);
    public RoleDto updateRole(long id, RoleDto roleDTO);
    public void deleteRole(long id);

     RoleDto getRoleById(long id);
     RoleDto getRoleByName(String name);
     List<RoleDto> getAllRoles();
     boolean existsByName(String name);
    }