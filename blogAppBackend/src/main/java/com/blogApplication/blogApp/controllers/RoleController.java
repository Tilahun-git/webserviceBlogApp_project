package com.blogApplication.blogApp.controllers;

import com.blogApplication.blogApp.dto.roleDto.RoleDto;
import com.blogApplication.blogApp.dto.userDto.RegisterRequestDto;
import com.blogApplication.blogApp.dto.userDto.UserResponseDto;
import com.blogApplication.blogApp.dto.userDto.UserUpdateDto;
import com.blogApplication.blogApp.services.servicesImpl.RoleServiceImpl;
import com.blogApplication.blogApp.services.servicesImpl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    @Autowired
    private RoleServiceImpl  roleService;


    //  GET METHOD TO LIST ALL ROLE

    @GetMapping("/role-list")
    public ResponseEntity<List<RoleDto>> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }

    // POST METHOD TO ADD NEW ROLE

    @PostMapping("/role/create")
    public ResponseEntity<RoleDto> createRole(@RequestBody RoleDto roleDto) {

        return new ResponseEntity<>(roleService.createRole(roleDto), HttpStatus.CREATED);
    }

    // GET METHOD TO GET SINGLE ROLE

    @GetMapping("/role/{id}")
    public ResponseEntity<RoleDto> getRoleById(@PathVariable Long id) {
        return  ResponseEntity.ok(roleService.getRoleById(id));
    }
    //PUT METHOD TO UPDATE EXISTING ROLE

    @PutMapping("/role/{id}")
    public ResponseEntity<RoleDto> updateRole(@RequestBody RoleDto roleDto, @PathVariable Long id) {
        RoleDto updatedRole = roleService.updateRole(id, roleDto);
        return ResponseEntity.ok(updatedRole);

    }


    // DELETE METHOD TO DELETE ROLE BY USING ID

    @DeleteMapping("/role/admin/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        RoleDto deletedRole = roleService.deleteRole(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully", "data", deletedRole));
    }

}