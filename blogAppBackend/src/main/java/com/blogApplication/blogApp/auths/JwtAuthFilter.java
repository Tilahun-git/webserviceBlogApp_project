package com.blogApplication.blogApp.auths;

import com.blogApplication.blogApp.entities.User;
import com.blogApplication.blogApp.repositories.UserRepo;
import com.blogApplication.blogApp.services.servicesImpl.SecurityService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final SecurityService securityService;
    private final UserRepo userRepo; // Add this - use UserRepo instead of UserActivityService

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Skip OPTIONS requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        // If no token, continue to public endpoints check
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = authHeader.substring(7);
        String username;

        try {
            // Try to extract username from token
            username = jwtUtil.extractUsername(jwt);

        } catch (ExpiredJwtException e) {
            // Token expired
            username = e.getClaims().getSubject();
            sendErrorResponse(response, "Token expired. Please login again.");
            return;

        } catch (Exception e) {
            // Other JWT errors
            logger.error("Invalid JWT token: " + e.getMessage());
            sendErrorResponse(response, "Invalid token");
            return;
        }

        // If we have a username, process authentication
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                // === ADD THIS ACTIVE CHECK ===
                User user = userRepo.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                if (!user.isActive()) {
                    sendErrorResponse(response, "Account is deactivated. Contact admin.");
                    return;
                }
                // === END ACTIVE CHECK ===

                UserDetails userDetails = securityService.loadUserByUsername(username);

                // Check if token is valid (not expired)
                if (jwtUtil.isTokenValid(jwt, userDetails)) {
                    // Set authentication
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authToken);

                } else {
                    // Token is invalid (expired, etc.)
                    sendErrorResponse(response, "Token expired or invalid");
                    return;
                }

            } catch (Exception e) {
                // Error loading user details
                logger.error("Error loading user details for " + username + ": " + e.getMessage());
                sendErrorResponse(response, "Authentication failed");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"" + message + "\"}");
    }
}