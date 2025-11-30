package com.roompilot.controller;

import com.roompilot.model.EmploymentStatus;
import com.roompilot.model.dto.ResidentProfileDTO;
import com.roompilot.model.dto.ResidentProfileRequest;
import com.roompilot.security.CustomUserDetails;
import com.roompilot.service.ResidentProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for resident profile operations. All endpoints require authentication and
 * RESIDENT role.
 */
@RestController
@RequestMapping("/api/residents")
@Tag(name = "Resident Profile", description = "Endpoints for managing resident profiles")
@Slf4j
@RequiredArgsConstructor
public class ResidentController {

  private final ResidentProfileService residentProfileService;

  /** Create a new resident profile. */
  @PostMapping("/profile")
  @PreAuthorize("hasRole('RESIDENT')")
  @Operation(
      summary = "Create resident profile",
      description = "Create a new profile for the authenticated resident user")
  @ApiResponses({
    @ApiResponse(responseCode = "201", description = "Profile created successfully"),
    @ApiResponse(responseCode = "400", description = "Invalid request or profile already exists"),
    @ApiResponse(responseCode = "403", description = "User is not a RESIDENT")
  })
  public ResponseEntity<ResidentProfileDTO> createProfile(
      @Valid @RequestBody ResidentProfileRequest request, Authentication authentication) {
    CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
    ResidentProfileDTO profile =
        residentProfileService.createProfile(userDetails.getUser().getId(), request);
    return ResponseEntity.status(HttpStatus.CREATED).body(profile);
  }

  /** Get the current user's resident profile. */
  @GetMapping("/profile")
  @PreAuthorize("hasRole('RESIDENT')")
  @Operation(
      summary = "Get resident profile",
      description = "Get the profile for the authenticated resident user")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Profile retrieved successfully"),
    @ApiResponse(responseCode = "404", description = "Profile not found")
  })
  public ResponseEntity<ResidentProfileDTO> getProfile(Authentication authentication) {
    CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
    ResidentProfileDTO profile = residentProfileService.getProfile(userDetails.getUser().getId());
    return ResponseEntity.ok(profile);
  }

  /** Update the current user's resident profile. */
  @PutMapping("/profile")
  @PreAuthorize("hasRole('RESIDENT')")
  @Operation(
      summary = "Update resident profile",
      description = "Update the profile for the authenticated resident user")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Profile updated successfully"),
    @ApiResponse(responseCode = "400", description = "Invalid request"),
    @ApiResponse(responseCode = "404", description = "Profile not found")
  })
  public ResponseEntity<ResidentProfileDTO> updateProfile(
      @Valid @RequestBody ResidentProfileRequest request, Authentication authentication) {
    CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
    ResidentProfileDTO profile =
        residentProfileService.updateProfile(userDetails.getUser().getId(), request);
    return ResponseEntity.ok(profile);
  }

  /** Check if the current user has completed their profile. */
  @GetMapping("/profile/status")
  @PreAuthorize("hasRole('RESIDENT')")
  @Operation(
      summary = "Check profile status",
      description = "Check if the authenticated resident user has completed their profile")
  @ApiResponses({@ApiResponse(responseCode = "200", description = "Status retrieved successfully")})
  public ResponseEntity<Map<String, Boolean>> getProfileStatus(Authentication authentication) {
    CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
    boolean completed = residentProfileService.isProfileCompleted(userDetails.getUser().getId());
    return ResponseEntity.ok(Map.of("profileCompleted", completed));
  }

  /**
   * Get all employment status options. This endpoint is publicly accessible for populating form
   * dropdowns.
   */
  @GetMapping("/employment-statuses")
  @PreAuthorize("isAuthenticated()")
  @Operation(
      summary = "Get employment statuses",
      description = "Get all available employment status options")
  public ResponseEntity<List<Map<String, String>>> getEmploymentStatuses() {
    List<Map<String, String>> statuses =
        Arrays.stream(EmploymentStatus.values())
            .map(
                status ->
                    Map.of(
                        "value", status.name(),
                        "label", status.getDisplayLabel(),
                        "description", status.getDescription()))
            .collect(Collectors.toList());
    return ResponseEntity.ok(statuses);
  }
}
