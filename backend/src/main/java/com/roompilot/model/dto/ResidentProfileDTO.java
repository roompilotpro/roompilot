package com.roompilot.model.dto;

import com.roompilot.model.EmploymentStatus;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

/** DTO for resident profile responses. Contains the profile data that can be shared externally. */
@Data
@Builder
public class ResidentProfileDTO {
  private UUID id;
  private UUID userId;
  private String bio;
  private EmploymentStatus employmentStatus;
  private String employmentStatusLabel;
  private String phone;
  private Boolean profileCompleted;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
