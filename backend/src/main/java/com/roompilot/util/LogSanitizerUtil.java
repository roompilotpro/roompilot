package com.roompilot.util;

import java.util.regex.Pattern;
import lombok.experimental.UtilityClass;
import org.owasp.encoder.Encode;

/**
 * Utility class for sanitizing user-supplied strings before logging. Prevents log injection attacks
 * by removing control characters, line separators, and ANSI escape sequences.
 */
@UtilityClass
public final class LogSanitizerUtil {
  // CR, LF, TAB, FF, VT, Unicode line/paragraph separators, ESC (ANSI escape)
  private static final Pattern DANGEROUS_LOG_CHARS =
      Pattern.compile("[\\r\\n\\t\\f\\u000B\\u2028\\u2029\\u001B]");

  // Reasonable upper bound for a single log field
  private static final int MAX_LOG_FIELD_LENGTH = 1024;

  public static String sanitizeForLog(String input) {
    if (input == null) {
      return null;
    }

    // 1) Remove line breaks, tabs, unicode separators, and ESC
    String sanitized = DANGEROUS_LOG_CHARS.matcher(input).replaceAll(" ");

    // 2) Remove any remaining non-printable control chars (0x00–0x1F, 0x7F)
    sanitized = sanitized.replaceAll("\\p{Cntrl}", "");

    // 3) Collapse multiple spaces and trim
    sanitized = sanitized.replaceAll(" {2,}", " ").trim();

    // 4) Truncate to a safe length
    if (sanitized.length() > MAX_LOG_FIELD_LENGTH) {
      sanitized = sanitized.substring(0, MAX_LOG_FIELD_LENGTH) + "...(truncated)";
    }

    // 5) Apply OWASP encoding for CodeQL recognition
    return Encode.forJava(sanitized);
  }
}
