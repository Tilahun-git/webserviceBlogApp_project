package com.blogApplication.blogApp.auths;

import com.blogApplication.blogApp.dto.userDto.LoginRequestDto;
import com.blogApplication.blogApp.dto.userDto.LoginResponseDto;
import com.blogApplication.blogApp.services.servicesImpl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

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

            // Generate token
            String token = jwtUtil.generateToken(request.getUsername());

            // Return response
            return ResponseEntity.ok(new LoginResponseDto(token));

        } catch (Exception ex) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
        }
    }

//
//    @PostMapping("/logout")
//    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            return ResponseEntity.badRequest().body("No token provided");
//        }
//
//        String token = authHeader.substring(7);
//
//        try {
//            String username = jwtUtil.extractUsername(token);
//
//            // Deactivate user immediately on logout
//            userService.deactivateUser(username);
//
//            return ResponseEntity.ok(Map.of(
//                    "message", "Logged out successfully",
//                    "username", username
//            ));
//
//        } catch (Exception e) {
//            return ResponseEntity.ok(Map.of(
//                    "message", "Logout processed",
//                    "note", "Token was invalid or expired"
//            ));
//        }
//    }
//
//    @PostMapping("/refresh")
//    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String authHeader) {
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            return ResponseEntity.badRequest().body("No token provided");
//        }
//
//        String oldToken = authHeader.substring(7);
//
//        try {
//            String username = jwtUtil.extractUsername(oldToken);
//
//            // Generate new token
//            String newToken = jwtUtil.generateToken(username);
//
//            // Update user activity with new token
//            userService.updateUserActivity(username);
//
//            return ResponseEntity.ok(new LoginResponseDto(newToken));
//
//        } catch (io.jsonwebtoken.ExpiredJwtException e) {
//            // Even if token expired, we can extract username and refresh
//            String username = e.getClaims().getSubject();
//
//            // Check if user is still active
//            if (!userService.isUserActive(username)) {
//                return ResponseEntity.status(401)
//                        .body(Map.of("error", "Account deactivated. Please login again."));
//            }
//
//            String newToken = jwtUtil.generateToken(username);
//            userService.updateUserActivity(username);
//
//            return ResponseEntity.ok(new LoginResponseDto(newToken));
//
//        } catch (Exception e) {
//            return ResponseEntity.badRequest()
//                    .body(Map.of("error", "Invalid token", "message", e.getMessage()));
//        }
//    }
//
}