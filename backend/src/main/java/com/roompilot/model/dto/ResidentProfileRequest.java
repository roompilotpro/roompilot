package com.roompilot.model.dto;

import com.roompilot.model.EmploymentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request DTO for creating or updating a resident profile. Contains validation constraints matching
 * the database constraints.
 */
@Data
public class ResidentProfileRequest {

  @NotBlank(message = "Bio is required")
  @Size(min = 50, max = 1000, message = "Bio must be between 50 and 1000 characters")
  private String bio;

  @NotNull(message = "Employment status is required")
  private EmploymentStatus employmentStatus;

  private String phone;
}
