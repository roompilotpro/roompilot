package com.roompilot.exception;

/**
 * Exception thrown when JWT token validation fails.
 * Includes cases like expired tokens, invalid signatures, malformed tokens.
 */
public class InvalidTokenException extends RuntimeException {

    public InvalidTokenException(String message) {
        super(message);
    }

    public InvalidTokenException(String message, Throwable cause) {
        super(message, cause);
    }
}
