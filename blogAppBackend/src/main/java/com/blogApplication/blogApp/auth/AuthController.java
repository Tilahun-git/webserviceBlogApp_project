//package com.blogApplication.blogApp.auth;
//
//
//import com.blogApplication.blogApp.dto.userDto.LoginRequestDto;
//import com.blogApplication.blogApp.dto.userDto.LoginResponseDto;
//import com.blogApplication.blogApp.services.servicesImpl.UserServiceImpl;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/auth/")
//public class AuthController {
//
//
//    @Autowired
//    private  UserServiceImpl userServiceImpl;
//
////    @PostMapping("/login")
////    public LoginResponseDto login(@RequestBody LoginRequestDto request) {
////
////        authenticationManager.authenticate(
////                new UsernamePasswordAuthenticationToken(
////                        request.getEmail(),
////                        request.getPassword()
////                )
////        );
////
////        // Generate JWT
////        UserDetails userDetails = userServiceImpl.loadUserByUsername(request.getEmail());
////        String token = jwtUtil.generateToken(userDetails);
////
////        return new LoginResponseDTO(token);
////    }
//
//}
