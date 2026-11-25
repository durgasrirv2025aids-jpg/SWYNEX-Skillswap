package com.skillswap.controller;

import com.skillswap.dto.auth.LoginRequest;
import com.skillswap.dto.auth.LoginResponse;
import com.skillswap.dto.auth.RegisterRequest;
import com.skillswap.dto.auth.StudentRegistrationResponse;
import com.skillswap.dto.common.ApiResponse;
import com.skillswap.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<StudentRegistrationResponse>> register(@Valid @RequestBody RegisterRequest request) {
        StudentRegistrationResponse response = authService.register(request);
        return new ResponseEntity<>(
                ApiResponse.success("Student registered successfully", response),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        authService.logout();
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }
}
