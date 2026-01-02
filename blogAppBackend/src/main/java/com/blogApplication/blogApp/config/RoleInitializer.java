package com.blogApplication.blogApp.config;

import com.blogApplication.blogApp.entities.Role;
import com.blogApplication.blogApp.repositories.RoleRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.util.Arrays;
import java.util.HashSet;

@Configuration
@Order(1)
public class RoleInitializer {

    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_USER = "ROLE_USER";

    // ===== USER & PROFILE PERMISSIONS =====
    public static final String PERMISSION_CREATE_ACCOUNT = "CREATE_ACCOUNT";
    public static final String PERMISSION_DELETE_USER = "DELETE_USER";
    public static final String PERMISSION_MANAGE_ROLES = "MANAGE_ROLES";
    public static final String PERMISSION_VIEW_ALL_USERS = "VIEW_ALL_USERS";
    public static final String PERMISSION_ACTIVATE_USER = "ACTIVATE_USER";
    public static final String PERMISSION_GRANT_ROLE = "GRANT_ROLE";
    public static final String PERMISSION_REVOKE_ROLE = "REVOKE_ROLE";
    public static final String PERMISSION_SEARCH_USERS = "SEARCH_USERS";
    public static final String PERMISSION_CREATE_CATEGORY = "CREATE_CATEGORY";

    public static final String PERMISSION_UPDATE_CATEGORY = "UPDATE_CATEGORY";
    public static final String PERMISSION_DELETE_CATEGORY = "DELETE_CATEGORY";




    public static final String PERMISSION_DEACTIVATE_USER = "DEACTIVATE_USER";
    public static final String PERMISSION_VIEW_PROFILE = "VIEW_PROFILE";
    public static final String PERMISSION_UPDATE_PROFILE = "UPDATE_PROFILE";
    public static final String PERMISSION_CHANGE_PASSWORD = "CHANGE_PASSWORD";
    public static final String PERMISSION_RESET_PASSWORD = "RESET_PASSWORD";


    // ===== POST PERMISSIONS =====
    public static final String PERMISSION_CREATE_POST = "CREATE_POST";
    public static final String PERMISSION_UPDATE_OWN_POST = "UPDATE_OWN_POST";
    public static final String PERMISSION_DELETE_OWN_POST = "DELETE_OWN_POST";
    public static final String PERMISSION_DELETE_ANY_POST = "DELETE_ANY_POST";
    public static final String PERMISSION_VIEW_ALL_POSTS = "VIEW_ALL_POSTS";
    public static final String PERMISSION_VIEW_OWN_POSTS = "VIEW_OWN_POSTS";
    public static final String PERMISSION_VIEW_OWN_PROFILE = "VIEW_OWN_PROFILE";

    public static final String PERMISSION_COMMENT_POST = "COMMENT_POST";
    public static final String PERMISSION_DELETE_POST_COMMENT = "DELETE_POST_COMMENT";
    public static final String PERMISSION_UPDATE_POST_COMMENT = "UPDATE_POST_COMMENT";
    public static final String PERMISSION_LIKE_POST = "LIKE_POST";

    @Bean
    CommandLineRunner initRoles(RoleRepo roleRepo) {
        return args -> {

            // ===== ADMIN ROLE =====

            if (roleRepo.findByName(ROLE_ADMIN).isEmpty()) {
                Role adminRole = new Role();
                adminRole.setName(ROLE_ADMIN);
                adminRole.setSystem(true);
                adminRole.setDefault(false);
                adminRole.setPermissions(new HashSet<>(Arrays.asList(
                        // User management
                        PERMISSION_DELETE_USER,
                        PERMISSION_MANAGE_ROLES,
                        PERMISSION_VIEW_ALL_USERS,
                        PERMISSION_ACTIVATE_USER,
                        PERMISSION_SEARCH_USERS,
                        PERMISSION_DEACTIVATE_USER,
                        PERMISSION_CHANGE_PASSWORD,
                        PERMISSION_RESET_PASSWORD,
                        PERMISSION_GRANT_ROLE,
                        PERMISSION_REVOKE_ROLE,
                        PERMISSION_VIEW_ALL_POSTS,
                        PERMISSION_DELETE_ANY_POST,
                        PERMISSION_CREATE_CATEGORY,
                        PERMISSION_UPDATE_CATEGORY,
                        PERMISSION_DELETE_CATEGORY
                )));
                roleRepo.save(adminRole);
            }

            // ===== USER ROLE =====
            if (roleRepo.findByName(ROLE_USER).isEmpty()) {
                Role userRole = new Role();
                userRole.setName(ROLE_USER);
                userRole.setSystem(false);
                userRole.setDefault(true);
                userRole.setPermissions(new HashSet<>(Arrays.asList(
                        //
                        PERMISSION_CREATE_ACCOUNT,
                        PERMISSION_VIEW_PROFILE,
                        PERMISSION_UPDATE_PROFILE,
                        PERMISSION_CHANGE_PASSWORD,
                        PERMISSION_RESET_PASSWORD,
                        PERMISSION_CREATE_POST,
                        PERMISSION_VIEW_OWN_POSTS,
                        PERMISSION_UPDATE_OWN_POST,
                        PERMISSION_DELETE_OWN_POST,
                        PERMISSION_VIEW_ALL_POSTS,
                        PERMISSION_COMMENT_POST,
                        PERMISSION_DELETE_POST_COMMENT,
                        PERMISSION_UPDATE_POST_COMMENT,
                        PERMISSION_LIKE_POST,
                        PERMISSION_VIEW_OWN_PROFILE
                )));
                roleRepo.save(userRole);
            }
        };
    }
}
