package com.skillswap.controller;

import com.skillswap.dto.common.ApiResponse;
import com.skillswap.dto.common.PageResponse;
import com.skillswap.dto.connection.ConnectionResponse;
import com.skillswap.dto.skill.StudentSkillResponse;
import com.skillswap.dto.student.StudentProfileResponse;
import com.skillswap.dto.student.StudentResponse;
import com.skillswap.dto.student.StudentUpdateRequest;
import com.skillswap.enums.SkillType;
import com.skillswap.service.ConnectionService;
import com.skillswap.service.StudentService;
import com.skillswap.service.StudentSkillService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;
    private final StudentSkillService studentSkillService;
    private final ConnectionService connectionService;

    public StudentController(
            StudentService studentService,
            StudentSkillService studentSkillService,
            ConnectionService connectionService
    ) {
        this.studentService = studentService;
        this.studentSkillService = studentSkillService;
        this.connectionService = connectionService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<StudentResponse>> getMyProfile() {
        return ResponseEntity.ok(ApiResponse.success("Current student profile retrieved", studentService.getMyProfile()));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<StudentResponse>> updateMyProfile(@Valid @RequestBody StudentUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", studentService.updateMyProfile(request)));
    }

    @GetMapping("/me/skills")
    public ResponseEntity<ApiResponse<List<StudentSkillResponse>>> getMySkills(
            @RequestParam(required = false) SkillType type
    ) {
        return ResponseEntity.ok(ApiResponse.success("My skills retrieved", studentSkillService.getMySkills(type)));
    }

    @GetMapping("/me/connections")
    public ResponseEntity<ApiResponse<List<ConnectionResponse>>> getMyConnections() {
        return ResponseEntity.ok(ApiResponse.success("My connections retrieved", connectionService.getMyConnections()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Student profile retrieved", studentService.getStudentProfileById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<StudentResponse>>> searchStudents(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String college,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<StudentResponse> result = studentService.searchStudents(keyword, department, college, page, size);
        return ResponseEntity.ok(ApiResponse.success("Students retrieved", result));
    }
}
