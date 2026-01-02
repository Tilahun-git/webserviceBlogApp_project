package com.blogApplication.blogApp.services.servicesImpl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.blogApplication.blogApp.services.servicesContract.CloudinaryMediaServiceContract;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@AllArgsConstructor
public class CloudinaryMediaServiceImpl implements CloudinaryMediaServiceContract {

    private final Cloudinary cloudinary;

    @Override
    public String uploadMedia(MultipartFile mediaFile) {
        try {
            String fileName = UUID.randomUUID().toString();
            String originalName = mediaFile.getOriginalFilename();
            String extension = "";

            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }

            String publicId = "blog/posts/" + fileName + extension;

            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    mediaFile.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "folder", "blog/posts",
                            "resource_type", "auto"  // Auto-detect image or video
                    )
            );

            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Media upload failed", e);
        }
    }

    @Override
    public boolean deleteMedia(String mediaUrl) {
        try {
            String publicId = extractPublicId(mediaUrl);
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public String updateMedia(String oldMediaUrl, MultipartFile newMediaFile) {
        if (oldMediaUrl != null) {
            deleteMedia(oldMediaUrl);
        }
        return uploadMedia(newMediaFile);
    }

    @Override
    public Map<String, Object> getMediaInfo(String mediaUrl) {
        try {
            String publicId = extractPublicId(mediaUrl);
            return cloudinary.api().resource(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            return Map.of();
        }
    }

    @Override
    public String getMediaType(String mediaUrl) {
        try {
            String publicId = extractPublicId(mediaUrl);
            Map<String, Object> info = cloudinary.api().resource(publicId, ObjectUtils.emptyMap());
            return info.get("resource_type").toString(); // "image" or "video"
        } catch (Exception e) {
            return "unknown";
        }
    }

    @Override
    public String generateThumbnailUrl(String mediaUrl) {
        try {
            String publicId = extractPublicId(mediaUrl);
            String type = getMediaType(mediaUrl);

            if ("video".equals(type)) {
                // Remove extension for thumbnail
                int dotIndex = publicId.lastIndexOf(".");
                if (dotIndex > 0) {
                    publicId = publicId.substring(0, dotIndex);
                }

                // Generate video thumbnail
                return cloudinary.url()
                        .resourceType("video")
                        .transformation(new com.cloudinary.Transformation()
                                .width(400).height(225).crop("fill")
                                .quality("auto")
                                .fetchFormat("jpg")
                        )
                        .generate(publicId + ".jpg");
            } else {
                // Generate image thumbnail
                return cloudinary.url()
                        .transformation(new com.cloudinary.Transformation()
                                .width(300).height(200).crop("fill")
                                .quality("auto")
                        )
                        .generate(publicId);
            }
        } catch (Exception e) {
            return mediaUrl; // Return original if thumbnail fails
        }
    }

    private String extractPublicId(String mediaUrl) {
        if (mediaUrl == null) return null;

        String[] parts = mediaUrl.split("/upload/");
        if (parts.length < 2) return null;

        String path = parts[1];
        if (path.startsWith("v")) {
            path = path.substring(path.indexOf("/") + 1);
        }

        return path;
    }
}