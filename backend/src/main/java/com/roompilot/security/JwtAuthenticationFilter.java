package com.roompilot.security;

import com.roompilot.exception.InvalidTokenException;
import com.roompilot.model.User;
import com.roompilot.repository.UserRepository;
import com.roompilot.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * JWT authentication filter. Extracts JWT from Authorization header, validates it, and sets
 * SecurityContext.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private static final String AUTHORIZATION_HEADER = "Authorization";
  private static final String BEARER_PREFIX = "Bearer ";

  private final JwtService jwtService;
  private final UserRepository userRepository;

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    try {
      String jwt = extractJwtFromRequest(request);

      if (jwt != null && jwtService.validateToken(jwt)) {
        UUID userId = jwtService.getUserIdFromToken(jwt);

        User user = userRepository.findById(userId).filter(u -> !u.isDeleted()).orElse(null);

        if (user != null) {
          CustomUserDetails userDetails = new CustomUserDetails(user);
          UsernamePasswordAuthenticationToken authentication =
              new UsernamePasswordAuthenticationToken(
                  userDetails, null, userDetails.getAuthorities());

          authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
          SecurityContextHolder.getContext().setAuthentication(authentication);

          log.debug("Set authentication for user: {}", user.getEmail());
        }
      }
    } catch (InvalidTokenException e) {
      log.error("Invalid JWT token: {}", e.getMessage());
      // Don't set authentication, let request continue (will fail if endpoint requires auth)
    } catch (Exception e) {
      log.error("Could not set user authentication: {}", e.getMessage());
    }

    filterChain.doFilter(request, response);
  }

  /**
   * Extract JWT token from Authorization header.
   *
   * @param request HTTP request
   * @return JWT token string, or null if not found
   */
  private String extractJwtFromRequest(HttpServletRequest request) {
    String bearerToken = request.getHeader(AUTHORIZATION_HEADER);

    if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
      return bearerToken.substring(BEARER_PREFIX.length());
    }

    return null;
  }
}
