package com.roompilot.model.dto;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Authentication response containing JWT token and user data. Returned after successful Google
 * OAuth login or development auth.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuppressFBWarnings(
    value = {"EI_EXPOSE_REP", "EI_EXPOSE_REP2"},
    justification = "DTO with Lombok-generated accessors")
public class AuthResponse {
  private String token;
  private static final String TOKEN_TYPE = "Bearer";
  private UserDTO user;
  private boolean hasSelectedRole;
}
