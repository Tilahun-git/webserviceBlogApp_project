package com.blogApplication.blogApp.services.servicesImpl;

import com.blogApplication.blogApp.config.RoleInitializer;
import com.blogApplication.blogApp.dto.userDto.RegisterRequestDto;
import com.blogApplication.blogApp.dto.userDto.UserChangePassword;
import com.blogApplication.blogApp.dto.userDto.UserResponseDto;
import com.blogApplication.blogApp.dto.userDto.UserUpdateDto;
import com.blogApplication.blogApp.entities.Role;
import com.blogApplication.blogApp.entities.User;
import com.blogApplication.blogApp.exceptions.ResourceNotFoundException;
import com.blogApplication.blogApp.payloads.UserStatus;
import com.blogApplication.blogApp.repositories.PostRepo;
import com.blogApplication.blogApp.repositories.RoleRepo;
import com.blogApplication.blogApp.repositories.UserRepo;
import com.blogApplication.blogApp.services.servicesContract.UserServiceContract;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor

public class UserServiceImpl implements UserServiceContract {

    private final ModelMapper modelMapper;
    private  final UserRepo userRepo;
    private  final PostRepo postRepo;


    private final RoleRepo roleRepo;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final CloudinaryMediaServiceImpl cloudinaryMediaService;

    private boolean isLastAdminUser(User user, String roleName) {
        if (!roleName.equals(RoleInitializer.ROLE_ADMIN)) {
            return false;
        }

        // Count users with ADMIN role
        List<User> adminUsers = userRepo.findByRoleName(RoleInitializer.ROLE_ADMIN);
        long activeAdmins = adminUsers.stream()
                .filter(u -> u.getStatus() == UserStatus.ACTIVE)
                .count();

        return activeAdmins <= 1 && user.hasRole(RoleInitializer.ROLE_ADMIN);
    }

    @Override
    public UserResponseDto getUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();


//
        User currentUser = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

//        User user = userRepo.findById(currentUser).orElseThrow(() -> new RuntimeException("User not found"));

        return modelMapper.map(currentUser, UserResponseDto.class);
    }

    @Override
    @PreAuthorize("hasAuthority('VIEW_ALL_USERS')")
    public Page<UserResponseDto> getAllUsers( Pageable pageable
    ) {
        Page<User> userPage = userRepo.findByIsDeletedFalse(pageable);
        return userPage.map(user -> modelMapper.map(user, UserResponseDto.class));
    }
    @Override
    public UserResponseDto registerUser(RegisterRequestDto userDto){
        if(userRepo.findByUsername(userDto.getUsername()).isPresent()){
            throw new ResourceNotFoundException("User",": username is already in use",null);
        }
        if(userRepo.findByEmail(userDto.getEmail()).isPresent()){
            throw new ResourceNotFoundException("User",": email is already registered",null);
        }
        User user = modelMapper.map(userDto, User.class);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Set<Role> roles = new HashSet<>();
        if (userDto.getRoleNames() == null || userDto.getRoleNames().isEmpty()) {
            List<Role> defaultRoles = roleRepo.findByIsDefault(true);
            if (!defaultRoles.isEmpty()) {
                roles.addAll(defaultRoles);
            } else {
                Role userRole = roleRepo.findByName(RoleInitializer.ROLE_USER)
                        .orElseThrow(() -> new ResourceNotFoundException("Role","name",null));
                roles.add(userRole);
            }
        } else {
            Set<Role> specifiedRoles = roleRepo.findRolesByNames(userDto.getRoleNames());
            if (specifiedRoles.size() != userDto.getRoleNames().size()) {
                throw new IllegalArgumentException("One or more specified roles do not exist");
            }
            roles.addAll(specifiedRoles);
        }
        user.setRoles(roles);
        User createdUser = userRepo.save(user);
        return modelMapper.map(createdUser, UserResponseDto.class);
    }

    @Override
    @PreAuthorize("hasAuthority('DELETE_USER')")
    public void deleteUser(long id) {
        User user = userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        // Soft delete
//        user.setStatus(UserStatus.DELETED);
        user.setDeleted(true);
        user.setDeletedAt(LocalDateTime.now());

        // Anonymize email to prevent reuse
        String anonymizedEmail = "deleted_" + System.currentTimeMillis() + "_" + user.getEmail();
        if (anonymizedEmail.length() > 255) {
            anonymizedEmail = anonymizedEmail.substring(0, 255);
        }
        user.setEmail(anonymizedEmail);

        // Remove all roles
        user.getRoles().clear();

        userRepo.save(user);

    }


    @Override
    @PreAuthorize("hasAuthority('ACTIVATE_USER')")
    public void activateUser(long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User","id",userId));

        user.setStatus(UserStatus.ACTIVE);
        userRepo.save(user);

        String text = "Activated User";
        String subject = "Activation Message";

        emailService.sendActivationMessage(user.getEmail(),text,subject);
    }

    @Override
    @PreAuthorize("hasAuthority('DEACTIVATE_USER')")
    public void deActivateUser(long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User","id",userId));

        user.setStatus(UserStatus.INACTIVE);
        userRepo.save(user);

        String text = "Deactivated User";
        String subject = "Deactivation Message";

        emailService.sendActivationMessage(user.getEmail(),text,subject);
    }


    @Override
    @PreAuthorize("hasAuthority('GRANT_ROLE')")

    public UserResponseDto grantRole(Long userId, String roleName) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User","id",userId));

        Role role = roleRepo.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role","name", roleName));

        if (user.hasRole(roleName)) {
            throw new IllegalArgumentException("User already has role: " + roleName);
        }

        user.addRole(role);
        User updatedUser = userRepo.save(user);
        return modelMapper.map(updatedUser, UserResponseDto.class);
    }


    @Override
    @PreAuthorize("hasAuthority('REVOKE_ROLE')")
    public UserResponseDto revokeRole(Long userId, String roleName) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User","id", userId));

        Role role = roleRepo.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role","roleName", roleName));

        if (!user.hasRole(roleName)) {
            throw new IllegalArgumentException("User does not have role: " + roleName);
        }

        if (user.getRoles().size() <= 1) {
            throw new IllegalArgumentException("Cannot remove last role from user");
        }

        if (roleName.equals("ADMIN") && isLastAdminUser(user,roleName)) {
            throw new IllegalArgumentException("Cannot revoke last admin role");
        }

        user.removeRole(role);
        User updatedUser = userRepo.save(user);
        return modelMapper.map(updatedUser, UserResponseDto.class);
    }

    @Override
    public Set<String> getUserPermissions(long userId) {

        User user = userRepo.findByIdWithRoles(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id",userId));

        Set<String> permissions = new HashSet<>();
        for (Role role : user.getRoles()) {
            permissions.addAll(role.getPermissions());
        }

        return permissions;
    }

    @Override
    @PreAuthorize("hasAuthority('MANAGE_ROLES')")
    public UserResponseDto updateUserRoles(long userId, Set<String> roleNames) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id",userId));

        Set<Role> newRoles = roleRepo.findRolesByNames(roleNames);
        if (newRoles.size() != roleNames.size()) {
            throw new IllegalArgumentException("One or more specified roles do not exist");
        }

        user.getRoles().clear();
        user.getRoles().addAll(newRoles);

        User updatedUser = userRepo.save(user);

        return  modelMapper.map(updatedUser, UserResponseDto.class);

    }

    @Override
    @PreAuthorize("hasAuthority('SEARCH_USERS') or hasAuthority('VIEW_ALL_USERS')")
    public Page<UserResponseDto> searchUsers (String keyword,int pageNumber,int pageSize,Sort sort){
            Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
            Page<User> userPage = userRepo
                    .findByUsernameContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase( keyword, keyword, keyword, pageable );
            return userPage.map(user -> modelMapper.map(user, UserResponseDto.class));
        }

@Override
//@PreAuthorize("hasAuthority('UPDATE_PROFILE') and #username == authentication.name ")
//@PreAuthorize("hasAuthority(T(com.blogApplication.blogApp.config.RoleInitializer).PERMISSION_UPDATE_PROFILE) and #id == principal.id")
    public UserUpdateDto updateProfile(UserUpdateDto userDto, MultipartFile profileMedia) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();


//
    User existingUser = userRepo.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        modelMapper.map(userDto, existingUser); // map into existingUser
        if(profileMedia != null && !profileMedia.isEmpty()) {
            existingUser.setMediaUrl(cloudinaryMediaService.uploadMedia(profileMedia));
        }else {
            existingUser.setMediaUrl(null);
        }

        User updatedUser = userRepo.save(existingUser);

        return modelMapper.map(updatedUser, UserUpdateDto.class);
    }

    @Override
    @PreAuthorize("hasAuthority('CHANGE_PASSWORD') and #username == authentication.name ")

    public void changePassword(String username, UserChangePassword changePasswordDto) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(changePasswordDto.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (!changePasswordDto.getNewPassword().equals(changePasswordDto.getConfirmNewPassword())) {
            throw new RuntimeException("New passwords do not match");
        }

        // Set new password
        user.setPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));
        userRepo.save(user);
    }

    @Override
    public String generatePasswordResetToken(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate 6-digit random number (100000 to 999999)

        Random random = new Random();
        String token = String.valueOf(100000 + random.nextInt(900000)); // generates 100000 to 999999


        user.setPasswordResetToken(token);
        // If you use LocalDateTime in User entity
        user.setTokenExpiryDate(LocalDateTime.now().plusMinutes(5));
        userRepo.save(user);

//        log.info("Generated 6-digit password reset token: {} for user: {}", token, email);
        return token;
    }

    @Override
    public void resetForgottenPassword(String email,
                                       String newPassword, String confirmNewPassword) {
        // Validate token by email
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate passwords match
        if (!newPassword.equals(confirmNewPassword)) {
            throw new RuntimeException("Passwords do not match");
        }

        if(user.isTokenValidated()) {
            // Update password and clear token
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setTokenValidated(false);
            user.setPasswordResetToken(null);
            user.setTokenExpiryDate(null);
            userRepo.save(user);
        }else {
            throw new RuntimeException("token is not validated");
        }
    }

    @Override
    public User validatePasswordResetToken(String email, Long passwordResetToken) {
        // 1. Find user by email
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Check if token matches
        if (user.getPasswordResetToken() == null ||
                !user.getPasswordResetToken().equals(passwordResetToken)) {
            throw new RuntimeException("Invalid reset token");
        }



        // 3. Check if token is expired (if you have expiry date)
        if (user.getTokenExpiryDate() != null && user.getTokenExpiryDate().isBefore(LocalDateTime.now())) {
            user.setPasswordResetToken(null); // Clear expired token
            user.setTokenExpiryDate(null);
            userRepo.save(user);
            throw new RuntimeException("Reset token has expired");
        }

        user.setTokenValidated(true);
        userRepo.save(user);
        return user;
    }

    @Override
    public Map<String, Long> getDashboardCounts() {
        long totalUsers = userRepo.count(); // all users
        long totalActiveUsers = userRepo.countByIsDeletedFalse(); // active users only
        long totalPosts = postRepo.count();

        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalActiveUsers", totalActiveUsers);
        stats.put("totalPosts", totalPosts);

        return stats;
    }

    }
