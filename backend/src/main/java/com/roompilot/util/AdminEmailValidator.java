package com.roompilot.util;

import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Utility class to validate if an email belongs to an admin user. Admin emails are configured via
 * ADMIN_EMAILS environment variable.
 */
@Component
public class AdminEmailValidator {

  private final Set<String> adminEmails;

  public AdminEmailValidator(@Value("${admin.emails:}") String adminEmailsConfig) {
    this.adminEmails = new HashSet<>();

    if (adminEmailsConfig != null && !adminEmailsConfig.trim().isEmpty()) {
      String[] emails = adminEmailsConfig.split(",");
      for (String email : emails) {
        String trimmedEmail = email.trim().toLowerCase(Locale.ROOT);
        if (!trimmedEmail.isEmpty()) {
          adminEmails.add(trimmedEmail);
        }
      }
    }
  }

  /**
   * Check if an email is in the admin whitelist. Comparison is case-insensitive.
   *
   * @param email Email to check
   * @return true if email is in admin whitelist
   */
  public boolean isAdminEmail(String email) {
    if (email == null || email.trim().isEmpty()) {
      return false;
    }
    return adminEmails.contains(email.trim().toLowerCase(Locale.ROOT));
  }
}
