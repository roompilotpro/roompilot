package com.roompilot.config;

import com.roompilot.security.JwtAuthenticationEntryPoint;
import com.roompilot.security.JwtAuthenticationFilter;
import com.roompilot.security.JwtCsrfRequestMatcher;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfigurationSource;

/** Spring Security configuration. Configures JWT-based authentication and authorization. */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
@SuppressFBWarnings(value = "EI_EXPOSE_REP2", justification = "Spring-managed DI components")
public class SecurityConfig {

  private final JwtAuthenticationFilter jwtAuthenticationFilter;
  private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
  private final CorsConfigurationSource corsConfigurationSource;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        // Enable CORS with our configuration
        .cors(cors -> cors.configurationSource(corsConfigurationSource))

        // Enable CSRF with conditional protection (skip for JWT-authenticated requests)
        .csrf(
            csrf ->
                csrf.requireCsrfProtectionMatcher(new JwtCsrfRequestMatcher())
                    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))

        // Set session management to stateless
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

        // Configure authorization rules
        .authorizeHttpRequests(
            auth ->
                auth
                    // Public endpoints (login/callback only)
                    .requestMatchers(
                        "/api/auth/google/callback",
                        "/api/auth/dev/login",
                        "/api/auth/logout",
                        "/actuator/health",
                        "/swagger-ui/**",
                        "/v3/api-docs/**",
                        "/swagger-ui.html",
                        "/oauth-**.html",
                        "/*.html",
                        "/**.css",
                        "/**.js",
                        "/error")
                    .permitAll()

                    // All other endpoints require authentication
                    .anyRequest()
                    .authenticated())

        // Set authentication entry point
        .exceptionHandling(
            exception -> exception.authenticationEntryPoint(jwtAuthenticationEntryPoint))

        // Add JWT filter before UsernamePasswordAuthenticationFilter
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}
