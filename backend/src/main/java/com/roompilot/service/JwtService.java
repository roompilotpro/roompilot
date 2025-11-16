package com.roompilot.service;

import com.roompilot.config.JwtConfig;
import com.roompilot.exception.InvalidTokenException;
import com.roompilot.model.User;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import javax.crypto.SecretKey;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/** Service for generating and validating JWT tokens. Uses JJWT library with HS256 algorithm. */
@Service
@Slf4j
@SuppressFBWarnings(
    value = {"EI_EXPOSE_REP2", "CT_CONSTRUCTOR_THROW"},
    justification = "Spring DI; secure key initialization requires constructor throw")
public class JwtService {

  private final JwtConfig jwtConfig;
  private final SecretKey secretKey;

  public JwtService(JwtConfig jwtConfig) {
    this.jwtConfig = jwtConfig;
    // Create a secure key from the configured secret
    this.secretKey = Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes(StandardCharsets.UTF_8));
  }

  /**
   * Generate JWT token for a user.
   *
   * @param user The user to generate token for
   * @return JWT token string
   */
  public String generateToken(User user) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("userId", user.getId().toString());
    claims.put("email", user.getEmail());
    if (user.getRole() != null) {
      claims.put("role", user.getRole().name());
    }

    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + jwtConfig.getExpirationMs());

    return Jwts.builder()
        .claims(claims)
        .subject(user.getId().toString())
        .issuedAt(now)
        .expiration(expiryDate)
        .signWith(secretKey, Jwts.SIG.HS256)
        .compact();
  }

  /**
   * Validate JWT token.
   *
   * @param token JWT token to validate
   * @return true if token is valid, false otherwise
   */
  public boolean validateToken(String token) {
    try {
      Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token);
      return true;
    } catch (SignatureException e) {
      log.error("Invalid JWT signature: {}", e.getMessage());
      throw new InvalidTokenException("Invalid JWT signature", e);
    } catch (MalformedJwtException e) {
      log.error("Invalid JWT token: {}", e.getMessage());
      throw new InvalidTokenException("Invalid JWT token", e);
    } catch (ExpiredJwtException e) {
      log.error("JWT token is expired: {}", e.getMessage());
      throw new InvalidTokenException("JWT token is expired", e);
    } catch (UnsupportedJwtException e) {
      log.error("JWT token is unsupported: {}", e.getMessage());
      throw new InvalidTokenException("JWT token is unsupported", e);
    } catch (IllegalArgumentException e) {
      log.error("JWT claims string is empty: {}", e.getMessage());
      throw new InvalidTokenException("JWT claims string is empty", e);
    }
  }

  /**
   * Extract user ID from JWT token.
   *
   * @param token JWT token
   * @return User ID as UUID
   */
  public UUID getUserIdFromToken(String token) {
    Claims claims = getClaims(token);
    String userId = claims.getSubject();
    return UUID.fromString(userId);
  }

  /**
   * Extract email from JWT token.
   *
   * @param token JWT token
   * @return User email
   */
  public String getEmailFromToken(String token) {
    Claims claims = getClaims(token);
    return claims.get("email", String.class);
  }

  /**
   * Extract role from JWT token.
   *
   * @param token JWT token
   * @return User role as string, or null if not present
   */
  public String getRoleFromToken(String token) {
    Claims claims = getClaims(token);
    return claims.get("role", String.class);
  }

  /**
   * Check if token is expired.
   *
   * @param token JWT token
   * @return true if token is expired
   */
  public boolean isTokenExpired(String token) {
    try {
      Claims claims = getClaims(token);
      return claims.getExpiration().before(new Date());
    } catch (ExpiredJwtException e) {
      return true;
    }
  }

  /**
   * Extract all claims from JWT token.
   *
   * @param token JWT token
   * @return Claims object
   */
  private Claims getClaims(String token) {
    return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();
  }
}
