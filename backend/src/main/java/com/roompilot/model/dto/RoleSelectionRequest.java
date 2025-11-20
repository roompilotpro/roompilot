package com.roompilot.model.dto;

import com.roompilot.model.UserRole;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for role selection during user onboarding.
 * Users must select either HOST or RESIDENT role.
 */
public class RoleSelectionRequest {

    @NotNull(message = "Role is required")
    private UserRole role;

    // Constructors
    public RoleSelectionRequest() {
    }

    public RoleSelectionRequest(UserRole role) {
        this.role = role;
    }

    // Getters and Setters
    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}
