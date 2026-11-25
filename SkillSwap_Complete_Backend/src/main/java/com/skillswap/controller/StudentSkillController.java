package com.skillswap.controller;

import com.skillswap.dto.common.ApiResponse;
import com.skillswap.dto.skill.StudentSkillRequest;
import com.skillswap.dto.skill.StudentSkillResponse;
import com.skillswap.enums.SkillType;
import com.skillswap.service.StudentSkillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-skills")
public class StudentSkillController {

    private final StudentSkillService studentSkillService;

    public StudentSkillController(StudentSkillService studentSkillService) {
        this.studentSkillService = studentSkillService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StudentSkillResponse>> addStudentSkill(@Valid @RequestBody StudentSkillRequest request) {
        StudentSkillResponse added = studentSkillService.addStudentSkill(request);
        return new ResponseEntity<>(ApiResponse.success("Student skill added successfully", added), HttpStatus.CREATED);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<StudentSkillResponse>>> getMyStudentSkills(
            @RequestParam(required = false) SkillType type
    ) {
        return ResponseEntity.ok(ApiResponse.success("My student skills retrieved", studentSkillService.getMySkills(type)));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<StudentSkillResponse>>> getStudentSkillsByStudentId(
            @PathVariable Long studentId,
            @RequestParam(required = false) SkillType type
    ) {
        return ResponseEntity.ok(
                ApiResponse.success("Student skills retrieved", studentSkillService.getSkillsByStudentId(studentId, type))
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentSkillResponse>> updateStudentSkill(
            @PathVariable Long id,
            @Valid @RequestBody StudentSkillRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success("Student skill updated successfully", studentSkillService.updateMyStudentSkill(id, request))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudentSkill(@PathVariable Long id) {
        studentSkillService.deleteMyStudentSkill(id);
        return ResponseEntity.ok(ApiResponse.success("Student skill removed successfully", null));
    }
}
