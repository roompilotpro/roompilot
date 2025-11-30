package com.roompilot.service;

import com.roompilot.exception.BadRequestException;
import com.roompilot.exception.ForbiddenException;
import com.roompilot.exception.NotFoundException;
import com.roompilot.model.EmploymentStatus;
import com.roompilot.model.ResidentProfile;
import com.roompilot.model.User;
import com.roompilot.model.UserRole;
import com.roompilot.model.dto.ResidentProfileDTO;
import com.roompilot.model.dto.ResidentProfileRequest;
import com.roompilot.repository.ResidentProfileRepository;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Service for managing resident profiles. Handles profile creation, retrieval, and updates. */
@Service
@RequiredArgsConstructor
@Slf4j
@SuppressFBWarnings(value = "EI_EXPOSE_REP2", justification = "Spring-managed DI components")
public class ResidentProfileService {

  private final ResidentProfileRepository residentProfileRepository;
  private final UserService userService;

  /**
   * Create a new resident profile for the given user.
   *
   * @param userId the user's UUID
   * @param request the profile creation request
   * @return the created profile as DTO
   * @throws ForbiddenException if user is not a RESIDENT
   * @throws BadRequestException if profile already exists
   */
  @Transactional
  public ResidentProfileDTO createProfile(UUID userId, ResidentProfileRequest request) {
    User user = userService.getCurrentUser(userId);

    // Verify user has RESIDENT role
    if (user.getRole() != UserRole.RESIDENT) {
      throw new ForbiddenException("Only RESIDENT users can create a resident profile");
    }

    // Check if profile already exists
    if (residentProfileRepository.existsByUserId(userId)) {
      throw new BadRequestException("Profile already exists for this user");
    }

    ResidentProfile profile =
        new ResidentProfile(
            user, request.getBio(), request.getEmploymentStatus(), request.getPhone());

    ResidentProfile savedProfile = residentProfileRepository.save(profile);
    log.info("Created resident profile for user: {}", userId);

    return toDTO(savedProfile);
  }

  /**
   * Get the resident profile for the given user.
   *
   * @param userId the user's UUID
   * @return the profile as DTO
   * @throws NotFoundException if profile doesn't exist
   */
  public ResidentProfileDTO getProfile(UUID userId) {
    ResidentProfile profile =
        residentProfileRepository
            .findByUserId(userId)
            .orElseThrow(() -> new NotFoundException("Resident profile not found"));

    return toDTO(profile);
  }

  /**
   * Update an existing resident profile.
   *
   * @param userId the user's UUID
   * @param request the profile update request
   * @return the updated profile as DTO
   * @throws NotFoundException if profile doesn't exist
   * @throws ForbiddenException if user is not a RESIDENT
   */
  @Transactional
  public ResidentProfileDTO updateProfile(UUID userId, ResidentProfileRequest request) {
    User user = userService.getCurrentUser(userId);

    // Verify user has RESIDENT role
    if (user.getRole() != UserRole.RESIDENT) {
      throw new ForbiddenException("Only RESIDENT users can update a resident profile");
    }

    ResidentProfile profile =
        residentProfileRepository
            .findByUserId(userId)
            .orElseThrow(() -> new NotFoundException("Resident profile not found"));

    profile.setBio(request.getBio());
    profile.setEmploymentStatus(request.getEmploymentStatus());
    profile.setPhone(request.getPhone());

    ResidentProfile updatedProfile = residentProfileRepository.save(profile);
    log.info("Updated resident profile for user: {}", userId);

    return toDTO(updatedProfile);
  }

  /**
   * Check if a user has completed their resident profile.
   *
   * @param userId the user's UUID
   * @return true if profile exists and is completed
   */
  public boolean isProfileCompleted(UUID userId) {
    return residentProfileRepository
        .findByUserId(userId)
        .map(ResidentProfile::getProfileCompleted)
        .orElse(false);
  }

  /**
   * Convert a ResidentProfile entity to DTO.
   *
   * @param profile the entity
   * @return the DTO
   */
  public ResidentProfileDTO toDTO(ResidentProfile profile) {
    EmploymentStatus status = profile.getEmploymentStatus();
    return ResidentProfileDTO.builder()
        .id(profile.getId())
        .userId(profile.getUser().getId())
        .bio(profile.getBio())
        .employmentStatus(status)
        .employmentStatusLabel(status != null ? status.getDisplayLabel() : null)
        .phone(profile.getPhone())
        .profileCompleted(profile.getProfileCompleted())
        .createdAt(profile.getCreatedAt())
        .updatedAt(profile.getUpdatedAt())
        .build();
  }
}
