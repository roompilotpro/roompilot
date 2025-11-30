package com.roompilot.repository;

import com.roompilot.model.ResidentProfile;
import com.roompilot.model.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/** Repository for ResidentProfile entity. Provides methods to query resident profiles by user. */
@Repository
public interface ResidentProfileRepository extends JpaRepository<ResidentProfile, UUID> {

  /**
   * Find a resident profile by user.
   *
   * @param user the user entity
   * @return Optional containing the profile if found
   */
  Optional<ResidentProfile> findByUser(User user);

  /**
   * Find a resident profile by user ID.
   *
   * @param userId the user's UUID
   * @return Optional containing the profile if found
   */
  Optional<ResidentProfile> findByUserId(UUID userId);

  /**
   * Check if a profile exists for a user.
   *
   * @param userId the user's UUID
   * @return true if a profile exists
   */
  boolean existsByUserId(UUID userId);
}
