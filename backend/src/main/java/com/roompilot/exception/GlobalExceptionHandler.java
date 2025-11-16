package com.roompilot.exception;

import com.roompilot.model.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global exception handler for all REST controllers. Provides consistent error responses across the
 * application with appropriate HTTP status codes.
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

  /**
   * Handle authentication failures (invalid credentials, missing auth, etc.)
   *
   * @param ex The authentication exception
   * @param request The HTTP request
   * @return 401 Unauthorized response
   */
  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<ErrorResponse> handleAuthenticationException(
      AuthenticationException ex, HttpServletRequest request) {
    log.error("Authentication error: {}", ex.getMessage());

    ErrorResponse errorResponse =
        ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.UNAUTHORIZED.value())
            .error(HttpStatus.UNAUTHORIZED.getReasonPhrase())
            .message(ex.getMessage())
            .path(request.getRequestURI())
            .build();

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
  }

  /**
   * Handle invalid JWT token errors (expired, malformed, invalid signature, etc.)
   *
   * @param ex The invalid token exception
   * @param request The HTTP request
   * @return 401 Unauthorized response
   */
  @ExceptionHandler(InvalidTokenException.class)
  public ResponseEntity<ErrorResponse> handleInvalidTokenException(
      InvalidTokenException ex, HttpServletRequest request) {
    log.error("Invalid token: {}", ex.getMessage());

    ErrorResponse errorResponse =
        ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.UNAUTHORIZED.value())
            .error(HttpStatus.UNAUTHORIZED.getReasonPhrase())
            .message(ex.getMessage())
            .path(request.getRequestURI())
            .build();

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
  }

  /**
   * Handle permission denied errors (user lacks permission for action)
   *
   * @param ex The forbidden exception
   * @param request The HTTP request
   * @return 403 Forbidden response
   */
  @ExceptionHandler(ForbiddenException.class)
  public ResponseEntity<ErrorResponse> handleForbiddenException(
      ForbiddenException ex, HttpServletRequest request) {
    log.error("Forbidden: {}", ex.getMessage());

    ErrorResponse errorResponse =
        ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.FORBIDDEN.value())
            .error(HttpStatus.FORBIDDEN.getReasonPhrase())
            .message(ex.getMessage())
            .path(request.getRequestURI())
            .build();

    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
  }

  /**
   * Handle resource not found errors
   *
   * @param ex The not found exception
   * @param request The HTTP request
   * @return 404 Not Found response
   */
  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<ErrorResponse> handleNotFoundException(
      NotFoundException ex, HttpServletRequest request) {
    log.error("Resource not found: {}", ex.getMessage());

    ErrorResponse errorResponse =
        ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.NOT_FOUND.value())
            .error(HttpStatus.NOT_FOUND.getReasonPhrase())
            .message(ex.getMessage())
            .path(request.getRequestURI())
            .build();

    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
  }

  /**
   * Handle validation errors from @Valid annotations
   *
   * @param ex The validation exception
   * @param request The HTTP request
   * @return 400 Bad Request response with field-level validation errors
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationException(
      MethodArgumentNotValidException ex, HttpServletRequest request) {
    log.error("Validation failed: {}", ex.getMessage());

    Map<String, String> validationErrors = new HashMap<>();
    ex.getBindingResult()
        .getAllErrors()
        .forEach(
            error -> {
              String fieldName = ((FieldError) error).getField();
              String errorMessage = error.getDefaultMessage();
              validationErrors.put(fieldName, errorMessage);
            });

    ErrorResponse errorResponse =
        ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
            .message("Validation failed for one or more fields")
            .path(request.getRequestURI())
            .validationErrors(validationErrors)
            .build();

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }

  /**
   * Handle bad request errors (invalid input, business logic violations, etc.)
   *
   * @param ex The bad request exception
   * @param request The HTTP request
   * @return 400 Bad Request response
   */
  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<ErrorResponse> handleBadRequestException(
      BadRequestException ex, HttpServletRequest request) {
    log.error("Bad request: {}", ex.getMessage());

    ErrorResponse errorResponse =
        ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
            .message(ex.getMessage())
            .path(request.getRequestURI())
            .build();

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }

  /**
   * Handle resource conflict errors (duplicate user, etc.)
   *
   * @param ex The user already exists exception
   * @param request The HTTP request
   * @return 409 Conflict response
   */
  @ExceptionHandler(UserAlreadyExistsException.class)
  public ResponseEntity<ErrorResponse> handleUserAlreadyExistsException(
      UserAlreadyExistsException ex, HttpServletRequest request) {
    log.error("Resource conflict: {}", ex.getMessage());

    ErrorResponse errorResponse =
        ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.CONFLICT.value())
            .error(HttpStatus.CONFLICT.getReasonPhrase())
            .message(ex.getMessage())
            .path(request.getRequestURI())
            .build();

    return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
  }

  /**
   * Handle all other uncaught exceptions
   *
   * @param ex The exception
   * @param request The HTTP request
   * @return 500 Internal Server Error response
   */
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGenericException(
      Exception ex, HttpServletRequest request) {
    log.error("Unexpected error: {}", ex.getMessage(), ex);

    ErrorResponse errorResponse =
        ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
            .message("An unexpected error occurred. Please try again later.")
            .path(request.getRequestURI())
            .build();

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
  }
}
