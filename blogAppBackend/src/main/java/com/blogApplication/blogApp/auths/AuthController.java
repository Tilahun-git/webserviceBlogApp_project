package com.blogApplication.blogApp.auths;

import com.blogApplication.blogApp.dto.userDto.LoginRequestDto;
import com.blogApplication.blogApp.dto.userDto.LoginResponseDto;
import com.blogApplication.blogApp.dto.userDto.RegisterRequestDto;
import com.blogApplication.blogApp.dto.userDto.UserResponseDto;
import com.blogApplication.blogApp.entities.Role;
import com.blogApplication.blogApp.entities.User;
import com.blogApplication.blogApp.exceptions.ResourceNotFoundException;
import com.blogApplication.blogApp.payloads.ApiResponse;
import com.blogApplication.blogApp.repositories.RoleRepo;
import com.blogApplication.blogApp.repositories.UserRepo;
import com.blogApplication.blogApp.services.servicesImpl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserServiceImpl userService;
    private final UserRepo userRepo;
    private final RoleRepo roleRepo;

    //------------------ LOGIN USER --------------------------
//    @PostMapping("/login")
//    public ResponseEntity<ApiResponse<LoginResponseDto>> login(@RequestBody LoginRequestDto request) {
//
//        try {
//            authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(
//                            request.getUsername(),
//                            request.getPassword()
//                    )
//            );
//        } catch (BadCredentialsException ex) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
//                    new ApiResponse<>(false, "Invalid username or password", null)
//            );
//        }
//
//        // 🔥 Everything below is executed ONLY if authentication succeeds
//        String token = jwtUtil.generateToken(request.getUsername());
//        LoginResponseDto loginResponse = new LoginResponseDto(token);
//
//        return ResponseEntity.ok(
//                new ApiResponse<>(true, "Login successful", loginResponse)
//        );
//    }
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDto>> login(
            @RequestBody LoginRequestDto request) {

        // 1️⃣ Authenticate credentials
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Invalid username or password", null));
        }

        User user = userRepo.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3️⃣ Check roles using your helper methods
        boolean isAdmin = user.hasRole("ROLE_ADMIN");
        boolean isUser  = user.hasRole("ROLE_USER");
        LoginResponseDto response = null;

        if (!isAdmin && !isUser) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse<>(false, "Unauthorized role", null));
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRoleNames());

        if(isAdmin) {
             response = new LoginResponseDto(token, "ADMIN");
        }else if(isUser) {
            response = new LoginResponseDto(token, "USER");
        }

        String message = isAdmin ? "Admin login successful" : "User login successful";

        return ResponseEntity.ok(
                new ApiResponse<>(true, message, response)
        );
    }


    // -------------------- REGISTER NEW USER --------------------
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponseDto>> registerUser(@RequestBody RegisterRequestDto userDto) {
        UserResponseDto createdUser = userService.registerUser(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(true, "User registered successfully", createdUser)
        );
    }
}
