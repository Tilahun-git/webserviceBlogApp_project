package com.blogApplication.blogApp.auths;

import com.blogApplication.blogApp.dto.userDto.LoginRequestDto;
import com.blogApplication.blogApp.dto.userDto.LoginResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto request) {
        try {
            // Authenticate user
             authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );


            String token = jwtUtil.generateToken(request.getUsername());

            return ResponseEntity.ok(new LoginResponseDto(token));
        } catch (Exception ex) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
        }
    }
}
