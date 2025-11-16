package com.roompilot.exception;

/**
 * Exception thrown when a user lacks permission to perform an action. Results in HTTP 403 Forbidden
 * response.
 */
public class ForbiddenException extends RuntimeException {

  public ForbiddenException(String message) {
    super(message);
  }

  public ForbiddenException(String message, Throwable cause) {
    super(message, cause);
  }
}
