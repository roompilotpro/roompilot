package com.roompilot.service;

import com.roompilot.exception.ForbiddenException;
import com.roompilot.exception.NotFoundException;
import com.roompilot.model.User;
import com.roompilot.model.UserRole;
import com.roompilot.model.dto.UserDTO;
import com.roompilot.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Service for user management operations. Handles user CRUD operations and profile updates. */
@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

  /**
   * Get current user by ID.
   *
   * @param userId User ID
   * @return User entity
   * @throws NotFoundException if user not found
   */
  public User getCurrentUser(UUID userId) {
    return userRepository
        .findById(userId)
        .filter(user -> !user.isDeleted())
        .orElseThrow(() -> new NotFoundException("User not found or deleted"));
  }

  /**
   * Update user role. Only allows setting HOST or RESIDENT roles, not ADMIN.
   *
   * @param userId User ID
   * @param role New role (HOST or RESIDENT only)
   * @return Updated user
   * @throws ForbiddenException if role is ADMIN or user is ADMIN
   */
  @Transactional
  public User updateUserRole(UUID userId, UserRole role) {
    // Prevent manual ADMIN role assignment
    if (role == UserRole.ADMIN) {
      throw new ForbiddenException("Admin role cannot be manually assigned");
    }

    User user = getCurrentUser(userId);

    // Prevent changing ADMIN role
    if (user.getRole() == UserRole.ADMIN) {
      throw new ForbiddenException("Admin role cannot be changed");
    }

    user.setRole(role);
    return userRepository.save(user);
  }

  /**
   * Get user by email address.
   *
   * @param email Email address
   * @return User entity
   * @throws NotFoundException if user not found
   */
  public User getUserByEmail(String email) {
    return userRepository
        .findActiveByEmail(email)
        .orElseThrow(() -> new NotFoundException("User not found with email: " + email));
  }

  /**
   * Soft delete a user. Sets deletedAt timestamp instead of physically deleting.
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
    return UserDTO.builder()
        .id(user.getId())
        .email(user.getEmail())
        .fullName(user.getFullName())
        .profilePictureUrl(user.getProfilePictureUrl())
        .phone(user.getPhone())
        .role(user.getRole())
        .createdAt(user.getCreatedAt())
        .lastLogin(user.getLastLogin())
        .build();
  }
}
