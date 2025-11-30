package com.roompilot.controller;

import com.roompilot.exception.AuthenticationException;
import com.roompilot.model.User;
import com.roompilot.model.UserRole;
import com.roompilot.model.dto.AuthResponse;
import com.roompilot.model.dto.RoleSelectionRequest;
import com.roompilot.model.dto.UserDTO;
import com.roompilot.security.CustomUserDetails;
import com.roompilot.service.AuthService;
import com.roompilot.service.UserService;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Locale;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for authentication endpoints. Handles OAuth callbacks, login, role selection, and user
 * profile access.
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication and authorization endpoints")
@Slf4j
@SuppressFBWarnings(value = "EI_EXPOSE_REP2", justification = "Spring-managed DI components")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;
  private final UserService userService;

  /**
   * Handle Google OAuth callback. Exchanges authorization code for JWT token.
   *
   * @param request Map containing authorization code
   * @return AuthResponse with JWT token and user data
   */
  @PostMapping("/google/callback")
  @Operation(summary = "Handle Google OAuth callback")
  public ResponseEntity<AuthResponse> googleCallback(@RequestBody Map<String, String> request) {
    try {
      String code = request.get("code");
      if (code == null || code.trim().isEmpty()) {
        throw new AuthenticationException("Authorization code is required");
      }

      AuthResponse response = authService.handleGoogleCallback(code);
      return ResponseEntity.ok(response);

    } catch (AuthenticationException e) {
      log.error("Authentication failed: {}", e.getMessage());
      throw e;
    }
  }

  /**
   * Get current authenticated user.
   *
   * @param authentication Spring Security authentication object
   * @return Current user data
   */
  @GetMapping("/me")
  @Operation(summary = "Get current user", description = "Requires authentication")
  public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
    CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
    User user = userDetails.getUser();
    UserDTO userDTO = userService.toDTO(user);
    return ResponseEntity.ok(userDTO);
  }

  /**
   * Select role during user onboarding. Users must select HOST or RESIDENT role after first login.
   *
   * @param request Role selection request
   * @param authentication Spring Security authentication object
   * @return Updated user data
   */
  @PostMapping("/role")
  @Operation(
      summary = "Select user role",
      description = "Set role to HOST or RESIDENT during onboarding")
  public ResponseEntity<UserDTO> selectRole(
      @Valid @RequestBody RoleSelectionRequest request, Authentication authentication) {

    CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
    User currentUser = userDetails.getUser();

    User updatedUser = authService.selectRole(currentUser.getId(), request.getRole());
    UserDTO userDTO = userService.toDTO(updatedUser);

    return ResponseEntity.ok(userDTO);
  }

  /**
   * Logout endpoint. Currently just returns success - token invalidation happens client-side.
   * Future: Implement token blacklist for server-side invalidation.
   *
   * @return Success message
   */
  @PostMapping("/logout")
  @Operation(summary = "Logout", description = "Logout current user")
  public ResponseEntity<Map<String, String>> logout() {
    // Token blacklist implementation can be added here if needed
    return ResponseEntity.ok(Map.of("message", "Logout successful"));
  }

  /**
   * Development authentication endpoint. Only works when ENABLE_DEV_AUTH=true.
   *
   * @param request Map containing email and optional role
   * @return AuthResponse with JWT token
   */
  @PostMapping("/dev/login")
  @Operation(
      summary = "Development login",
      description = "For testing only - requires ENABLE_DEV_AUTH=true")
  public ResponseEntity<AuthResponse> devLogin(@RequestBody Map<String, String> request) {
    try {
      String email = request.get("email");
      if (email == null || email.trim().isEmpty()) {
        throw new AuthenticationException("Email is required for dev login");
      }

      UserRole role = null;
      if (request.containsKey("role") && request.get("role") != null) {
        role = UserRole.valueOf(request.get("role").toUpperCase(Locale.ROOT));
      }

      AuthResponse response = authService.handleDevAuth(email, role);
      return ResponseEntity.ok(response);

    } catch (AuthenticationException e) {
      log.error("Dev authentication failed: {}", e.getMessage());
      throw e;
    } catch (IllegalArgumentException e) {
      throw new AuthenticationException("Invalid role provided");
    }
  }
}
