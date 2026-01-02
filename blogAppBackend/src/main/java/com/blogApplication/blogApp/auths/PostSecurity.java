package com.blogApplication.blogApp.auths;

import com.blogApplication.blogApp.config.RoleInitializer;
import com.blogApplication.blogApp.entities.Post;
import com.blogApplication.blogApp.entities.User;
import com.blogApplication.blogApp.repositories.PostRepo;
import com.blogApplication.blogApp.repositories.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class PostSecurity {

    @Autowired
    private   PostRepo postRepo;

    @Autowired
    private   UserRepo userRepo;

    public boolean canDeletePost(Long postId, Authentication authentication) {

        // 1. If user has DELETE_ANY permission, allow
        if (authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(RoleInitializer.PERMISSION_DELETE_ANY_POST))) {
            return true;
        }

        // 2. If user doesn't have DELETE_OWN permission, deny
        if (authentication.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equals(RoleInitializer.PERMISSION_DELETE_OWN_POST))) {
            return false;
        }

        // 3. Fetch the post
        Post post = postRepo.findById(postId).orElse(null);
        if (post == null) return false;

        // 4. Get current user ID
        Long currentUserId = null;
        Object principal = authentication.getPrincipal();

        if (principal instanceof User currentUser) {
            currentUserId = currentUser.getId();
        } else if (principal instanceof org.springframework.security.core.userdetails.UserDetails userDetails) {
            // Fetch actual User entity from DB
            User user = userRepo.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            currentUserId = user.getId();
        }

        if (currentUserId == null) return false;

        // 5. Check ownership
        return post.getAuthor().getId().equals(currentUserId);
    }

    public boolean canUpdatePost(Long postId, Authentication authentication) {
        // Must have own-post permission
        if (authentication.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equals(RoleInitializer.PERMISSION_UPDATE_OWN_POST))) {
            return false;
        }

        // Ownership check
        Post post = postRepo.findById(postId).orElse(null);
        if (post == null) return false;

        Object principal = authentication.getPrincipal();
        Long currentUserId = null;

        if (principal instanceof User) {
            currentUserId = ((User) principal).getId();
        } else if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
            // If using Spring Security UserDetails, fetch user from DB
            String username = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
            User user = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            currentUserId = user.getId();
        }

        if (currentUserId == null) return false;

        return post.getAuthor().getId().equals(currentUserId);
    }




}

