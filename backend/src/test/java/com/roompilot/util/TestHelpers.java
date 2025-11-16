package com.roompilot.util;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static com.roompilot.fixtures.TestConstants.Headers.*;
import static com.roompilot.fixtures.TestConstants.TestData.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.roompilot.model.User;
import com.roompilot.model.UserRole;
import com.roompilot.service.JwtService;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import org.springframework.test.web.servlet.ResultActions;

/**
 * Test utility class providing helper methods for integration tests. Includes methods for: -
 * Configuring WireMock stubs for Google OAuth endpoints - Generating JWT tokens - Creating test
 * user fixtures - Common assertions
 */
public class TestHelpers {

  private static final ObjectMapper objectMapper = new ObjectMapper();

  /**
   * Stub successful Google token exchange endpoint.
   *
   * @param code Authorization code to match
   * @param accessToken Access token to return
   * @param idToken Optional ID token to return
   */
  public static void stubGoogleTokenExchange(String code, String accessToken, String idToken) {
    ensureWireMockConfigured();
    stubFor(
        post(urlEqualTo("/oauth2/token"))
            .withRequestBody(containing("code=" + code))
            .willReturn(
                aResponse()
                    .withStatus(200)
                    .withHeader("Content-Type", "application/json")
                    .withBody(
                        String.format(
                            """
                    {
                      "access_token": "%s",
                      "expires_in": 3600,
                      "token_type": "Bearer",
                      "scope": "openid email profile",
                      "id_token": "%s"
                    }
                    """,
                            accessToken, idToken != null ? idToken : "mock-id-token"))));
  }

  /**
   * Stub successful Google userinfo endpoint.
   *
   * @param googleId Google user ID (sub)
   * @param email User email
   * @param name Full name
   * @param picture Profile picture URL
   * @param accessToken Access token to match
   */
  public static void stubGoogleUserInfo(
      String googleId, String email, String name, String picture, String accessToken) {
    ensureWireMockConfigured();
    stubFor(
        get(urlEqualTo("/oauth2/userinfo"))
            .withHeader("Authorization", equalTo("Bearer " + accessToken))
            .willReturn(
                aResponse()
                    .withStatus(200)
                    .withHeader("Content-Type", "application/json")
                    .withBody(
                        String.format(
                            """
                    {
                      "sub": "%s",
                      "email": "%s",
                      "email_verified": true,
                      "name": "%s",
                      "given_name": "%s",
                      "family_name": "%s",
                      "picture": "%s",
                      "locale": "en"
                    }
                    """,
                            googleId,
                            email,
                            name,
                            name.split(" ")[0],
                            name.split(" ").length > 1 ? name.split(" ")[1] : "",
                            picture))));
  }

  /**
   * Stub Google token exchange failure.
   *
   * @param code Authorization code to match
   * @param statusCode HTTP status code to return (e.g., 400, 500)
   */
  public static void stubGoogleTokenExchangeFailure(String code, int statusCode) {
    ensureWireMockConfigured();
    stubFor(
        post(urlEqualTo("/oauth2/token"))
            .withRequestBody(containing("code=" + code))
            .willReturn(
                aResponse()
                    .withStatus(statusCode)
                    .withHeader("Content-Type", "application/json")
                    .withBody(
                        """
                {
                  "error": "invalid_grant",
                  "error_description": "Invalid authorization code"
                }
                """)));
  }

  /**
   * Stub Google userinfo endpoint failure.
   *
   * @param accessToken Access token to match
   * @param statusCode HTTP status code to return
   */
  public static void stubGoogleUserInfoFailure(String accessToken, int statusCode) {
    ensureWireMockConfigured();
    stubFor(
        get(urlEqualTo("/oauth2/userinfo"))
            .withHeader("Authorization", equalTo("Bearer " + accessToken))
            .willReturn(
                aResponse()
                    .withStatus(statusCode)
                    .withHeader("Content-Type", "application/json")
                    .withBody(
                        """
                {
                  "error": {
                    "code": 401,
                    "message": "Invalid Credentials"
                  }
                }
                """)));
  }

  /**
   * Create a test user for easy fixture creation.
   *
   * @param email User email
   * @param googleId Google ID
   * @return User instance
   */
  public static User createTestUser(String email, String googleId) {
    User user = new User(googleId, email, TEST_USER_NAME);
    user.setProfilePictureUrl(DEFAULT_PROFILE_PICTURE);
    user.setIsDevUser(false);
    user.setLastLogin(LocalDateTime.now());
    return user;
  }

  /**
   * Create a dev user (with dev- prefixed Google ID).
   *
   * @param email User email
   * @param role User role (can be null)
   * @return User
   */
  public static User createDevUser(String email, UserRole role) {
    User user = new User("dev-" + UUID.randomUUID(), email, DEV_USER_NAME);
    user.setIsDevUser(true);
    user.setRole(role);
    user.setLastLogin(LocalDateTime.now());
    return user;
  }

  /**
   * Generate a valid JWT token for a user using the provided JwtService.
   *
   * @param jwtService JWT service instance
   * @param user User to generate token for
   * @return JWT token string
   */
  public static String generateToken(JwtService jwtService, User user) {
    return jwtService.generateToken(user);
  }

  /**
   * Generate an expired JWT token for testing. Creates a token that expired 1 hour ago.
   *
   * @param user User to generate token for
   * @param secretKey JWT secret key for signing
   * @return Expired JWT token string
   */
  public static String generateExpiredToken(User user, String secretKey) {
    var key =
        io.jsonwebtoken.security.Keys.hmacShaKeyFor(
            secretKey.getBytes(java.nio.charset.StandardCharsets.UTF_8));

    java.util.Map<String, Object> claims = new java.util.HashMap<>();
    claims.put("userId", user.getId().toString());
    claims.put("email", user.getEmail());
    if (user.getRole() != null) {
      claims.put("role", user.getRole().name());
    }

    java.util.Date now = new java.util.Date();
    java.util.Date issuedAt = new java.util.Date(now.getTime() - 7200000); // 2 hours ago
    java.util.Date expiryDate = new java.util.Date(now.getTime() - 3600000); // 1 hour ago (expired)

    return io.jsonwebtoken.Jwts.builder()
        .claims(claims)
        .subject(user.getId().toString())
        .issuedAt(issuedAt)
        .expiration(expiryDate)
        .signWith(key, io.jsonwebtoken.Jwts.SIG.HS256)
        .compact();
  }

  /**
   * Parse JWT claims from a token string.
   *
   * @param jwtService JWT service instance
   * @param token JWT token
   * @return Map of claims
   */
  public static Map<String, Object> parseTokenClaims(JwtService jwtService, String token) {
    UUID userId = jwtService.getUserIdFromToken(token);
    String email = jwtService.getEmailFromToken(token);
    String role = jwtService.getRoleFromToken(token);

    return Map.of(
        "userId", userId.toString(), "email", email, "role", role != null ? role : "null");
  }

  /**
   * Assert that a timestamp is recent (within the last 60 seconds).
   *
   * @param timestamp Timestamp to check
   * @return true if recent
   */
  public static boolean isRecentTimestamp(LocalDateTime timestamp) {
    if (timestamp == null) {
      return false;
    }
    LocalDateTime now = LocalDateTime.now();
    return timestamp.isAfter(now.minusSeconds(60)) && timestamp.isBefore(now.plusSeconds(5));
  }

  /**
   * Extract JSON string from MockMvc result.
   *
   * @param result MockMvc result
   * @return JSON string
   */
  public static String getResponseJson(ResultActions result) throws Exception {
    return result.andReturn().getResponse().getContentAsString();
  }

  /**
   * Parse JSON string to Map.
   *
   * @param json JSON string
   * @return Map representation
   */
  @SuppressWarnings("unchecked")
  public static Map<String, Object> parseJson(String json) throws Exception {
    return objectMapper.readValue(json, Map.class);
  }

  /**
   * Extract nested value from JSON map.
   *
   * @param map JSON map
   * @param path Dot-separated path (e.g., "user.email")
   * @return Value at path
   */
  public static Object getNestedValue(Map<String, Object> map, String path) {
    String[] parts = path.split("\\.");
    Object current = map;
    for (String part : parts) {
      if (current instanceof Map) {
        current = ((Map<?, ?>) current).get(part);
      } else {
        return null;
      }
    }
    return current;
  }

  /**
   * Create authorization header with Bearer token.
   *
   * @param token JWT token
   * @return Authorization header value
   */
  public static String authHeader(String token) {
    return BEARER_PREFIX + token;
  }

  /**
   * Create a unique Google ID for testing.
   *
   * @param suffix Optional suffix for identification
   * @return Google ID string
   */
  public static String uniqueGoogleId(String suffix) {
    return "google-" + UUID.randomUUID() + (suffix != null ? "-" + suffix : "");
  }

  /**
   * Create a unique email for testing.
   *
   * @param prefix Email prefix
   * @return Email address
   */
  public static String uniqueEmail(String prefix) {
    return prefix + "+" + UUID.randomUUID().toString().substring(0, 8) + "@example.com";
  }

  /**
   * Configure WireMock to use the dynamically assigned port exposed via the wiremock.server.port
   * property. This avoids accidental calls to the default 8080 port when running tests in parallel
   * or with random ports.
   */
  private static void ensureWireMockConfigured() {
    String portProperty = System.getProperty("wiremock.server.port");
    if (portProperty != null) {
      int port = Integer.parseInt(portProperty);
      configureFor("localhost", port);
    }
  }
}
