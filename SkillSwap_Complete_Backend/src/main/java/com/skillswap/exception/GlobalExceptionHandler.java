package com.skillswap.exception;

import com.skillswap.dto.common.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex, HttpServletRequest req) {
        return buildError(HttpStatus.NOT_FOUND, "Resource Not Found", ex.getMessage(), req.getRequestURI(), null);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicate(DuplicateResourceException ex, HttpServletRequest req) {
        return buildError(HttpStatus.CONFLICT, "Duplicate Resource", ex.getMessage(), req.getRequestURI(), null);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex, HttpServletRequest req) {
        return buildError(HttpStatus.BAD_REQUEST, "Invalid Request", ex.getMessage(), req.getRequestURI(), null);
    }

    @ExceptionHandler({UnauthorizedException.class, BadCredentialsException.class, AuthenticationException.class})
    public ResponseEntity<ErrorResponse> handleUnauthorized(Exception ex, HttpServletRequest req) {
        String msg = ex instanceof BadCredentialsException ? "Invalid email or password" : ex.getMessage();
        return buildError(HttpStatus.UNAUTHORIZED, "Unauthorized", msg, req.getRequestURI(), null);
    }

    @ExceptionHandler({AccessDeniedException.class, org.springframework.security.access.AccessDeniedException.class})
    public ResponseEntity<ErrorResponse> handleAccessDenied(Exception ex, HttpServletRequest req) {
        return buildError(HttpStatus.FORBIDDEN, "Access Denied", ex.getMessage(), req.getRequestURI(), null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return buildError(
                HttpStatus.BAD_REQUEST,
                "Validation Failed",
                "One or more fields failed validation",
                req.getRequestURI(),
                errors
        );
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErrorResponse> handleDatabaseError(DataAccessException ex, HttpServletRequest req) {
        return buildError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Database Error",
                "A database error occurred while processing the request",
                req.getRequestURI(),
                null
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex, HttpServletRequest req) {
        return buildError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Internal Server Error",
                "An unexpected error occurred on the server",
                req.getRequestURI(),
                null
        );
    }

    private ResponseEntity<ErrorResponse> buildError(
            HttpStatus status,
            String error,
            String message,
            String path,
            Map<String, String> validationErrors
    ) {
        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                status.value(),
                error,
                message,
                path,
                validationErrors
        );
        return new ResponseEntity<>(response, status);
    }
}
