package com.roompilot.model.dto;

/**
 * Authentication response containing JWT token and user data.
 * Returned after successful Google OAuth login or development auth.
 */
public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private UserDTO user;
    private boolean hasSelectedRole;

    // Constructors
    public AuthResponse() {
    }

    public AuthResponse(String token, UserDTO user, boolean hasSelectedRole) {
        this.token = token;
        this.user = user;
        this.hasSelectedRole = hasSelectedRole;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public boolean isHasSelectedRole() {
        return hasSelectedRole;
    }

    public void setHasSelectedRole(boolean hasSelectedRole) {
        this.hasSelectedRole = hasSelectedRole;
    }
}
