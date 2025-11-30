package com.roompilot.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.util.StringUtils;

/**
 * Custom request matcher that skips CSRF protection for requests with JWT Bearer tokens.
 *
 * <p>Rationale: CSRF attacks rely on browsers automatically sending credentials (cookies). Since
 * JWT tokens must be explicitly added to the Authorization header by JavaScript, requests with
 * valid Bearer tokens cannot be forged via CSRF attacks.
 *
 * <p>CSRF protection is only required for:
 *
 * <ul>
 *   <li>State-changing requests (POST, PUT, DELETE, PATCH)
 *   <li>Requests without a JWT Bearer token (e.g., pre-login endpoints)
 * </ul>
 */
public class JwtCsrfRequestMatcher implements RequestMatcher {

  private static final String AUTHORIZATION_HEADER = "Authorization";
  private static final String BEARER_PREFIX = "Bearer ";

  @Override
  public boolean matches(HttpServletRequest request) {
    String method = request.getMethod();

    // Safe methods don't need CSRF protection
    if ("GET".equals(method)
        || "HEAD".equals(method)
        || "TRACE".equals(method)
        || "OPTIONS".equals(method)) {
      return false;
    }

    // Skip CSRF if request has Bearer token (JWT authentication)
    // These requests cannot be forged via CSRF
    String authHeader = request.getHeader(AUTHORIZATION_HEADER);
    if (StringUtils.hasText(authHeader) && authHeader.startsWith(BEARER_PREFIX)) {
      return false;
    }

    // Require CSRF for state-changing requests without JWT
    return true;
  }
}
