package com.roompilot.model.dto;

import com.roompilot.model.UserRole;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data Transfer Object for User entity.
 * Used for API responses - excludes sensitive fields.
 */
public class UserDTO {
    private UUID id;
    private String email;
    private String fullName;
    private String profilePictureUrl;
    private String phone;
    private UserRole role;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;

    // Constructors
    public UserDTO() {
    }

    public UserDTO(UUID id, String email, String fullName, String profilePictureUrl,
                   String phone, UserRole role, LocalDateTime createdAt, LocalDateTime lastLogin) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.profilePictureUrl = profilePictureUrl;
        this.phone = phone;
        this.role = role;
        this.createdAt = createdAt;
        this.lastLogin = lastLogin;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }
}
