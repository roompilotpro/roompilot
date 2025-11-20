package com.roompilot.security;

import com.roompilot.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Custom UserDetails implementation for Spring Security.
 * Wraps User entity and provides authentication and authorization data.
 */
public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();

        if (user.getRole() != null) {
            // Add role as ROLE_XXX for Spring Security
            authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        }

        return authorities;
    }

    @Override
    public String getPassword() {
        // No password for OAuth users
        return null;
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return !user.isDeleted();
    }

    @Override
    public boolean isAccountNonLocked() {
        return !user.isDeleted();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return !user.isDeleted();
    }

    /**
     * Get the underlying User entity.
     *
     * @return User entity
     */
    public User getUser() {
        return user;
    }
}
