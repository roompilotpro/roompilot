package com.roompilot.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

/**
 * Utility class to validate if an email belongs to an admin user.
 * Admin emails are configured via ADMIN_EMAILS environment variable.
 */
@Component
public class AdminEmailValidator {

    private final Set<String> adminEmails;

    public AdminEmailValidator(@Value("${admin.emails:}") String adminEmailsConfig) {
        this.adminEmails = new HashSet<>();

        if (adminEmailsConfig != null && !adminEmailsConfig.trim().isEmpty()) {
            String[] emails = adminEmailsConfig.split(",");
            for (String email : emails) {
                String trimmedEmail = email.trim().toLowerCase();
                if (!trimmedEmail.isEmpty()) {
                    adminEmails.add(trimmedEmail);
                }
            }
        }
    }

    /**
     * Check if an email is in the admin whitelist.
     * Comparison is case-insensitive.
     *
     * @param email Email to check
     * @return true if email is in admin whitelist
     */
    public boolean isAdminEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return adminEmails.contains(email.trim().toLowerCase());
    }

    /**
     * Get the number of configured admin emails.
     *
     * @return Count of admin emails
     */
    public int getAdminEmailCount() {
        return adminEmails.size();
    }
}
