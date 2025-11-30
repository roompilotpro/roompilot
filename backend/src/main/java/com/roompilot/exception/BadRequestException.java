package com.roompilot.exception;

/**
 * Exception thrown when request data is invalid or violates business logic. Results in HTTP 400 Bad
 * Request response.
 */
public class BadRequestException extends RuntimeException {

  public BadRequestException(String message) {
    super(message);
  }

  public BadRequestException(String message, Throwable cause) {
    super(message, cause);
  }
}
