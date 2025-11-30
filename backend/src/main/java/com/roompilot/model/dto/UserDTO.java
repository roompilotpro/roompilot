package com.roompilot.model.dto;

import com.roompilot.model.UserRole;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

/** Data Transfer Object for User entity. Used for API responses - excludes sensitive fields. */
@Data
@Builder
public class UserDTO {
  private UUID id;
  private String email;
  private String fullName;
  private String profilePictureUrl;
  private String phone;
  private UserRole role;
  private LocalDateTime createdAt;
  private LocalDateTime lastLogin;
}
