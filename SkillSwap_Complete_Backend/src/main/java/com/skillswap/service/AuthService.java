package com.skillswap.service;

import com.skillswap.dto.auth.LoginRequest;
import com.skillswap.dto.auth.LoginResponse;
import com.skillswap.dto.auth.RegisterRequest;
import com.skillswap.dto.auth.StudentRegistrationResponse;
import com.skillswap.entity.Student;
import com.skillswap.enums.AccountStatus;
import com.skillswap.enums.UserRole;
import com.skillswap.exception.BadRequestException;
import com.skillswap.exception.DuplicateResourceException;
import com.skillswap.exception.UnauthorizedException;
import com.skillswap.repository.StudentRepository;
import com.skillswap.security.CustomUserDetails;
import com.skillswap.security.JwtService;
import com.skillswap.util.ValidationUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            StudentRepository studentRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public StudentRegistrationResponse register(RegisterRequest request) {
        String normalizedEmail = ValidationUtil.normalizeEmail(request.getEmail());

        if (studentRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new DuplicateResourceException("Email is already registered: " + normalizedEmail);
        }

        Student student = new Student();
        student.setFullName(request.getFullName().trim());
        student.setEmail(normalizedEmail);
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        student.setCollegeName(request.getCollegeName() != null ? request.getCollegeName().trim() : null);
        student.setDepartment(request.getDepartment() != null ? request.getDepartment().trim() : null);
        student.setYearOfStudy(request.getYearOfStudy());
        student.setBio(request.getBio() != null ? request.getBio().trim() : null);
        student.setAccountStatus(AccountStatus.ACTIVE);
        student.setRole(UserRole.STUDENT);

        Student saved = studentRepository.save(student);

        StudentRegistrationResponse response = new StudentRegistrationResponse();
        response.setStudentId(saved.getId());
        response.setFullName(saved.getFullName());
        response.setEmail(saved.getEmail());
        response.setCollegeName(saved.getCollegeName());
        response.setDepartment(saved.getDepartment());
        response.setYearOfStudy(saved.getYearOfStudy());
        response.setAccountStatus(saved.getAccountStatus());
        response.setRole(saved.getRole());
        response.setCreatedAt(saved.getCreatedAt());
        return response;
    }

    public LoginResponse login(LoginRequest request) {
        String normalizedEmail = ValidationUtil.normalizeEmail(request.getEmail());

        Student student = studentRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (student.getAccountStatus() == AccountStatus.DISABLED) {
            throw new UnauthorizedException("Account is disabled. Please contact an administrator.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails);

        return new LoginResponse(
                token,
                jwtService.getExpirationMs(),
                student.getId(),
                student.getFullName(),
                student.getEmail(),
                student.getRole()
        );
    }

    public void logout() {
        SecurityContextHolder.clearContext();
    }

    public Student getAuthenticatedStudent() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new UnauthorizedException("No authenticated user found");
        }
        return studentRepository.findByEmailIgnoreCase(userDetails.getUsername())
                .orElseThrow(() -> new UnauthorizedException("Authenticated student not found"));
    }

    public Long getAuthenticatedStudentId() {
        return getAuthenticatedStudent().getId();
    }

    public void assertValidIds(Long idA, Long idB) {
        if (idA == null || idB == null) {
            throw new BadRequestException("Student IDs must not be null");
        }
    }
}
