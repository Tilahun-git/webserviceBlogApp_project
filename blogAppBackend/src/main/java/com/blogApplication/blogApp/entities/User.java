package com.blogApplication.blogApp.entities;

import com.blogApplication.blogApp.payloads.UserStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column
    private String firstName;

    @Column
    private String lastName;

    @Column(unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true,nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.ACTIVE;

    private boolean isDeleted;

    @Column(name = "profile_media_url")
    private String mediaUrl;

    @Column(name="password_reset_token")
    private String passwordResetToken;

    @Column(name = "token_expiry_date")
    private LocalDateTime tokenExpiryDate;

    @Column(name = "is_token_validated")
    private boolean tokenValidated = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column
    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;


    @ManyToMany(fetch = FetchType.EAGER

    )
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @OneToMany(
            fetch = FetchType.LAZY,
            mappedBy = "author",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Set<Post> posts = new HashSet<>();

    @OneToMany(
            fetch = FetchType.LAZY,
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Set<Comment> comments = new HashSet<>();


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

     Set<String> roleNames = new HashSet<>();

    public boolean hasRole(String roleName) {
        return this.roles.stream()
                .anyMatch(role -> role.getName() != null && role.getName().equals(roleName));
    }
public Set<String> getRoleNames() {
    Set<String> roleNames = new HashSet<>();
    for (Role role : this.roles) {
        if (role.getName() != null) {
            roleNames.add(role.getName());
        }
    }
    return roleNames;
}



// Helper method to add role

    public void addRole(Role role) {
        this.roles.add(role);
        role.getUsers().add(this);
    }

    // Helper method to remove role

    public void removeRole(Role role) {
        this.roles.remove(role);
        role.getUsers().remove(this);
    }


}
