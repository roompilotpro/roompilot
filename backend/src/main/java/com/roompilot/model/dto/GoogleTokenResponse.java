package com.roompilot.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/** Response DTO for Google OAuth token exchange. Maps to Google's token endpoint response. */
@Data
public class GoogleTokenResponse {

  @JsonProperty("access_token")
  private String accessToken;

  @JsonProperty("expires_in")
  private Integer expiresIn;

  @JsonProperty("token_type")
  private String tokenType;

  @JsonProperty("scope")
  private String scope;

  @JsonProperty("id_token")
  private String idToken;

  @JsonProperty("refresh_token")
  private String refreshToken;
}
