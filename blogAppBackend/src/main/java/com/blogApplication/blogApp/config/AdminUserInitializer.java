package com.blogApplication.blogApp.config;

import com.blogApplication.blogApp.entities.Role;
import com.blogApplication.blogApp.entities.User;
import com.blogApplication.blogApp.repositories.RoleRepo;
import com.blogApplication.blogApp.repositories.UserRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;

@Configuration
@RequiredArgsConstructor
public class AdminUserInitializer {

    private final UserRepo userRepo;
    private final RoleRepo roleRepo;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @Transactional
    CommandLineRunner initAdminUser() {
        return args -> {

            // ✅ ROLE_ADMIN MUST already exist (created by RoleInitializer)
            Role adminRole = roleRepo.findByName(RoleInitializer.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found. Ensure RoleInitializer runs first."));

            // ✅ Create admin user if missing
            User admin = userRepo.findByUsername("admin")
                    .orElseGet(() -> {
                        User user = new User();
                        user.setUsername("admin");
                        user.setEmail("admin@blog.com");
                        user.setPassword(passwordEncoder.encode("admin123"));
                        user.setRoles(new HashSet<>());
                        return user;
                    });

            // ✅ Ensure admin has ROLE_ADMIN (NULL-safe)
            boolean hasAdminRole = admin.getRoles().stream()
                    .anyMatch(role -> RoleInitializer.ROLE_ADMIN.equals(role.getName()));

            if (!hasAdminRole) {
                admin.getRoles().add(adminRole);
            }

            userRepo.save(admin);

            System.out.println("✅ Admin user ensured: username=admin | password=******");
        };
    }
}
