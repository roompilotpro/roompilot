package com.roompilot.repository;

import com.roompilot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for User entity.
 * Provides database operations for user authentication and management.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Find user by Google OAuth ID.
     *
     * @param googleId Google OAuth sub claim
     * @return Optional containing user if found
     */
    Optional<User> findByGoogleId(String googleId);

    /**
     * Find user by email address.
     *
     * @param email User email
     * @return Optional containing user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if user exists by Google OAuth ID.
     *
     * @param googleId Google OAuth sub claim
     * @return true if user exists
     */
    boolean existsByGoogleId(String googleId);

    /**
     * Find users by email addresses (bulk lookup).
     *
     * @param emails List of email addresses
     * @return List of users matching the emails
     */
    List<User> findByEmailIn(List<String> emails);

    /**
     * Find all non-deleted users.
     *
     * @return List of active users
     */
    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL")
    List<User> findAllActive();

    /**
     * Find user by Google ID and ensure not deleted.
     *
     * @param googleId Google OAuth sub claim
     * @return Optional containing user if found and not deleted
     */
    @Query("SELECT u FROM User u WHERE u.googleId = :googleId AND u.deletedAt IS NULL")
    Optional<User> findActiveByGoogleId(String googleId);

    /**
     * Find user by email and ensure not deleted.
     *
     * @param email User email
     * @return Optional containing user if found and not deleted
     */
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.deletedAt IS NULL")
    Optional<User> findActiveByEmail(String email);
}
