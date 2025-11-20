package com.roompilot.config;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

/**
 * Configuration properties for JWT token generation and validation.
 */
@Configuration
@ConfigurationProperties(prefix = "jwt")
@Validated
public class JwtConfig {

    @NotBlank(message = "JWT secret must be configured")
    private String secret;

    private long expirationMs = 604800000L; // 7 days in milliseconds

    private long refreshExpirationMs = 2592000000L; // 30 days in milliseconds

    // Getters and Setters
    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getExpirationMs() {
        return expirationMs;
    }

    public void setExpirationMs(long expirationMs) {
        this.expirationMs = expirationMs;
    }

    public long getRefreshExpirationMs() {
        return refreshExpirationMs;
    }

    public void setRefreshExpirationMs(long refreshExpirationMs) {
        this.refreshExpirationMs = refreshExpirationMs;
    }
}
