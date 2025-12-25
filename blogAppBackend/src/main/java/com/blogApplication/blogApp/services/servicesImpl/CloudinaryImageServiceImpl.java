package com.blogApplication.blogApp.services.servicesImpl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.blogApplication.blogApp.services.servicesContract.CloudinaryImageServiceContract;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryImageServiceImpl implements CloudinaryImageServiceContract {

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public String uploadImage(MultipartFile imageFile) {
        try {
            String publicId = "blog/posts/" + UUID.randomUUID();

            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    imageFile.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "folder", "blog/posts",
                            "resource_type", "image"
                    )
            );

            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Upload failed", e);
        }
    }

    @Override
    public boolean deleteImage(String imageUrl) {
        try {
            String publicId = extractPublicId(imageUrl);
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public String updateImage(String oldImageUrl, MultipartFile newImageFile) {
        if (oldImageUrl != null) {
            deleteImage(oldImageUrl);
        }
        return uploadImage(newImageFile);
    }

    @Override
    public Map<String, Object> getImageInfo(String imageUrl) {
        try {
            String publicId = extractPublicId(imageUrl);
            return cloudinary.api().resource(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            return Map.of();
        }
    }

    private String extractPublicId(String imageUrl) {
        String[] parts = imageUrl.split("/upload/");
        if (parts.length < 2) return null;

        String path = parts[1];
        if (path.startsWith("v")) {
            path = path.substring(path.indexOf("/") + 1);
        }

        int dotIndex = path.lastIndexOf(".");
        return dotIndex > 0 ? path.substring(0, dotIndex) : path;
    }
}