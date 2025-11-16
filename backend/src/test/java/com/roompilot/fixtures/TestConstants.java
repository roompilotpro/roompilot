package com.roompilot.fixtures;

import lombok.experimental.UtilityClass;

/**
 * Central repository for test constants used across test suites. Organized by category using nested
 * static classes for easy navigation.
 */
@UtilityClass
public final class TestConstants {
  // ==================== API Endpoints ====================

  public static final class Endpoints {
    // Auth endpoints
    public static final String GOOGLE_CALLBACK = "/api/auth/google/callback";
    public static final String DEV_LOGIN = "/api/auth/dev/login";
    public static final String ME = "/api/auth/me";
    public static final String ROLE = "/api/auth/role";
    public static final String LOGOUT = "/api/auth/logout";

    // OAuth mock endpoints (WireMock)
    public static final String OAUTH_TOKEN = "/oauth2/token";
    public static final String OAUTH_USERINFO = "/oauth2/userinfo";
  }

  // ==================== Test Data ====================

  public static final class TestData {
    // Email addresses
    public static final String TEST_EMAIL = "test@example.com";
    public static final String DEV_EMAIL = "dev@example.com";
    public static final String ADMIN_EMAIL = "admin@roompilot.com";
    public static final String TEST_ADMIN_EMAIL = "test.admin@example.com";

    // User details
    public static final String TEST_USER_NAME = "Test User";
    public static final String DEV_USER_NAME = "Dev User";
    public static final String ADMIN_USER_NAME = "Admin User";
    public static final String JOHN_DOE_NAME = "John Doe";

    // Profile data
    public static final String DEFAULT_PROFILE_PICTURE = "https://example.com/photo.jpg";
    public static final String TEST_PHONE = "555-1234";

    // Google OAuth data
    public static final String DEFAULT_GOOGLE_ID = "google-123";

    // Auth codes and tokens
    public static final String VALID_AUTH_CODE = "valid-auth-code";
    public static final String TEST_AUTH_CODE = "test-auth-code";
    public static final String INVALID_AUTH_CODE = "invalid-auth-code";
    public static final String TEST_ACCESS_TOKEN = "test-access-token";
    public static final String TEST_JWT_TOKEN = "test-jwt-token";

    // Message test data
    public static final String TEST_MESSAGE_CONTENT = "Test message";
    public static final String ANOTHER_MESSAGE_CONTENT = "Another message";
    public static final String NEW_MESSAGE_CONTENT = "New message";
    public static final String UPDATED_MESSAGE_CONTENT = "Updated content";

    // Message IDs
    public static final Long TEST_MESSAGE_ID = 1L;
    public static final Long NONEXISTENT_MESSAGE_ID = 999L;
  }

  // ==================== HTTP Headers ====================

  public static final class Headers {
    public static final String AUTHORIZATION = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";
  }

  // ==================== Response Messages ====================

  public static final class Messages {
    public static final String LOGOUT_SUCCESS = "Logout successful";
  }
}
