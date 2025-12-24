package com.blogApplication.blogApp.services.servicesContract;

import com.blogApplication.blogApp.dto.roleDto.RoleDto;
import org.springframework.stereotype.Service;

import java.util.List;

public interface RoleServiceContract {

    List<RoleDto> getAllRoles();
    RoleDto getRoleById(long id);
    RoleDto createRole(RoleDto roleDto);
    RoleDto updateRole(long id, RoleDto roleDto);
    RoleDto deleteRole(long id);
}