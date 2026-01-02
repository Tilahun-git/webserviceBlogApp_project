package com.blogApplication.blogApp.repositories;

import com.blogApplication.blogApp.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface RoleRepo extends JpaRepository<Role,Long> , JpaSpecificationExecutor<Role> {
    Optional<Role> findByName(String roleName);

    List<Role> findByIsDefault(boolean isDefault);
    List<Role> findByIsSystem(boolean isSystem);

    @Query("SELECT r FROM Role r WHERE r.name IN :roleNames")
    Set<Role> findRolesByNames(@Param("roleNames") Set<String> roleNames);

    @Query("SELECT r FROM Role r JOIN r.users u WHERE u.id = :userId")
    Set<Role> findRolesByUserId(@Param("userId") Long userId);

    boolean existsByName(String name);
}