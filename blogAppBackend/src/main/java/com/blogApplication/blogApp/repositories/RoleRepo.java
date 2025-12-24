package com.blogApplication.blogApp.repositories;

import com.blogApplication.blogApp.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepo extends JpaRepository<Role,Long> , JpaSpecificationExecutor<Role> {
    Optional<Role> findById(Long id);
}