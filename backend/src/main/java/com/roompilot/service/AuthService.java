package com.roompilot.service;

import com.roompilot.exception.AuthenticationException;
import com.roompilot.exception.ForbiddenException;
import com.roompilot.model.User;
import com.roompilot.model.UserRole;
import com.roompilot.model.dto.AuthResponse;
import com.roompilot.model.dto.GoogleTokenResponse;
import com.roompilot.model.dto.GoogleUserInfo;
import com.roompilot.model.dto.UserDTO;
import com.roompilot.repository.UserRepository;
import com.roompilot.util.AdminEmailValidator;
import com.roompilot.util.LogSanitizerUtil;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for authentication operations. Orchestrates Google OAuth flow, user creation, and role
 * management.
 */
@Service
@Slf4j
@SuppressFBWarnings(value = "EI_EXPOSE_REP2", justification = "Spring-managed DI components")
@RequiredArgsConstructor
public class AuthService {

  private final GoogleOAuthService googleOAuthService;
  private final JwtService jwtService;
  private final UserRepository userRepository;
  private final UserService userService;
  private final AdminEmailValidator adminEmailValidator;

  @Value("${app.enable-dev-auth:false}")
  private boolean enableDevAuth;

  /**
   * Handle Google OAuth callback. Exchanges code for token, fetches user info, creates or updates
   * user, generates JWT.
   *
   * @param code Authorization code from Google
   * @return AuthResponse with JWT token and user data
   * @throws AuthenticationException if OAuth flow fails
   */
  @Transactional
  public AuthResponse handleGoogleCallback(String code) {
    try {
      // Exchange code for access token
      GoogleTokenResponse tokenResponse = googleOAuthService.exchangeCodeForToken(code);

      // Fetch user info from Google
      GoogleUserInfo googleUserInfo =
          googleOAuthService.getUserInfo(tokenResponse.getAccessToken());

      // Find or create user
      User user = findOrCreateUser(googleUserInfo);

      // Update last login
      user.setLastLogin(LocalDateTime.now());
      user = userRepository.save(user);

      // Generate JWT token
      String jwtToken = jwtService.generateToken(user);

      // Convert to DTO
      UserDTO userDTO = userService.toDTO(user);

      // Check if user has selected role
      boolean hasSelectedRole = user.hasRole();

      return new AuthResponse(jwtToken, userDTO, hasSelectedRole);

    } catch (AuthenticationException e) {
      throw e;
    } catch (Exception e) {
      log.error("Error during Google OAuth callback: {}", e.getMessage(), e);
      throw new AuthenticationException("Failed to authenticate with Google", e);
    }
  }

  /**
   * Find existing user or create new user from Google profile. Automatically assigns ADMIN role if
   * email is in whitelist. If user exists by email but has different Google ID (e.g., created via
   * dev auth), update their Google ID.
   *
   * @param googleUserInfo Google user information
   * @return User entity
   */
  private User findOrCreateUser(GoogleUserInfo googleUserInfo) {
    // First, try to find by Google ID
    Optional<User> existingUser = userRepository.findActiveByGoogleId(googleUserInfo.getSub());

    if (existingUser.isPresent()) {
      return existingUser.get();
    }

    // Check if user exists by email (might be dev user or previous login)
    Optional<User> userByEmail = userRepository.findActiveByEmail(googleUserInfo.getEmail());

    if (userByEmail.isPresent()) {
      // Update existing user with Google ID and profile info
      User user = userByEmail.get();
      user.setGoogleId(googleUserInfo.getSub());
      user.setFullName(
          googleUserInfo.getName() != null ? googleUserInfo.getName() : googleUserInfo.getEmail());
      user.setProfilePictureUrl(googleUserInfo.getPicture());
      user.setIsDevUser(false); // Mark as real OAuth user now

      log.info("Updated existing user {} with Google OAuth information", user.getEmail());
      return userRepository.save(user);
    }

    // Create new user
    User newUser = new User();
    newUser.setGoogleId(googleUserInfo.getSub());
    newUser.setEmail(googleUserInfo.getEmail());
    newUser.setFullName(
        googleUserInfo.getName() != null ? googleUserInfo.getName() : googleUserInfo.getEmail());
    newUser.setProfilePictureUrl(googleUserInfo.getPicture());
    newUser.setIsDevUser(false);

    // Check if user should be admin
    if (adminEmailValidator.isAdminEmail(googleUserInfo.getEmail())) {
      newUser.setRole(UserRole.ADMIN);
      log.info(
          "Auto-assigned ADMIN role to user: {}",
          LogSanitizerUtil.sanitizeForLog(googleUserInfo.getEmail()));
    } else {
      // New non-admin users start with null role (must select during onboarding)
      newUser.setRole(null);
    }

    return userRepository.save(newUser);
  }

  /**
   * Select role for new user during onboarding. Only allows HOST or RESIDENT roles.
   *
   * @param userId User ID
   * @param role Selected role (HOST or RESIDENT)
   * @return Updated user
   * @throws AuthenticationException if role selection is invalid
   */
  @Transactional
  public User selectRole(UUID userId, UserRole role) {
    if (role == UserRole.ADMIN) {
      throw new AuthenticationException("Cannot manually select ADMIN role");
    }

    User user = userService.getCurrentUser(userId);

    if (user.getRole() == UserRole.ADMIN) {
      throw new ForbiddenException("Admin users cannot change their role");
    }

    if (user.hasRole() && user.getRole() != role) {
      log.warn("User {} attempting to change role from {} to {}", userId, user.getRole(), role);
      throw new ForbiddenException("Role has already been selected");
    }

    user.setRole(role);
    return userRepository.save(user);
  }

  /**
   * Development authentication for testing. Creates or finds user by email and generates JWT token.
   * Only works when ENABLE_DEV_AUTH=true.
   *
   * @param email User email
   * @param role Optional role to assign
   * @return AuthResponse with JWT token and user data
   * @throws AuthenticationException if dev auth is disabled
   */
  @Transactional
  public AuthResponse handleDevAuth(String email, UserRole role) {
    if (!enableDevAuth) {
      throw new AuthenticationException("Development authentication is disabled");
    }

    log.warn(
        "Development authentication used for email: {}", LogSanitizerUtil.sanitizeForLog(email));

    Optional<User> existingUser = userRepository.findActiveByEmail(email);

    User user;
    if (existingUser.isPresent()) {
      user = existingUser.get();
      // Update role if provided and user doesn't already have one
      if (role != null && !user.hasRole()) {
        user.setRole(role);
      }
    } else {
      // Create new dev user
      user = new User();
      user.setGoogleId("dev-" + UUID.randomUUID()); // Fake Google ID for dev users
      user.setEmail(email);
      user.setFullName(email);
      user.setIsDevUser(true);

      if (adminEmailValidator.isAdminEmail(email)) {
        user.setRole(UserRole.ADMIN);
      } else if (role != null) {
        user.setRole(role);
      }
    }

    user.setLastLogin(LocalDateTime.now());
    user = userRepository.save(user);

    // Generate JWT token
    String jwtToken = jwtService.generateToken(user);

    // Convert to DTO
    UserDTO userDTO = userService.toDTO(user);

    // Check if user has selected role
    boolean hasSelectedRole = user.hasRole();

    return new AuthResponse(jwtToken, userDTO, hasSelectedRole);
  }
}
