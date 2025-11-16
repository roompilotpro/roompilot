package com.roompilot.security;

import com.roompilot.model.User;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * Custom UserDetails implementation for Spring Security. Wraps User entity and provides
 * authentication and authorization data.
 */
@RequiredArgsConstructor
@Getter
@SuppressFBWarnings(
    value = {"EI_EXPOSE_REP", "EI_EXPOSE_REP2", "SE_BAD_FIELD"},
    justification = "User object exposure required for Spring Security")
public class CustomUserDetails implements UserDetails {

  private static final long serialVersionUID = 1L;

  private final User user;

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
}
