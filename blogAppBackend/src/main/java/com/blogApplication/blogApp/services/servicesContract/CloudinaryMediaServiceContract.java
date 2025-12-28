package com.blogApplication.blogApp.services.servicesContract;

import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

public interface CloudinaryMediaServiceContract {
    String uploadMedia(MultipartFile mediaFile);
    boolean deleteMedia(String mediaUrl);
    String updateMedia(String oldMediaUrl, MultipartFile newMediaFile);
    Map<String, Object> getMediaInfo(String mediaUrl);
    String getMediaType(String mediaUrl);
    String generateThumbnailUrl(String mediaUrl);
}
