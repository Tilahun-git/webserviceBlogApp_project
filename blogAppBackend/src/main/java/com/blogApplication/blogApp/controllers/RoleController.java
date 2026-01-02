package com.blogApplication.blogApp.controllers;

import com.blogApplication.blogApp.dto.roleDto.RoleDto;
import com.blogApplication.blogApp.payloads.ApiResponse;
import com.blogApplication.blogApp.services.servicesContract.RoleServiceContract;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleServiceContract roleService;

    // ================= GET ALL ROLES =================
    @GetMapping("/role-list")
    public ResponseEntity<ApiResponse<List<RoleDto>>> getAllRoles() {
        try {
            List<RoleDto> roles = roleService.getAllRoles();
            return ResponseEntity.ok(new ApiResponse<>(true, "Roles fetched successfully", roles));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse<>(false, "Failed to fetch roles: " + e.getMessage(), null));
        }
    }

    // ================= CREATE NEW ROLE =================
    @PostMapping("/role/create")
    public ResponseEntity<ApiResponse<RoleDto>> createRole(@RequestBody RoleDto roleDto) {
        try {
            RoleDto createdRole = roleService.createRole(roleDto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Role created successfully", createdRole));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to create role: " + e.getMessage(), null));
        }
    }

    // ================= GET SINGLE ROLE =================
    @GetMapping("/role/{id}")
    public ResponseEntity<ApiResponse<RoleDto>> getRoleById(@PathVariable Long id) {
        try {
            RoleDto role = roleService.getRoleById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Role fetched successfully", role));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to fetch role: " + e.getMessage(), null));
        }
    }

    // ================= UPDATE ROLE =================
    @PutMapping("/role/{id}")
    public ResponseEntity<ApiResponse<RoleDto>> updateRole(@RequestBody RoleDto roleDto, @PathVariable Long id) {
        try {
            RoleDto updatedRole = roleService.updateRole(id, roleDto);
            return ResponseEntity.ok(new ApiResponse<>(true, "Role updated successfully", updatedRole));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to update role: " + e.getMessage(), null));
        }
    }

    // ================= DELETE ROLE =================
    @DeleteMapping("/role/admin/{id}")
    public ResponseEntity<ApiResponse<String>> deleteRole(@PathVariable long id) {
        try {
            roleService.deleteRole(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Role deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to delete role: " + e.getMessage(), null));
        }
    }
}
