package com.blogApplication.blogApp.auths;

import com.blogApplication.blogApp.dto.userDto.LoginRequestDto;
import com.blogApplication.blogApp.dto.userDto.LoginResponseDto;
import com.blogApplication.blogApp.services.servicesImpl.UserServiceImpl;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/auth")
public class AuthController {

    @Autowired
    private final AuthenticationManager authenticationManager;

    @Autowired
    private final JwtUtil jwtUtil;

    @Autowired
    private final UserServiceImpl userService;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto request) {

       authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(), request.getPassword()));

        String token = jwtUtil.generateToken(request.getUsername());

        return ResponseEntity.ok(new LoginResponseDto(token));
    }


}


