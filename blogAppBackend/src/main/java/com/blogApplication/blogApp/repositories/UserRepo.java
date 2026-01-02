package com.blogApplication.blogApp.repositories;

import com.blogApplication.blogApp.entities.User;
import com.blogApplication.blogApp.payloads.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    Page<User> findByUsernameContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            String username,
            String firstName,
            String lastName,
            Pageable pageable
    );


    Page<User> findByIsDeletedFalse(Pageable pageable);

    Optional<User> findByPasswordResetToken(String passwordResetToken);

    List<User> findByStatus(UserStatus status);

    @Query("SELECT DISTINCT u FROM User u JOIN u.roles r WHERE r.name = :roleName")
    List<User> findByRoleName(@Param("roleName") String roleName);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.id = :id")
    Optional<User> findByIdWithRoles(@Param("id") long id);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.status != 'DELETED'")
    List<User> findAllActiveUsersWithRoles();

    @Modifying
    @Query("UPDATE User u SET u.status = 'DELETED', u.deletedAt = :deletedAt WHERE u.id = :id")
    int softDelete(@Param("id") Long id, @Param("deletedAt") LocalDateTime deletedAt);

    long countByIsDeletedFalse();


}
