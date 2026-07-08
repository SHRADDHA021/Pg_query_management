package com.pg.management.repository;

import com.pg.management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByStatus(User.UserStatus status);
    List<User> findByRole(User.Role role);
    List<User> findByRoleAndStatus(User.Role role, User.UserStatus status);
    long countByStatus(User.UserStatus status);
    long countByRole(User.Role role);
}
