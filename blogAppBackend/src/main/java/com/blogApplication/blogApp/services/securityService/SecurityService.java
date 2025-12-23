//package com.blogApplication.blogApp.services.securityService;
//
//import com.blogApplication.blogApp.entities.User;
//import com.blogApplication.blogApp.exceptions.ResourceNotFoundException;
//import com.blogApplication.blogApp.repositories.UserRepo;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.stereotype.Service;
//
//
//@Service
//@RequiredArgsConstructor
//public class SecurityService implements UserDetailsService {
//    @Autowired
//    private final UserRepo  userRepo;
//
//    @Override
//    public UserDetails loadUserByUsername(String email) {
//        User user = userRepo.findByEmail(email)
//                .orElseThrow(() -> new ResourceNotFoundException("User","email",email));
//
//        return new org.springframework.security.core.userdetails.User(
//                user.getEmail(),
//                user.getPassword(),
//                user.getRoles().stream()
//                        .map(role -> new SimpleGrantedAuthority(role.getName()))
//                        .toList()
//        );
//    }
//}
