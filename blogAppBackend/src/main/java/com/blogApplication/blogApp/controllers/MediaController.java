package com.blogApplication.blogApp.controllers;

import com.blogApplication.blogApp.payloads.ApiResponse;
import com.blogApplication.blogApp.services.servicesContract.CloudinaryMediaServiceContract;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/media")
@AllArgsConstructor
public class MediaController {

    private final CloudinaryMediaServiceContract cloudinaryMediaService;

    @PostMapping("/upload")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse> uploadMedia(@RequestPart("file") MultipartFile file) {
        try {
            String url = cloudinaryMediaService.uploadMedia(file);
            return ResponseEntity.ok(new ApiResponse(true, "Media uploaded successfully", Map.of("url", url)));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse(false, "Media upload failed", null));
        }     }
}
