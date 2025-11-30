package com.roompilot.exception;

/** Custom exception for authentication errors. Thrown when authentication fails or is invalid. */
public class AuthenticationException extends RuntimeException {

  public AuthenticationException(String message) {
    super(message);
  }

  public AuthenticationException(String message, Throwable cause) {
    super(message, cause);
  }
}
