# User Dashboard Backend Integration Guide

## Overview
The user dashboard has been updated to connect with your Spring Boot backend. Here's what you need to implement on the backend side and how the frontend is configured.

## Frontend Changes Made

### 1. API Functions Added (`lib/api.ts`)
- `createPost()` - Create new posts
- `getUserPosts()` - Get user's posts with pagination
- `updatePost()` - Update existing posts
- `deletePost()` - Delete posts
- `uploadMedia()` - Upload images/videos
- `getUserProfile()` - Get user profile data
- `updateUserProfile()` - Update user profile
- `uploadProfilePicture()` - Upload profile pictures

### 2. Components Updated
- **CreatePost**: Now connects to backend API, loads categories dynamically
- **MyPosts**: Loads real user posts, handles CRUD operations
- **UserProfile**: Loads and updates real user data

### 3. Authentication Integration
- JWT tokens automatically added to requests
- Proper error handling for authentication failures
- SSL certificate error handling

## Required Spring Boot Endpoints

### Authentication Endpoints (Already Implemented)
```
POST /api/auth/register
POST /api/auth/login
```

### User Dashboard Endpoints (Need Implementation)

#### Posts Management
```java
// Get user's posts
@GetMapping("/api/posts/user/my-posts")
public ResponseEntity<PagedResponse<PostDto>> getUserPosts(
    @RequestParam(defaultValue = "0") int pageNumber,
    @RequestParam(defaultValue = "10") int pageSize,
    @RequestParam(defaultValue = "createdAt") String sortBy,
    @RequestParam(defaultValue = "desc") String sortDir,
    Authentication authentication
) {
    // Return paginated user posts
}

// Create new post
@PostMapping("/api/posts/user/create")
public ResponseEntity<PostDto> createPost(
    @RequestBody CreatePostRequest request,
    Authentication authentication
) {
    // Create post for authenticated user
}

// Update post
@PutMapping("/api/posts/user/{postId}")
public ResponseEntity<PostDto> updatePost(
    @PathVariable Long postId,
    @RequestBody UpdatePostRequest request,
    Authentication authentication
) {
    // Update user's post
}

// Delete post
@DeleteMapping("/api/posts/user/{postId}")
public ResponseEntity<Void> deletePost(
    @PathVariable Long postId,
    Authentication authentication
) {
    // Delete user's post
}
```

#### Media Upload
```java
// Upload media files
@PostMapping("/api/media/upload")
public ResponseEntity<MediaUploadResponse> uploadMedia(
    @RequestParam("file") MultipartFile file,
    @RequestParam("mediaType") String mediaType,
    Authentication authentication
) {
    // Upload and return media URL
}
```

#### User Profile Management
```java
// Get user profile
@GetMapping("/api/user/profile")
public ResponseEntity<UserProfileDto> getUserProfile(
    Authentication authentication
) {
    // Return user profile data
}

// Update user profile
@PutMapping("/api/user/profile")
public ResponseEntity<UserProfileDto> updateUserProfile(
    @RequestBody UpdateProfileRequest request,
    Authentication authentication
) {
    // Update user profile
}

// Upload profile picture
@PostMapping("/api/user/profile/picture")
public ResponseEntity<ProfilePictureResponse> uploadProfilePicture(
    @RequestParam("file") MultipartFile file,
    Authentication authentication
) {
    // Upload and return profile picture URL
}
```

## Required DTOs

### CreatePostRequest
```java
public class CreatePostRequest {
    private String title;
    private String content;
    private Long categoryId;
    private String mediaType; // TEXT, IMAGE, VIDEO
    private String mediaUrl;
    
    // getters and setters
}
```

### PostDto
```java
public class PostDto {
    private Long id;
    private String title;
    private String content;
    private String mediaType;
    private String mediaUrl;
    private Integer likeCount;
    private String author;
    private String categoryTitle;
    private LocalDateTime createdAt;
    
    // getters and setters
}
```

### UserProfileDto
```java
public class UserProfileDto {
    private String id;
    private String username;
    private String email;
    private String bio;
    private String profilePicture;
    private Boolean isAdmin;
    private LocalDateTime createdAt;
    
    // getters and setters
}
```

### UpdateProfileRequest
```java
public class UpdateProfileRequest {
    private String username;
    private String email;
    private String bio;
    private String profilePicture;
    
    // getters and setters
}
```

## Security Configuration

Ensure these endpoints are protected and require authentication:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/posts/public/**").permitAll()
                .requestMatchers("/api/categories/**").permitAll()
                .requestMatchers("/api/posts/user/**").authenticated()
                .requestMatchers("/api/user/**").authenticated()
                .requestMatchers("/api/media/**").authenticated()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
            
        return http.build();
    }
}
```

## Database Schema Updates

### Posts Table
```sql
ALTER TABLE posts ADD COLUMN media_type VARCHAR(10) DEFAULT 'TEXT';
ALTER TABLE posts ADD COLUMN media_url VARCHAR(500);
ALTER TABLE posts ADD COLUMN like_count INTEGER DEFAULT 0;
```

### Users Table
```sql
ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users ADD COLUMN profile_picture VARCHAR(500);
```

## File Upload Configuration

### Application Properties
```properties
# File upload settings
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB

# File storage path
app.file.upload-dir=./uploads
app.file.base-url=https://localhost:8080/uploads
```

### File Upload Service
```java
@Service
public class FileUploadService {
    
    @Value("${app.file.upload-dir}")
    private String uploadDir;
    
    @Value("${app.file.base-url}")
    private String baseUrl;
    
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        // Create directory if not exists
        Path uploadPath = Paths.get(uploadDir, folder);
        Files.createDirectories(uploadPath);
        
        // Generate unique filename
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        
        // Save file
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Return URL
        return baseUrl + "/" + folder + "/" + filename;
    }
}
```

## CORS Configuration

Update CORS to allow frontend requests:

```java
@Configuration
public class CorsConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

## Testing the Integration

1. **Start your Spring Boot backend** on `https://localhost:8080`
2. **Accept SSL certificate** by visiting the backend URL in your browser
3. **Start the Next.js frontend** with `npm run dev`
4. **Sign in** to access the user dashboard
5. **Test each feature**:
   - Create posts with text, images, and videos
   - View and edit your posts
   - Update your profile
   - Upload profile pictures

## Error Handling

The frontend handles these error scenarios:
- SSL certificate errors (shows helpful message)
- Authentication failures (redirects to sign-in)
- Network errors (shows error messages)
- Validation errors (displays field-specific errors)

## Environment Variables

Make sure your `.env.local` is configured:
```
NEXT_PUBLIC_BACKEND_BASE_URL=https://localhost:8080
```

## Next Steps

1. Implement the required Spring Boot endpoints
2. Set up file upload handling
3. Configure database schema
4. Test the integration
5. Add any additional validation or business logic

The frontend is now ready to work with your Spring Boot backend once these endpoints are implemented!