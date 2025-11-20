package com.roompilot.service;

import com.roompilot.exception.AuthenticationException;
import com.roompilot.model.User;
import com.roompilot.model.UserRole;
import com.roompilot.model.dto.UserDTO;
import com.roompilot.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Service for user management operations.
 * Handles user CRUD operations and profile updates.
 */
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Get current user by ID.
     *
     * @param userId User ID
     * @return User entity
     * @throws AuthenticationException if user not found
     */
    public User getCurrentUser(UUID userId) {
        return userRepository.findById(userId)
                .filter(user -> !user.isDeleted())
                .orElseThrow(() -> new AuthenticationException("User not found or deleted"));
    }

    /**
     * Update user role.
     * Only allows setting HOST or RESIDENT roles, not ADMIN.
     *
     * @param userId User ID
     * @param role   New role (HOST or RESIDENT only)
     * @return Updated user
     * @throws AuthenticationException if user not found or role is ADMIN
     */
    @Transactional
    public User updateUserRole(UUID userId, UserRole role) {
        // Prevent manual ADMIN role assignment
        if (role == UserRole.ADMIN) {
            throw new AuthenticationException("Admin role cannot be manually assigned");
        }

        User user = getCurrentUser(userId);

        // Prevent changing ADMIN role
        if (user.getRole() == UserRole.ADMIN) {
            throw new AuthenticationException("Admin role cannot be changed");
        }

        user.setRole(role);
        return userRepository.save(user);
    }

    /**
     * Get user by email address.
     *
     * @param email Email address
     * @return User entity
     * @throws AuthenticationException if user not found
     */
    public User getUserByEmail(String email) {
        return userRepository.findActiveByEmail(email)
                .orElseThrow(() -> new AuthenticationException("User not found with email: " + email));
    }

    /**
     * Soft delete a user.
     * Sets deletedAt timestamp instead of physically deleting.
     *
     * @param userId User ID to delete
     */
    @Transactional
    public void deleteUser(UUID userId) {
        User user = getCurrentUser(userId);
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    /**
     * Convert User entity to UserDTO.
     *
     * @param user User entity
     * @return UserDTO
     */
    public UserDTO toDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getProfilePictureUrl(),
                user.getPhone(),
                user.getRole(),
                user.getCreatedAt(),
                user.getLastLogin()
        );
    }
}
