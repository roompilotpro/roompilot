package com.roompilot.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/** Response DTO for Google user info endpoint. Maps to Google's userinfo endpoint response. */
@Data
public class GoogleUserInfo {

  @JsonProperty("sub")
  private String sub; // Google user ID

  @JsonProperty("email")
  private String email;

  @JsonProperty("email_verified")
  private Boolean emailVerified;

  @JsonProperty("name")
  private String name;

  @JsonProperty("given_name")
  private String givenName;

  @JsonProperty("family_name")
  private String familyName;

  @JsonProperty("picture")
  private String picture;

  @JsonProperty("locale")
  private String locale;
}
