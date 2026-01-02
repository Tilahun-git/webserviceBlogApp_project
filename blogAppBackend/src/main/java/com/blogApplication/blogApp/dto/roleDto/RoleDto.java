package com.blogApplication.blogApp.dto.roleDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoleDto {

    private long id;
    private String name;
//    private Set<String> permissions = new HashSet<>();
    private boolean isDefault;
    private boolean isSystem;
    private LocalDateTime createdAt;

}