package com.skillswap.dto.auth;

import com.skillswap.enums.UserRole;

public class LoginResponse {

    private String token;
    private String tokenType = "Bearer";
    private Long expiresInMs;
    private Long studentId;
    private String fullName;
    private String email;
    private UserRole role;

    public LoginResponse() {}

    public LoginResponse(String token, Long expiresInMs, Long studentId, String fullName, String email, UserRole role) {
        this.token = token;
        this.tokenType = "Bearer";
        this.expiresInMs = expiresInMs;
        this.studentId = studentId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public Long getExpiresInMs() { return expiresInMs; }
    public void setExpiresInMs(Long expiresInMs) { this.expiresInMs = expiresInMs; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
}
