# webserviceBlogApp_project
# Introduction
The Blogging Application is a multi-user, full-stack Java Spring Boot application with Next js,Spring Data JPA, and Hibernate, it includes role-based authentication, user management, post and category management, commenting, and like functionality. The application leverages RESTful APIs for frontend integration and supports secure, scalable interactions between Users, Roles, Categories, Posts, Comments, and Likes.
# Frontend
![home](https://github.com/user-attachments/assets/3c670ab6-f883-43b0-bc72-624ef3189392)
# ER Diagram
![home](https://github.com/user-attachments/assets/272ab951-12c0-4383-a2f0-294662a6f301)
# 📚 Tech Stacks
* Backend: Java, Spring Boot, JPA/Hibernate
* Database: PostgreSQL
* Security: Role-based authorization
* Frontend: Next.js (Admin Dashboard & Blog UI)
# ⚙️ Getting Started
## 1️⃣ Prerequisites
* Make sure you have the following installed:
* Java JDK 17+
* Maven 3.8+
* MySQL or PostgreSQL
* Git
* IDE (IntelliJ IDEA, Eclipse, or VS Code recommended)
## 2️⃣ Clone the Repository
```bash
git clone https://github.com/Tilahun-git/webserviceBlogApp_project.git
```
## 3️⃣ Configure Database
* PostgreSQL
```bash
CREATE DATABASE blog_db;
```
## 4️⃣ Build the Project
```bash
mvn clean install
```
## 5️⃣ Run the Application
```bash
mvn spring-boot:run
```
## 6️⃣ Access the Application
* Backend API: http://localhost:8080
## Folder Structure for Frontend blog website
```
└── 📁app
    └── 📁(admin)
        └── 📁admin
            └── 📁posts
                ├── page.tsx
            └── 📁settings
                ├── page.tsx
            └── 📁users
                ├── page.tsx
            ├── layout.tsx
            ├── page.tsx
    └── 📁(user)
        └── 📁dashboard
            ├── layout.tsx
            ├── page.tsx
    └── 📁about
        ├── page.tsx
    └── 📁auth
        └── 📁sign-in
            ├── page.tsx
        └── 📁sign-up
            ├── page.tsx
    └── 📁blog
        └── 📁[id]
            ├── page.tsx
        ├── page.tsx
    └── 📁contact
        ├── page.tsx
    └── 📁posts
        └── 📁[id]
            ├── page.tsx
    ├── favicon.ico
    ├── globals.css
    ├── layout.tsx
    └── page.tsx

└── 📁components
    └── 📁AdminDash
        ├── AdminHeader.tsx
        ├── Dashboard.tsx
        ├── DashPosts.tsx
        ├── DashSidebar.tsx
        ├── DashUsers.tsx
    └── 📁ui
        ├── alert-dialog.tsx
        ├── alert.tsx
        ├── avatar.tsx
        ├── badge.tsx
        ├── button.tsx
        ├── card.tsx
        ├── input.tsx
        ├── label.tsx
        ├── scroll-area.tsx
        ├── select.tsx
        ├── separator.tsx
        ├── sheet.tsx
        ├── sidebar.tsx
        ├── skeleton.tsx
        ├── sonner.tsx
        ├── spinner.tsx
        ├── switch.tsx
        ├── table.tsx
        ├── textarea.tsx
        ├── tooltip.tsx
    └── 📁UserDashboard
        ├── CreatePost.tsx
        ├── MyPosts.tsx
        ├── UserHeader.tsx
        ├── UserProfile.tsx
        ├── UserSidebar.tsx
    ├── Comment.tsx
    ├── CommentSection.tsx
    ├── Features.tsx
    ├── Footer.tsx
    ├── HeroSection.tsx
    ├── LayoutClient.tsx
    ├── MobileNavigation.tsx
    ├── Navbar.tsx
    ├── PostCard.tsx
    ├── provider.tsx
    ├── ThemeProvider.tsx
    └── ThemeToggle.tsx

└── 📁hooks
    └── use-mobile.ts

└── 📁lib
    └── 📁adapters
        ├── postAdapter.ts
    ├── api.ts
    ├── constants.ts
    ├── data.ts
    └── utils.ts

└── 📁redux
    └── 📁auth
        ├── authSlice.ts
        ├── userSlice.ts
    └── store.ts

   ├── .env.local
    ├── .gitignore
    ├── BACKEND_INTEGRATION_GUIDE.md
    ├── components.json
    ├── eslint.config.mjs
    ├── middleware.ts
    ├── next-env.d.ts
    ├── next.config.ts
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.mjs
    ├── README.md
    └── tsconfig.json
```
## Folder Structure Backend blog website
```
└── 📁blogAppBackend
    └── 📁.idea
        ├── .gitignore
        ├── compiler.xml
        ├── encodings.xml
        ├── jarRepositories.xml
        ├── misc.xml
        ├── uiDesigner.xml
        ├── vcs.xml
    └── 📁.mvn
        └── 📁wrapper
            ├── maven-wrapper.properties
    └── 📁src
        └── 📁main
            └── 📁java
                └── 📁com
                    └── 📁blogApplication
                        └── 📁blogApp
                            └── 📁auths
                                ├── AuthController.java
                                ├── JwtAuthFilter.java
                                ├── JwtUtil.java
                            └── 📁config
                                ├── CloudinaryConfig.java
                                ├── ModelMapperConfig.java
                                ├── RoleInitializer.java
                                ├── SecurityConfig.java
                                ├── WebConfig.java
                            └── 📁controllers
                                ├── AdminController.java
                                ├── CategoryController.java
                                ├── CommentController.java
                                ├── PostController.java
                                ├── RoleController.java
                                ├── UserController.java
                            └── 📁dto
                                └── 📁categoryDto
                                    ├── CategoryDto.java
                                └── 📁commentDto
                                    ├── CommentRequestDto.java
                                    ├── CommentResponseDto.java
                                └── 📁postDto
                                    ├── PostDto.java
                                    ├── UpdatePostDto.java
                                └── 📁roleDto
                                    ├── RoleAssignDto.java
                                    ├── RoleDto.java
                                └── 📁userDto
                                    ├── LoginRequestDto.java
                                    ├── LoginResponseDto.java
                                    ├── RegisterRequestDto.java
                                    ├── ResetPasswordDto.java
                                    ├── UserChangePassword.java
                                    ├── UserResponseDto.java
                                    ├── UserUpdateDto.java
                            └── 📁entities
                                ├── Category.java
                                ├── Comment.java
                                ├── Like.java
                                ├── Post.java
                                ├── Role.java
                                ├── User.java
                            └── 📁exceptions
                                ├── GlobalExceptionHandler.java
                                ├── ResourceNotFoundException.java
                            └── 📁payloads
                                ├── UserStatus.java
                            └── 📁repositories
                                ├── CategoryRepo.java
                                ├── CommentRepo.java
                                ├── LikeRepo.java
                                ├── PostRepo.java
                                ├── RoleRepo.java
                                ├── UserRepo.java
                            └── 📁services
                                └── 📁servicesContract
                                    ├── CategoryServiceContract.java
                                    ├── CloudinaryMediaServiceContract.java
                                    ├── CommentServiceContract.java
                                    ├── PostServiceContract.java
                                    ├── RoleServiceContract.java
                                    ├── UserServiceContract.java
                                └── 📁servicesImpl
                                    ├── CategoryServiceImpl.java
                                    ├── CloudinaryMediaServiceImpl.java
                                    ├── CommentServiceImpl.java
                                    ├── PostServiceImpl.java
                                    ├── RoleServiceImpl.java
                                    ├── SecurityService.java
                                    ├── UserServiceImpl.java
                            ├── BlogAppApplication.java
            └── 📁resources
                ├── application.properties
                ├── myapp.p12
        └── 📁test
            └── 📁java
                └── 📁com
                    └── 📁blogApplication
                        └── 📁blogApp
                            ├── BlogAppApplicationTests.java
    └── 📁target
        └── 📁classes
            └── 📁com
                └── 📁blogApplication
                    └── 📁blogApp
                        └── 📁auths
                            ├── AuthController.class
                            ├── JwtAuthFilter.class
                            ├── JwtUtil.class
                        └── 📁config
                            ├── CloudinaryConfig.class
                            ├── ModelMapperConfig.class
                            ├── SecurityConfig.class
                            ├── WebConfig.class
                        └── 📁controllers
                            ├── CategoryController.class
                            ├── CommentController.class
                            ├── PostController.class
                            ├── RoleController.class
                            ├── UserController.class
                        └── 📁dto
                            └── 📁categoryDto
                                ├── CategoryDto.class
                            └── 📁commentDto
                                ├── CommentRequestDto.class
                                ├── CommentResponseDto.class
                            └── 📁postDto
                                ├── PostDto.class
                            └── 📁roleDto
                                ├── RoleDto.class
                            └── 📁userDto
                                ├── LoginRequestDto.class
                                ├── LoginResponseDto.class
                                ├── RegisterRequestDto.class
                                ├── UserChangePassword.class
                                ├── UserResponseDto.class
                                ├── UserUpdateDto.class
                        └── 📁entities
                            ├── Category.class
                            ├── Comment.class
                            ├── Like.class
                            ├── Post.class
                            ├── Role.class
                            ├── User.class
                        └── 📁exceptions
                            ├── GlobalExceptionHandler.class
                            ├── ResourceNotFoundException.class
                        └── 📁repositories
                            ├── CategoryRepo.class
                            ├── CommentRepo.class
                            ├── LikeRepo.class
                            ├── PostRepo.class
                            ├── RoleRepo.class
                            ├── UserRepo.class
                        └── 📁services
                            └── 📁servicesContract
                                ├── CategoryServiceContract.class
                                ├── CloudinaryImageServiceContract.class
                                ├── CloudinaryMediaServiceContract.class
                                ├── CommentServiceContract.class
                                ├── PostServiceContract.class
                                ├── RoleServiceContract.class
                                ├── UserServiceContract.class
                            └── 📁servicesImpl
                                ├── CategoryServiceImpl.class
                                ├── CloudinaryImageServiceImpl.class
                                ├── CloudinaryMediaServiceImpl.class
                                ├── CommentServiceImpl.class
                                ├── PostServiceImpl.class
                                ├── RoleServiceImpl.class
                                ├── SecurityService.class
                                ├── UserServiceImpl.class
                        ├── BlogAppApplication.class
            ├── application.properties
            ├── myapp.p12
        └── 📁generated-sources
            └── 📁annotations
        └── 📁generated-test-sources
            └── 📁test-annotations
        └── 📁test-classes
            └── 📁com
                └── 📁blogApplication
                    └── 📁blogApp
                        ├── BlogAppApplicationTests.class
    ├── blogApp.iml
    ├── mvnw
    ├── mvnw.cmd
    └── pom.xml
```











