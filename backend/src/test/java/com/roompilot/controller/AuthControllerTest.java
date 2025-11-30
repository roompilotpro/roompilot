package com.roompilot.controller;

import static com.roompilot.fixtures.TestConstants.Messages.*;
import static com.roompilot.fixtures.TestConstants.TestData.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.roompilot.exception.AuthenticationException;
import com.roompilot.model.User;
import com.roompilot.model.UserRole;
import com.roompilot.model.dto.AuthResponse;
import com.roompilot.model.dto.RoleSelectionRequest;
import com.roompilot.model.dto.UserDTO;
import com.roompilot.security.CustomUserDetails;
import com.roompilot.service.AuthService;
import com.roompilot.service.UserService;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthController Tests")
class AuthControllerTest {

  @Mock private AuthService authService;

  @Mock private UserService userService;

  @Mock private Authentication authentication;

  @InjectMocks private AuthController authController;

  private User testUser;
  private UserDTO testUserDTO;
  private AuthResponse testAuthResponse;

  @BeforeEach
  void setUp() {
    // Create test user
    testUser = new User();
    testUser.setId(UUID.randomUUID());
    testUser.setEmail(TEST_EMAIL);
    testUser.setFullName(TEST_USER_NAME);
    testUser.setGoogleId(DEFAULT_GOOGLE_ID);
    testUser.setRole(UserRole.HOST);
    testUser.setIsDevUser(false);
    testUser.setCreatedAt(LocalDateTime.now());
    testUser.setLastLogin(LocalDateTime.now());

    // Create test DTO
    testUserDTO =
        UserDTO.builder()
            .id(testUser.getId())
            .email(testUser.getEmail())
            .fullName(testUser.getFullName())
            .role(testUser.getRole())
            .createdAt(testUser.getCreatedAt())
            .lastLogin(testUser.getLastLogin())
            .build();

    // Create test auth response
    testAuthResponse = new AuthResponse(TEST_JWT_TOKEN, testUserDTO, true);
  }

  @Nested
  @DisplayName("Google OAuth Callback Tests")
  class GoogleOAuthCallbackTests {

    @Test
    @DisplayName("Should successfully handle Google OAuth callback with valid code")
    void testGoogleCallbackSuccess() {
      // Arrange
      Map<String, String> request = new HashMap<>();
      request.put("code", VALID_AUTH_CODE);

      when(authService.handleGoogleCallback(VALID_AUTH_CODE)).thenReturn(testAuthResponse);

      // Act
      ResponseEntity<AuthResponse> response = authController.googleCallback(request);

      // Assert
      assertEquals(HttpStatus.OK, response.getStatusCode());
      assertNotNull(response.getBody());
      assertEquals(TEST_JWT_TOKEN, response.getBody().getToken());
      assertEquals(testUserDTO, response.getBody().getUser());
      assertTrue(response.getBody().isHasSelectedRole());
      verify(authService, times(1)).handleGoogleCallback(VALID_AUTH_CODE);
    }

    @Test
    @DisplayName("Should throw exception when authorization code is null")
    void testGoogleCallbackNullCode() {
      // Arrange
      Map<String, String> request = new HashMap<>();
      request.put("code", null);

      // Act & Assert
      assertThrows(AuthenticationException.class, () -> authController.googleCallback(request));
      verify(authService, never()).handleGoogleCallback(any());
    }

    @Test
    @DisplayName("Should throw exception when authorization code is empty")
    void testGoogleCallbackEmptyCode() {
      // Arrange
      Map<String, String> request = new HashMap<>();
      request.put("code", "   ");

      // Act & Assert
      assertThrows(AuthenticationException.class, () -> authController.googleCallback(request));
      verify(authService, never()).handleGoogleCallback(any());
    }

    @Test
    @DisplayName("Should throw exception when code is missing from request")
    void testGoogleCallbackMissingCode() {
      // Arrange
      Map<String, String> request = new HashMap<>();

      // Act & Assert
      assertThrows(AuthenticationException.class, () -> authController.googleCallback(request));
      verify(authService, never()).handleGoogleCallback(any());
    }

    @Test
    @DisplayName("Should propagate authentication exception from service")
    void testGoogleCallbackServiceThrowsException() {
      // Arrange
      Map<String, String> request = new HashMap<>();
      request.put("code", INVALID_AUTH_CODE);

      when(authService.handleGoogleCallback(INVALID_AUTH_CODE))
          .thenThrow(new AuthenticationException("Invalid authorization code"));

      // Act & Assert
      assertThrows(AuthenticationException.class, () -> authController.googleCallback(request));
      verify(authService, times(1)).handleGoogleCallback(INVALID_AUTH_CODE);
    }
  }

  @Nested
  @DisplayName("Get Current User Tests")
  class GetCurrentUserTests {

    @Test
    @DisplayName("Should return current authenticated user")
    void testGetCurrentUserSuccess() {
      // Arrange
      CustomUserDetails userDetails = new CustomUserDetails(testUser);
      when(authentication.getPrincipal()).thenReturn(userDetails);
      when(userService.toDTO(testUser)).thenReturn(testUserDTO);

      // Act
      ResponseEntity<UserDTO> response = authController.getCurrentUser(authentication);

      // Assert
      assertEquals(HttpStatus.OK, response.getStatusCode());
      assertNotNull(response.getBody());
      assertEquals(testUser.getEmail(), response.getBody().getEmail());
      assertEquals(testUser.getId(), response.getBody().getId());
      verify(userService, times(1)).toDTO(testUser);
    }

    @Test
    @DisplayName("Should return user without role if role not selected")
    void testGetCurrentUserNoRole() {
      // Arrange
      testUser.setRole(null);
      UserDTO userDTOWithoutRole =
          UserDTO.builder()
              .id(testUser.getId())
              .email(testUser.getEmail())
              .fullName(testUser.getFullName())
              .role(null)
              .createdAt(testUser.getCreatedAt())
              .build();

      CustomUserDetails userDetails = new CustomUserDetails(testUser);
      when(authentication.getPrincipal()).thenReturn(userDetails);
      when(userService.toDTO(testUser)).thenReturn(userDTOWithoutRole);

      // Act
      ResponseEntity<UserDTO> response = authController.getCurrentUser(authentication);

      // Assert
      assertEquals(HttpStatus.OK, response.getStatusCode());
      assertNotNull(response.getBody());
      assertNull(response.getBody().getRole());
    }
  }

  @Nested
  @DisplayName("Role Selection Tests")
  class RoleSelectionTests {

    @Test
    @DisplayName("Should successfully select HOST role")
    void testSelectRoleHostSuccess() {
      // Arrange
      RoleSelectionRequest request = new RoleSelectionRequest();
      request.setRole(UserRole.HOST);

      CustomUserDetails userDetails = new CustomUserDetails(testUser);
      when(authentication.getPrincipal()).thenReturn(userDetails);
      when(authService.selectRole(testUser.getId(), UserRole.HOST)).thenReturn(testUser);
      when(userService.toDTO(testUser)).thenReturn(testUserDTO);

      // Act
      ResponseEntity<UserDTO> response = authController.selectRole(request, authentication);

      // Assert
      assertEquals(HttpStatus.OK, response.getStatusCode());
      assertNotNull(response.getBody());
      assertEquals(UserRole.HOST, response.getBody().getRole());
      verify(authService, times(1)).selectRole(testUser.getId(), UserRole.HOST);
      verify(userService, times(1)).toDTO(testUser);
    }

    @Test
    @DisplayName("Should successfully select RESIDENT role")
    void testSelectRoleResidentSuccess() {
      // Arrange
      testUser.setRole(UserRole.RESIDENT);
      testUserDTO =
          UserDTO.builder()
              .id(testUser.getId())
              .email(testUser.getEmail())
              .fullName(testUser.getFullName())
              .role(UserRole.RESIDENT)
              .createdAt(testUser.getCreatedAt())
              .build();

      RoleSelectionRequest request = new RoleSelectionRequest();
      request.setRole(UserRole.RESIDENT);

      CustomUserDetails userDetails = new CustomUserDetails(testUser);
      when(authentication.getPrincipal()).thenReturn(userDetails);
      when(authService.selectRole(testUser.getId(), UserRole.RESIDENT)).thenReturn(testUser);
      when(userService.toDTO(testUser)).thenReturn(testUserDTO);

      // Act
      ResponseEntity<UserDTO> response = authController.selectRole(request, authentication);

      // Assert
      assertEquals(HttpStatus.OK, response.getStatusCode());
      assertNotNull(response.getBody());
      assertEquals(UserRole.RESIDENT, response.getBody().getRole());
      verify(authService, times(1)).selectRole(testUser.getId(), UserRole.RESIDENT);
    }

    @Test
    @DisplayName("Should throw exception when trying to select ADMIN role")
    void testSelectRoleAdminRoleNotAllowed() {
      // Arrange
      RoleSelectionRequest request = new RoleSelectionRequest();
      request.setRole(UserRole.ADMIN);

      CustomUserDetails userDetails = new CustomUserDetails(testUser);
      when(authentication.getPrincipal()).thenReturn(userDetails);
      when(authService.selectRole(testUser.getId(), UserRole.ADMIN))
          .thenThrow(new AuthenticationException("Cannot manually select ADMIN role"));

      // Act & Assert
      assertThrows(
          AuthenticationException.class, () -> authController.selectRole(request, authentication));
      verify(authService, times(1)).selectRole(testUser.getId(), UserRole.ADMIN);
    }

    @Test
    @DisplayName("Should throw exception when role already selected")
    void testSelectRoleRoleAlreadySelected() {
      // Arrange
      testUser.setRole(UserRole.HOST);
      RoleSelectionRequest request = new RoleSelectionRequest();
      request.setRole(UserRole.RESIDENT);

      CustomUserDetails userDetails = new CustomUserDetails(testUser);
      when(authentication.getPrincipal()).thenReturn(userDetails);
      when(authService.selectRole(testUser.getId(), UserRole.RESIDENT))
          .thenThrow(new AuthenticationException("Role has already been selected"));

      // Act & Assert
      assertThrows(
          AuthenticationException.class, () -> authController.selectRole(request, authentication));
      verify(authService, times(1)).selectRole(testUser.getId(), UserRole.RESIDENT);
    }
  }

  @Nested
  @DisplayName("Logout Tests")
  class LogoutTests {

    @Test
    @DisplayName("Should successfully logout and return success message")
    void testLogout_Success() {
      // Act
      ResponseEntity<Map<String, String>> response = authController.logout();

      // Assert
      assertEquals(HttpStatus.OK, response.getStatusCode());
      assertNotNull(response.getBody());
      assertEquals(LOGOUT_SUCCESS, response.getBody().get("message"));
    }
  }

  @Nested
  @DisplayName("Development Authentication Tests")
  class DevAuthTests {

    @Test
    @DisplayName("Should successfully authenticate with dev auth (HOST)")
    void testDevLoginSuccessWithHost() {
      // Arrange
      Map<String, String> request = new HashMap<>();
      request.put("email", DEV_EMAIL);
      request.put("role", "HOST");

      when(authService.handleDevAuth(DEV_EMAIL, UserRole.HOST)).thenReturn(testAuthResponse);

      // Act
      ResponseEntity<AuthResponse> response = authController.devLogin(request);

      // Assert
      assertEquals(HttpStatus.OK, response.getStatusCode());
      assertNotNull(response.getBody());
      assertEquals(TEST_JWT_TOKEN, response.getBody().getToken());
      verify(authService, times(1)).handleDevAuth(DEV_EMAIL, UserRole.HOST);
    }

    @Test
    @DisplayName("Should successfully authenticate with dev auth (RESIDENT)")
    void testDevLoginSuccessWithResident() {
      // Arrange
      Map<String, String> request = new HashMap<>();
      request.put("email", DEV_EMAIL);
      request.put("role", "RESIDENT");

      when(authService.handleDevAuth(DEV_EMAIL, UserRole.RESIDENT)).thenReturn(testAuthResponse);

      // Act
      ResponseEntity<AuthResponse> response = authController.devLogin(request);

      // Assert
      assertEquals(HttpStatus.OK, response.getStatusCode());
      assertNotNull(response.getBody());
      verify(authService, times(1)).handleDevAuth(DEV_EMAIL, UserRole.RESIDENT);
    }

    @Test
    @DisplayName("Should successfully authenticate with dev auth without role")
    void testDevLoginSuccessWithoutRole() {
      // Arrange
      Map<String, String> request = new HashMap<>();
      request.put("email", DEV_EMAIL);

      when(authService.handleDevAuth(DEV_EMAIL, null)).thenReturn(testAuthResponse);

      // Act
      ResponseEntity<AuthResponse> response = authController.devLogin(request);

      // Assert
      assertEquals(HttpStatus.OK, response.getStatusCode());
      assertNotNull(response.getBody());
      verify(authService, times(1)).handleDevAuth(DEV_EMAIL, null);
    }

    @Test
    @DisplayName("Should throw exception when email is null")
    void testDevLoginNullEmail() {
      // Arrange
      Map<String, String> request = new HashMap<>();
      request.put("email", null);

      // Act & Assert
      assertThrows(AuthenticationException.class, () -> authController.devLogin(request));
      verify(authService, never()).handleDevAuth(any(), any());
    }

    @Test
    @DisplayName("Should throw exception when email is empty")
    void testDevLoginEmptyEmail() {
      // Arrange
      Map<String, String> request = new HashMap<>();
      request.put("email", "   ");

      // Act & Assert
      assertThrows(AuthenticationException.class, () -> authController.devLogin(request));
      verify(authService, never()).handleDevAuth(any(), any());
    }

    @Test
    @DisplayName("Should throw exception when email is missing")
    void testDevLoginMissingEmail() {
      // Arrange
      Map<String, String> request = new HashMap<>();

      // Act & Assert
      assertThrows(AuthenticationException.class, () -> authController.devLogin(request));
      verify(authService, never()).handleDevAuth(any(), any());
    }

    @Test
    @DisplayName("Should throw exception when dev auth is disabled")
    void testDevLoginDevAuthDisabled() {
      // Arrange
      Map<String, String> request = new HashMap<>();
      request.put("email", DEV_EMAIL);

      when(authService.handleDevAuth(DEV_EMAIL, null))
          .thenThrow(new AuthenticationException("Development authentication is disabled"));

      // Act & Assert
      assertThrows(AuthenticationException.class, () -> authController.devLogin(request));
      verify(authService, times(1)).handleDevAuth(DEV_EMAIL, null);
    }

    @Test
    @DisplayName("Should throw exception for invalid role")
    void testDevLoginInvalidRole() {
      // Arrange
      Map<String, String> request = new HashMap<>();
      request.put("email", "dev@example.com");
      request.put("role", "INVALID_ROLE");

      // Act & Assert
      assertThrows(AuthenticationException.class, () -> authController.devLogin(request));
      verify(authService, never()).handleDevAuth(any(), any());
    }

    @Test
    @DisplayName("Should handle lowercase role input")
    void testDevLoginLowercaseRole() {
      // Arrange
      Map<String, String> request = new HashMap<>();
      request.put("email", DEV_EMAIL);
      request.put("role", "host");

      when(authService.handleDevAuth(DEV_EMAIL, UserRole.HOST)).thenReturn(testAuthResponse);

      // Act
      ResponseEntity<AuthResponse> response = authController.devLogin(request);

      // Assert
      assertEquals(HttpStatus.OK, response.getStatusCode());
      verify(authService, times(1)).handleDevAuth(DEV_EMAIL, UserRole.HOST);
    }

    @Test
    @DisplayName("Should handle mixed case role input")
    void testDevLoginMixedCaseRole() {
      // Arrange
      Map<String, String> request = new HashMap<>();
      request.put("email", DEV_EMAIL);
      request.put("role", "ReSiDeNt");

      when(authService.handleDevAuth(DEV_EMAIL, UserRole.RESIDENT)).thenReturn(testAuthResponse);

      // Act
      ResponseEntity<AuthResponse> response = authController.devLogin(request);

      // Assert
      assertEquals(HttpStatus.OK, response.getStatusCode());
      verify(authService, times(1)).handleDevAuth(DEV_EMAIL, UserRole.RESIDENT);
    }
  }
}
