package com.roompilot.service;

import com.roompilot.exception.AuthenticationException;
import com.roompilot.model.dto.GoogleTokenResponse;
import com.roompilot.model.dto.GoogleUserInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

/**
 * Service for Google OAuth 2.0 operations. Handles token exchange and user info retrieval from
 * Google.
 */
@Service
public class GoogleOAuthService {

  private static final Logger logger = LoggerFactory.getLogger(GoogleOAuthService.class);

  @Value("${google.oauth.token-url}")
  private String tokenUrl;

  @Value("${google.oauth.userinfo-url}")
  private String userInfoUrl;

  @Value("${spring.security.oauth2.client.registration.google.client-id}")
  private String clientId;

  @Value("${spring.security.oauth2.client.registration.google.client-secret}")
  private String clientSecret;

  @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
  private String redirectUri;

  private final RestTemplate restTemplate;

  public GoogleOAuthService() {
    this.restTemplate = new RestTemplate();
  }

  /**
   * Exchange authorization code for access token.
   *
   * @param code Authorization code from OAuth callback
   * @return Google token response containing access token
   * @throws AuthenticationException if token exchange fails
   */
  public GoogleTokenResponse exchangeCodeForToken(String code) {
    try {
      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

      MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
      body.add("code", code);
      body.add("client_id", clientId);
      body.add("client_secret", clientSecret);
      body.add("redirect_uri", redirectUri);
      body.add("grant_type", "authorization_code");

      HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

      ResponseEntity<GoogleTokenResponse> response =
          restTemplate.exchange(tokenUrl, HttpMethod.POST, request, GoogleTokenResponse.class);

      if (response.getBody() == null) {
        throw new AuthenticationException("Failed to exchange code for token: empty response");
      }

      return response.getBody();

    } catch (HttpClientErrorException e) {
      logger.error("Failed to exchange code for token: {}", e.getMessage());
      throw new AuthenticationException("Invalid authorization code", e);
    } catch (Exception e) {
      logger.error("Error during token exchange: {}", e.getMessage());
      throw new AuthenticationException("Failed to exchange code for token", e);
    }
  }

  /**
   * Fetch user information from Google using access token.
   *
   * @param accessToken Google access token
   * @return Google user info
   * @throws AuthenticationException if user info retrieval fails
   */
  public GoogleUserInfo getUserInfo(String accessToken) {
    try {
      HttpHeaders headers = new HttpHeaders();
      headers.setBearerAuth(accessToken);

      HttpEntity<String> entity = new HttpEntity<>(headers);

      ResponseEntity<GoogleUserInfo> response =
          restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, GoogleUserInfo.class);

      if (response.getBody() == null) {
        throw new AuthenticationException("Failed to fetch user info: empty response");
      }

      return response.getBody();

    } catch (HttpClientErrorException e) {
      logger.error("Failed to fetch user info: {}", e.getMessage());
      throw new AuthenticationException("Invalid access token", e);
    } catch (Exception e) {
      logger.error("Error fetching user info: {}", e.getMessage());
      throw new AuthenticationException("Failed to fetch user info", e);
    }
  }
}
