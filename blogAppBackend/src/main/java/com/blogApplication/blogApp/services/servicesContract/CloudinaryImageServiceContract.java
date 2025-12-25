package com.blogApplication.blogApp.services.servicesContract;

import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

public interface CloudinaryImageServiceContract {
    String uploadImage(MultipartFile imageFile);
    boolean deleteImage(String imageUrl);
    String updateImage(String oldImageUrl, MultipartFile newImageFile);
    Map<String, Object> getImageInfo(String imageUrl);
}