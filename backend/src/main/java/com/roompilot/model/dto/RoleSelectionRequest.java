package com.roompilot.model.dto;

import com.roompilot.model.UserRole;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Request DTO for role selection during user onboarding. Users must select either HOST or RESIDENT
 * role.
 */
@Data
public class RoleSelectionRequest {

  @NotNull(message = "Role is required")
  private UserRole role;
}
