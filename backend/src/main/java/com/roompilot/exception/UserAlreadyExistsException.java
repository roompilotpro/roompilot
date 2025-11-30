package com.roompilot.exception;

/**
 * Exception thrown when attempting to create a user that already exists. Typically based on email
 * or Google ID uniqueness constraint.
 */
public class UserAlreadyExistsException extends RuntimeException {

  public UserAlreadyExistsException(String message) {
    super(message);
  }

  public UserAlreadyExistsException(String message, Throwable cause) {
    super(message, cause);
  }
}
