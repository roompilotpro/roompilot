package com.roompilot.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.time.LocalDateTime;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Standardized error response DTO for all API errors. Matches the format used by
 * JwtAuthenticationEntryPoint for consistency.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@SuppressFBWarnings(
    value = {"EI_EXPOSE_REP", "EI_EXPOSE_REP2"},
    justification = "DTO with Lombok-generated accessors")
public class ErrorResponse {

  private LocalDateTime timestamp;
  private int status;
  private String error;
  private String message;
  private String path;

  /** Optional field for validation errors. Maps field names to error messages. */
  private Map<String, String> validationErrors;
}
