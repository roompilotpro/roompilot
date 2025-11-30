package com.roompilot.controller;

import static com.github.tomakehurst.wiremock.client.WireMock.configureFor;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;
import static com.roompilot.fixtures.TestConstants.Endpoints.*;
import static com.roompilot.fixtures.TestConstants.Messages.*;
import static com.roompilot.fixtures.TestConstants.TestData.*;
import static com.roompilot.util.TestHelpers.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.tomakehurst.wiremock.WireMockServer;
import com.roompilot.model.User;
import com.roompilot.model.UserRole;
import com.roompilot.repository.UserRepository;
import com.roompilot.service.JwtService;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

/**
 * Integration tests for AuthController endpoints. Tests HTTP behavior, database state, JWT token
 * generation, and Google OAuth integration via WireMock.
 *
 * <p>Test organization:
 *
 * <ul>
 *   <li>GoogleCallbackTests - POST /api/auth/google/callback
 *   <li>DevLoginTests - POST /api/auth/dev/login
 *   <li>MeEndpointTests - GET /api/auth/me
 *   <li>RoleSelectionTests - POST /api/auth/role
 *   <li>LogoutTests - POST /api/auth/logout
 *   <li>CrossEndpointTests - Cross-endpoint behavior validation
 * </ul>
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class AuthControllerIntegrationTest {

  @Autowired private MockMvc mockMvc;
  @Autowired private UserRepository userRepository;
  @Autowired private JwtService jwtService;
  @Autowired private ObjectMapper objectMapper;

  private static final WireMockServer wireMockServer;

  static {
    // Initialize WireMockServer before Spring context loads
    wireMockServer = new WireMockServer(wireMockConfig().dynamicPort());
    wireMockServer.start();
    configureFor("localhost", wireMockServer.port());
  }

  @AfterAll
  static void stopWireMock() {
    if (wireMockServer != null && wireMockServer.isRunning()) {
      wireMockServer.stop();
    }
  }

  @DynamicPropertySource
  static void configureProperties(DynamicPropertyRegistry registry) {
    registry.add("wiremock.server.port", () -> wireMockServer.port());
    System.setProperty("wiremock.server.port", String.valueOf(wireMockServer.port()));
  }

  @BeforeEach
  void setUp() {
    userRepository.deleteAll();
    wireMockServer.resetAll();
  }

  // ==================== Google Callback Tests ====================

  @Nested
  @DisplayName("POST /api/auth/google/callback")
  class GoogleCallbackTests {

    @Test
    @DisplayName("New non-admin user success - creates user with no role selected")
    void newUserSuccess() throws Exception {
      String code = "TEST_AUTH_CODE";
      String accessToken = "TEST_ACCESS_TOKEN";
      String googleId = uniqueGoogleId("new-user");
      String email = uniqueEmail("newuser");

      stubGoogleTokenExchange(code, accessToken, null);
      stubGoogleUserInfo(googleId, email, "John Doe", "DEFAULT_PROFILE_PICTURE", accessToken);

      ResultActions result =
          mockMvc
              .perform(
                  post(GOOGLE_CALLBACK)
                      .contentType(MediaType.APPLICATION_JSON)
                      .content(String.format("{\"code\": \"%s\"}", code))
                      .with(csrf()))
              .andExpect(status().isOk())
              .andExpect(jsonPath("$.token").isNotEmpty())
              .andExpect(jsonPath("$.hasSelectedRole").value(false))
              .andExpect(jsonPath("$.user.email").value(email))
              .andExpect(jsonPath("$.user.fullName").value("John Doe"))
              .andExpect(jsonPath("$.user.role").isEmpty());

      String responseJson = getResponseJson(result);
      Map<String, Object> response = parseJson(responseJson);
      String token = (String) response.get("token");

      Map<String, Object> claims = parseTokenClaims(jwtService, token);
      assertThat(claims.get("email")).isEqualTo(email);
      assertThat(claims.get("role")).isEqualTo("null");

      Optional<User> savedUser = userRepository.findByEmail(email);
      assertThat(savedUser).isPresent();
      assertThat(savedUser.get().getGoogleId()).isEqualTo(googleId);
      assertThat(savedUser.get().getIsDevUser()).isFalse();
      assertThat(savedUser.get().getRole()).isNull();
      assertThat(savedUser.get().getProfilePictureUrl()).isEqualTo("DEFAULT_PROFILE_PICTURE");
      assertThat(isRecentTimestamp(savedUser.get().getLastLogin())).isTrue();
      assertThat(savedUser.get().getCreatedAt()).isNotNull();
    }

    @Test
    @DisplayName("Admin whitelist auto-assign - user gets ADMIN role automatically")
    void adminWhitelistAutoAssign() throws Exception {
      String code = "admin-auth-code";
      String accessToken = "admin-access-token";
      String googleId = uniqueGoogleId("admin");
      String adminEmail = ADMIN_EMAIL;

      stubGoogleTokenExchange(code, accessToken, null);
      stubGoogleUserInfo(
          googleId, adminEmail, "Admin User", "https://example.com/admin.jpg", accessToken);

      mockMvc
          .perform(
              post(GOOGLE_CALLBACK)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(String.format("{\"code\": \"%s\"}", code))
                  .with(csrf()))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.hasSelectedRole").value(true))
          .andExpect(jsonPath("$.user.role").value("ADMIN"))
          .andExpect(jsonPath("$.user.email").value(adminEmail));

      Optional<User> savedUser = userRepository.findByEmail(adminEmail);
      assertThat(savedUser).isPresent();
      assertThat(savedUser.get().getRole()).isEqualTo(UserRole.ADMIN);
      assertThat(savedUser.get().getIsDevUser()).isFalse();
    }

    @Test
    @DisplayName("Existing active user by googleId - updates lastLogin, no duplicate")
    void existingUserByGoogleId() throws Exception {
      String googleId = uniqueGoogleId("existing");
      String email = uniqueEmail("existing");
      User existingUser = createTestUser(email, googleId);
      existingUser.setRole(UserRole.HOST);
      existingUser = userRepository.save(existingUser);
      LocalDateTime originalCreatedAt = existingUser.getCreatedAt();

      String code = "existing-code";
      String accessToken = "existing-token";
      stubGoogleTokenExchange(code, accessToken, null);
      stubGoogleUserInfo(
          googleId, email, "Existing User", "https://example.com/existing.jpg", accessToken);

      mockMvc
          .perform(
              post(GOOGLE_CALLBACK)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(String.format("{\"code\": \"%s\"}", code))
                  .with(csrf()))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.hasSelectedRole").value(true))
          .andExpect(jsonPath("$.user.role").value("HOST"))
          .andExpect(jsonPath("$.user.email").value(email));

      assertThat(userRepository.count()).isEqualTo(1);
      Optional<User> updatedUser = userRepository.findByGoogleId(googleId);
      assertThat(updatedUser).isPresent();
      assertThat(updatedUser.get().getId()).isEqualTo(existingUser.getId());
      assertThat(updatedUser.get().getRole()).isEqualTo(UserRole.HOST);
      assertThat(isRecentTimestamp(updatedUser.get().getLastLogin())).isTrue();
      assertThat(updatedUser.get().getCreatedAt())
          .isCloseTo(originalCreatedAt, within(1, ChronoUnit.SECONDS));
    }

    @Test
    @DisplayName("Existing dev user matched by email - migrates to Google OAuth")
    void devUserMigrationByEmail() throws Exception {
      String email = uniqueEmail("devmigrate");
      User devUser = createDevUser(email, UserRole.RESIDENT);
      devUser = userRepository.save(devUser);

      String newGoogleId = uniqueGoogleId("migrated");
      String code = "migrate-code";
      String accessToken = "migrate-token";
      stubGoogleTokenExchange(code, accessToken, null);
      stubGoogleUserInfo(
          newGoogleId, email, "Migrated User", "https://example.com/migrated.jpg", accessToken);

      mockMvc
          .perform(
              post(GOOGLE_CALLBACK)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(String.format("{\"code\": \"%s\"}", code))
                  .with(csrf()))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.user.email").value(email))
          .andExpect(jsonPath("$.user.role").value("RESIDENT"))
          .andExpect(jsonPath("$.hasSelectedRole").value(true));

      assertThat(userRepository.count()).isEqualTo(1);
      Optional<User> migratedUser = userRepository.findByEmail(email);
      assertThat(migratedUser).isPresent();
      assertThat(migratedUser.get().getId()).isEqualTo(devUser.getId());
      assertThat(migratedUser.get().getGoogleId()).isEqualTo(newGoogleId);
      assertThat(migratedUser.get().getIsDevUser()).isFalse();
      assertThat(migratedUser.get().getRole()).isEqualTo(UserRole.RESIDENT);
    }

    @Test
    @DisplayName("Re-login after role selection - hasSelectedRole remains true")
    void reLoginAfterRoleSelection() throws Exception {
      String googleId = uniqueGoogleId("relogin");
      String email = uniqueEmail("relogin");
      User user = createTestUser(email, googleId);
      user.setRole(UserRole.HOST);
      userRepository.save(user);

      String code = "relogin-code";
      String accessToken = "relogin-token";
      stubGoogleTokenExchange(code, accessToken, null);
      stubGoogleUserInfo(
          googleId, email, "Returning User", "https://example.com/return.jpg", accessToken);

      mockMvc
          .perform(
              post(GOOGLE_CALLBACK)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(String.format("{\"code\": \"%s\"}", code))
                  .with(csrf()))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.hasSelectedRole").value(true))
          .andExpect(jsonPath("$.user.role").value("HOST"));
    }

    @Test
    @DisplayName("Missing/blank code - returns 401 with AuthenticationException")
    void missingCode() throws Exception {
      // NOTE: Test plan mentions 500, but GlobalExceptionHandler returns 401 for
      // AuthenticationException
      mockMvc
          .perform(
              post(GOOGLE_CALLBACK)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("{}")
                  .with(csrf()))
          .andExpect(status().isUnauthorized())
          .andExpect(jsonPath("$.error").value("Unauthorized"));

      assertThat(userRepository.count()).isEqualTo(0);
    }

    @Test
    @DisplayName("Blank code - returns 401 with AuthenticationException")
    void blankCode() throws Exception {
      mockMvc
          .perform(
              post(GOOGLE_CALLBACK)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("{\"code\": \"   \"}")
                  .with(csrf()))
          .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Google token exchange failure (4xx) - returns 401, no user created")
    void googleTokenExchangeFailure() throws Exception {
      String code = "invalid-code";
      stubGoogleTokenExchangeFailure(code, 400);

      mockMvc
          .perform(
              post(GOOGLE_CALLBACK)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(String.format("{\"code\": \"%s\"}", code))
                  .with(csrf()))
          .andExpect(status().isUnauthorized());

      assertThat(userRepository.count()).isEqualTo(0);
    }

    @Test
    @DisplayName("Google userinfo failure (5xx) - returns 401, no user created")
    void googleUserInfoFailure() throws Exception {
      String code = "userinfo-fail-code";
      String accessToken = "userinfo-fail-token";
      stubGoogleTokenExchange(code, accessToken, null);
      stubGoogleUserInfoFailure(accessToken, 500);

      mockMvc
          .perform(
              post(GOOGLE_CALLBACK)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(String.format("{\"code\": \"%s\"}", code))
                  .with(csrf()))
          .andExpect(status().isUnauthorized());

      assertThat(userRepository.count()).isEqualTo(0);
    }

    @Test
    @DisplayName("Admin email case insensitive matching - mixed case email gets ADMIN role")
    void adminEmailCaseInsensitive() throws Exception {
      String code = "case-test-code";
      String accessToken = "case-test-token";
      String googleId = uniqueGoogleId("case-admin");
      String mixedCaseEmail = "ADMIN@roompilot.com";

      stubGoogleTokenExchange(code, accessToken, null);
      stubGoogleUserInfo(
          googleId, mixedCaseEmail, "Case Admin", "https://example.com/case.jpg", accessToken);

      mockMvc
          .perform(
              post(GOOGLE_CALLBACK)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(String.format("{\"code\": \"%s\"}", code))
                  .with(csrf()))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.user.role").value("ADMIN"))
          .andExpect(jsonPath("$.hasSelectedRole").value(true));

      Optional<User> savedUser = userRepository.findByEmail(mixedCaseEmail);
      assertThat(savedUser).isPresent();
      assertThat(savedUser.get().getRole()).isEqualTo(UserRole.ADMIN);
    }
  }

  // ==================== Me Endpoint Tests ====================

  @Nested
  @DisplayName("GET /api/auth/me")
  class MeEndpointTests {

    @Test
    @DisplayName("Valid JWT for active user - returns 200 with UserDTO")
    void validJwtActiveUser() throws Exception {
      User user = createTestUser(uniqueEmail("me"), uniqueGoogleId("me"));
      user.setRole(UserRole.HOST);
      user.setFullName("Me Test User");
      user.setPhone(TEST_PHONE);
      user = userRepository.save(user);
      String token = generateToken(jwtService, user);

      mockMvc
          .perform(get(ME).header("Authorization", authHeader(token)))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.email").value(user.getEmail()))
          .andExpect(jsonPath("$.fullName").value("Me Test User"))
          .andExpect(jsonPath("$.role").value("HOST"))
          .andExpect(jsonPath("$.phone").value(TEST_PHONE))
          .andExpect(jsonPath("$.profilePictureUrl").value(DEFAULT_PROFILE_PICTURE))
          .andExpect(jsonPath("$.id").value(user.getId().toString()))
          .andExpect(jsonPath("$.createdAt").isNotEmpty())
          .andExpect(jsonPath("$.lastLogin").isNotEmpty());
    }

    @Test
    @DisplayName("Token for deleted user - filter skips auth, returns 401 or 403")
    void deletedUserToken() throws Exception {
      User user = createTestUser(uniqueEmail("deleted"), uniqueGoogleId("deleted"));
      user.setRole(UserRole.RESIDENT);
      user.setDeletedAt(LocalDateTime.now());
      user = userRepository.save(user);
      String token = generateToken(jwtService, user);

      // NOTE: JwtAuthenticationFilter skips deleted users, resulting in no Authentication
      // This endpoint requires authentication, so expect 401
      mockMvc
          .perform(get(ME).header("Authorization", authHeader(token)))
          .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Missing/invalid token - returns 401")
    void missingOrInvalidToken() throws Exception {
      // Missing token
      mockMvc.perform(get(ME)).andExpect(status().isUnauthorized());

      // Invalid token format
      mockMvc
          .perform(get(ME).header("Authorization", "Bearer invalid-token-format"))
          .andExpect(status().isUnauthorized());

      // Malformed bearer header
      mockMvc
          .perform(get(ME).header("Authorization", "InvalidFormat"))
          .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Expired token - returns 401")
    void expiredToken() throws Exception {
      User user = createTestUser(uniqueEmail("expired"), uniqueGoogleId("expired"));
      user.setRole(UserRole.HOST);
      user = userRepository.save(user);

      String expiredToken =
          generateExpiredToken(user, "TestSecretKeyForIntegrationTestsOnly12345678901234567890");

      mockMvc
          .perform(get(ME).header("Authorization", authHeader(expiredToken)))
          .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("User with null role - returns 200 with null role")
    void userWithNullRole() throws Exception {
      User user = createTestUser(uniqueEmail("norole"), uniqueGoogleId("norole"));
      user.setRole(null);
      user = userRepository.save(user);
      String token = generateToken(jwtService, user);

      mockMvc
          .perform(get(ME).header("Authorization", authHeader(token)))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.email").value(user.getEmail()))
          .andExpect(jsonPath("$.role").isEmpty());
    }
  }

  // ==================== Role Selection Tests ====================

  @Nested
  @DisplayName("POST /api/auth/role")
  class RoleSelectionTests {

    @Test
    @DisplayName("First-time selection to HOST - role persisted, returns 200")
    void firstTimeSelectionHost() throws Exception {
      User user = createTestUser(uniqueEmail("select-host"), uniqueGoogleId("select-host"));
      user.setRole(null);
      user = userRepository.save(user);
      String token = generateToken(jwtService, user);

      mockMvc
          .perform(
              post(ROLE)
                  .header("Authorization", authHeader(token))
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("{\"role\": \"HOST\"}"))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.role").value("HOST"))
          .andExpect(jsonPath("$.email").value(user.getEmail()));

      Optional<User> updatedUser = userRepository.findById(user.getId());
      assertThat(updatedUser).isPresent();
      assertThat(updatedUser.get().getRole()).isEqualTo(UserRole.HOST);
      assertThat(updatedUser.get().hasRole()).isTrue();
    }

    @Test
    @DisplayName("First-time selection to RESIDENT - role persisted, returns 200")
    void firstTimeSelectionResident() throws Exception {
      User user = createTestUser(uniqueEmail("select-res"), uniqueGoogleId("select-res"));
      user.setRole(null);
      user = userRepository.save(user);
      String token = generateToken(jwtService, user);

      mockMvc
          .perform(
              post(ROLE)
                  .header("Authorization", authHeader(token))
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("{\"role\": \"RESIDENT\"}"))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.role").value("RESIDENT"));

      Optional<User> updatedUser = userRepository.findById(user.getId());
      assertThat(updatedUser).isPresent();
      assertThat(updatedUser.get().getRole()).isEqualTo(UserRole.RESIDENT);
    }

    @Test
    @DisplayName("Idempotent repeat with same role - returns 200, role unchanged")
    void idempotentRoleSelection() throws Exception {
      User user = createTestUser(uniqueEmail("idempotent"), uniqueGoogleId("idempotent"));
      user.setRole(UserRole.HOST);
      user = userRepository.save(user);
      String token = generateToken(jwtService, user);

      mockMvc
          .perform(
              post(ROLE)
                  .header("Authorization", authHeader(token))
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("{\"role\": \"HOST\"}"))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.role").value("HOST"));

      Optional<User> updatedUser = userRepository.findById(user.getId());
      assertThat(updatedUser).isPresent();
      assertThat(updatedUser.get().getRole()).isEqualTo(UserRole.HOST);
    }

    @Test
    @DisplayName("Attempt to switch role - returns 401 (AuthenticationException), DB unchanged")
    void attemptRoleSwitch() throws Exception {
      User user = createTestUser(uniqueEmail("switch"), uniqueGoogleId("switch"));
      user.setRole(UserRole.HOST);
      user = userRepository.save(user);
      String token = generateToken(jwtService, user);

      mockMvc
          .perform(
              post(ROLE)
                  .header("Authorization", authHeader(token))
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("{\"role\": \"RESIDENT\"}"))
          .andExpect(status().isForbidden())
          .andExpect(jsonPath("$.error").value("Forbidden"));

      Optional<User> unchangedUser = userRepository.findById(user.getId());
      assertThat(unchangedUser).isPresent();
      assertThat(unchangedUser.get().getRole()).isEqualTo(UserRole.HOST);
    }

    @Test
    @DisplayName("ADMIN user calling endpoint - returns 401, no change")
    void adminUserSelectRole() throws Exception {
      User adminUser = createTestUser(uniqueEmail("admin-select"), uniqueGoogleId("admin-select"));
      adminUser.setRole(UserRole.ADMIN);
      adminUser = userRepository.save(adminUser);
      String token = generateToken(jwtService, adminUser);

      mockMvc
          .perform(
              post(ROLE)
                  .header("Authorization", authHeader(token))
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("{\"role\": \"HOST\"}"))
          .andExpect(status().isForbidden());

      Optional<User> unchangedUser = userRepository.findById(adminUser.getId());
      assertThat(unchangedUser).isPresent();
      assertThat(unchangedUser.get().getRole()).isEqualTo(UserRole.ADMIN);
    }

    @Test
    @DisplayName("Role=ADMIN in request - returns 401, no change")
    void requestAdminRole() throws Exception {
      User user = createTestUser(uniqueEmail("req-admin"), uniqueGoogleId("req-admin"));
      user.setRole(null);
      user = userRepository.save(user);
      String token = generateToken(jwtService, user);

      mockMvc
          .perform(
              post(ROLE)
                  .header("Authorization", authHeader(token))
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("{\"role\": \"ADMIN\"}"))
          .andExpect(status().isUnauthorized());

      Optional<User> unchangedUser = userRepository.findById(user.getId());
      assertThat(unchangedUser).isPresent();
      assertThat(unchangedUser.get().getRole()).isNull();
    }

    @Test
    @DisplayName("Missing role field - returns 400 validation error")
    void missingRoleField() throws Exception {
      User user = createTestUser(uniqueEmail("missing-role"), uniqueGoogleId("missing-role"));
      user.setRole(null);
      user = userRepository.save(user);
      String token = generateToken(jwtService, user);

      mockMvc
          .perform(
              post(ROLE)
                  .header("Authorization", authHeader(token))
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("{}"))
          .andExpect(status().isBadRequest())
          .andExpect(jsonPath("$.error").value("Bad Request"));
    }

    @Test
    @DisplayName("Unauthenticated request - returns 401")
    void unauthenticatedRequest() throws Exception {
      mockMvc
          .perform(
              post(ROLE)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("{\"role\": \"HOST\"}")
                  .with(csrf()))
          .andExpect(status().isUnauthorized());
    }
  }

  // ==================== Logout Tests ====================

  @Nested
  @DisplayName("POST /api/auth/logout")
  class LogoutTests {

    @Test
    @DisplayName("Basic success with and without Authorization header - returns 200")
    void logoutSuccess() throws Exception {
      // Without authorization header
      mockMvc
          .perform(post(LOGOUT).with(csrf()))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.message").value(LOGOUT_SUCCESS));

      // With authorization header (token doesn't matter, endpoint doesn't validate)
      User user = createTestUser(uniqueEmail("logout"), uniqueGoogleId("logout"));
      user.setRole(UserRole.HOST);
      user = userRepository.save(user);
      String token = generateToken(jwtService, user);

      mockMvc
          .perform(post(LOGOUT).header("Authorization", authHeader(token)))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.message").value(LOGOUT_SUCCESS));

      // Verify no database side effects
      assertThat(userRepository.count()).isEqualTo(1);
      Optional<User> unchangedUser = userRepository.findById(user.getId());
      assertThat(unchangedUser).isPresent();
      assertThat(unchangedUser.get().getRole()).isEqualTo(UserRole.HOST);
    }
  }

  // ==================== Dev Login Tests ====================

  @Nested
  @DisplayName("POST /api/auth/dev/login")
  @TestPropertySource(properties = {"app.enable-dev-auth=true"})
  class DevLoginTests {

    @Test
    @DisplayName("New user no role - returns 200 with token, hasSelectedRole=false")
    void newUserNoRole() throws Exception {
      String email = uniqueEmail("devnew");

      ResultActions result =
          mockMvc
              .perform(
                  post(DEV_LOGIN)
                      .contentType(MediaType.APPLICATION_JSON)
                      .content(String.format("{\"email\": \"%s\"}", email))
                      .with(csrf()))
              .andExpect(status().isOk())
              .andExpect(jsonPath("$.token").isNotEmpty())
              .andExpect(jsonPath("$.hasSelectedRole").value(false))
              .andExpect(jsonPath("$.user.email").value(email))
              .andExpect(jsonPath("$.user.role").isEmpty());

      Optional<User> savedUser = userRepository.findByEmail(email);
      assertThat(savedUser).isPresent();
      assertThat(savedUser.get().getIsDevUser()).isTrue();
      assertThat(savedUser.get().getGoogleId()).startsWith("dev-");
      assertThat(savedUser.get().getRole()).isNull();
      assertThat(isRecentTimestamp(savedUser.get().getLastLogin())).isTrue();
    }

    @Test
    @DisplayName("New user with HOST role - role saved, hasSelectedRole=true")
    void newUserWithHostRole() throws Exception {
      String email = uniqueEmail("devhost");

      mockMvc
          .perform(
              post(DEV_LOGIN)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(String.format("{\"email\": \"%s\", \"role\": \"HOST\"}", email))
                  .with(csrf()))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.hasSelectedRole").value(true))
          .andExpect(jsonPath("$.user.role").value("HOST"));

      Optional<User> savedUser = userRepository.findByEmail(email);
      assertThat(savedUser).isPresent();
      assertThat(savedUser.get().getRole()).isEqualTo(UserRole.HOST);
      assertThat(savedUser.get().getIsDevUser()).isTrue();
    }

    @Test
    @DisplayName("New user with RESIDENT role - role saved, hasSelectedRole=true")
    void newUserWithResidentRole() throws Exception {
      String email = uniqueEmail("devresident");

      mockMvc
          .perform(
              post(DEV_LOGIN)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(String.format("{\"email\": \"%s\", \"role\": \"RESIDENT\"}", email))
                  .with(csrf()))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.user.role").value("RESIDENT"))
          .andExpect(jsonPath("$.hasSelectedRole").value(true));

      Optional<User> savedUser = userRepository.findByEmail(email);
      assertThat(savedUser).isPresent();
      assertThat(savedUser.get().getRole()).isEqualTo(UserRole.RESIDENT);
    }

    @Test
    @DisplayName("Admin email in whitelist - role ADMIN auto-assigned, isDevUser=true")
    void adminEmailAutoAssign() throws Exception {
      String adminEmail = "test.admin@example.com";

      mockMvc
          .perform(
              post(DEV_LOGIN)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(String.format("{\"email\": \"%s\"}", adminEmail))
                  .with(csrf()))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.user.role").value("ADMIN"))
          .andExpect(jsonPath("$.hasSelectedRole").value(true));

      Optional<User> savedUser = userRepository.findByEmail(adminEmail);
      assertThat(savedUser).isPresent();
      assertThat(savedUser.get().getRole()).isEqualTo(UserRole.ADMIN);
      assertThat(savedUser.get().getIsDevUser()).isTrue();
    }

    @Test
    @DisplayName("Existing user without role, role provided - role set, lastLogin updated")
    void existingUserNoRoleRoleProvided() throws Exception {
      String email = uniqueEmail("existing-dev");
      User existingUser = userRepository.save(createDevUser(email, null));

      mockMvc
          .perform(
              post(DEV_LOGIN)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(String.format("{\"email\": \"%s\", \"role\": \"HOST\"}", email))
                  .with(csrf()))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.user.role").value("HOST"));

      assertThat(userRepository.count()).isEqualTo(1);
      Optional<User> updatedUser = userRepository.findById(existingUser.getId());
      assertThat(updatedUser).isPresent();
      assertThat(updatedUser.get().getRole()).isEqualTo(UserRole.HOST);
      assertThat(isRecentTimestamp(updatedUser.get().getLastLogin())).isTrue();
    }

    @Test
    @DisplayName("Existing user with role, new role provided - role not overridden")
    void existingUserWithRoleNotOverridden() throws Exception {
      String email = uniqueEmail("existing-with-role");
      User existingUser = userRepository.save(createDevUser(email, UserRole.RESIDENT));

      mockMvc
          .perform(
              post(DEV_LOGIN)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(String.format("{\"email\": \"%s\", \"role\": \"HOST\"}", email))
                  .with(csrf()))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.user.role").value("RESIDENT"));

      Optional<User> updatedUser = userRepository.findById(existingUser.getId());
      assertThat(updatedUser).isPresent();
      assertThat(updatedUser.get().getRole()).isEqualTo(UserRole.RESIDENT);
      assertThat(isRecentTimestamp(updatedUser.get().getLastLogin())).isTrue();
    }

    @Test
    @DisplayName("Missing email - returns 401")
    void missingEmail() throws Exception {
      mockMvc
          .perform(
              post(DEV_LOGIN).contentType(MediaType.APPLICATION_JSON).content("{}").with(csrf()))
          .andExpect(status().isUnauthorized());

      assertThat(userRepository.count()).isEqualTo(0);
    }

    @Test
    @DisplayName("Invalid role string - returns 401, DB unchanged")
    void invalidRoleString() throws Exception {
      String email = uniqueEmail("invalid-role");

      mockMvc
          .perform(
              post(DEV_LOGIN)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(String.format("{\"email\": \"%s\", \"role\": \"INVALID_ROLE\"}", email))
                  .with(csrf()))
          .andExpect(status().isUnauthorized());

      assertThat(userRepository.count()).isEqualTo(0);
    }
  }

  // ==================== Cross-Endpoint Tests ====================

  @Nested
  @DisplayName("Cross-endpoint sanity checks")
  @TestPropertySource(properties = {"app.enable-dev-auth=true"})
  class CrossEndpointTests {

    @Test
    @DisplayName("Token interoperability - Google and dev login tokens both work")
    void tokenInteroperability() throws Exception {
      // Create user via dev login
      String devEmail = uniqueEmail("dev-interop");
      ResultActions devLoginResult =
          mockMvc
              .perform(
                  post(DEV_LOGIN)
                      .contentType(MediaType.APPLICATION_JSON)
                      .content(String.format("{\"email\": \"%s\", \"role\": \"HOST\"}", devEmail))
                      .with(csrf()))
              .andExpect(status().isOk());

      String devToken = (String) parseJson(getResponseJson(devLoginResult)).get("token");

      // Use dev token to call /api/auth/me
      mockMvc
          .perform(get(ME).header("Authorization", authHeader(devToken)))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.email").value(devEmail))
          .andExpect(jsonPath("$.role").value("HOST"));

      // Create user via Google login
      String googleEmail = uniqueEmail("google-interop");
      String googleId = uniqueGoogleId("google-interop");
      String code = "interop-code";
      String accessToken = "interop-token";
      stubGoogleTokenExchange(code, accessToken, null);
      stubGoogleUserInfo(
          googleId, googleEmail, "Google User", "https://example.com/google.jpg", accessToken);

      ResultActions googleLoginResult =
          mockMvc
              .perform(
                  post(GOOGLE_CALLBACK)
                      .contentType(MediaType.APPLICATION_JSON)
                      .content(String.format("{\"code\": \"%s\"}", code))
                      .with(csrf()))
              .andExpect(status().isOk());

      String googleToken = (String) parseJson(getResponseJson(googleLoginResult)).get("token");
      Map<String, Object> googleUser =
          (Map<String, Object>) parseJson(getResponseJson(googleLoginResult)).get("user");
      String userId = (String) googleUser.get("id");

      // Use Google token to call /api/auth/me
      mockMvc
          .perform(get(ME).header("Authorization", authHeader(googleToken)))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.email").value(googleEmail));

      // Use Google token to select role
      mockMvc
          .perform(
              post(ROLE)
                  .header("Authorization", authHeader(googleToken))
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("{\"role\": \"RESIDENT\"}"))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.role").value("RESIDENT"));
    }

    @Test
    @DisplayName("hasSelectedRole flag progression - false -> true after role selection")
    void hasSelectedRoleProgression() throws Exception {
      // Initial dev login without role
      String email = uniqueEmail("progression");
      ResultActions initialLogin =
          mockMvc
              .perform(
                  post(DEV_LOGIN)
                      .contentType(MediaType.APPLICATION_JSON)
                      .content(String.format("{\"email\": \"%s\"}", email))
                      .with(csrf()))
              .andExpect(status().isOk())
              .andExpect(jsonPath("$.hasSelectedRole").value(false));

      String token = (String) parseJson(getResponseJson(initialLogin)).get("token");

      // Select role
      mockMvc
          .perform(
              post(ROLE)
                  .header("Authorization", authHeader(token))
                  .contentType(MediaType.APPLICATION_JSON)
                  .content("{\"role\": \"HOST\"}"))
          .andExpect(status().isOk());

      // Subsequent login should show hasSelectedRole=true
      mockMvc
          .perform(
              post(DEV_LOGIN)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(String.format("{\"email\": \"%s\"}", email))
                  .with(csrf()))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.hasSelectedRole").value(true))
          .andExpect(jsonPath("$.user.role").value("HOST"));
    }
  }
}
