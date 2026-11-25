package com.skillswap.controller;

import com.skillswap.dto.admin.AdminDashboardResponse;
import com.skillswap.dto.admin.AdminStudentResponse;
import com.skillswap.dto.common.ApiResponse;
import com.skillswap.dto.connection.ConnectionResponse;
import com.skillswap.dto.request.ExchangeRequestResponse;
import com.skillswap.dto.skill.SkillResponse;
import com.skillswap.enums.AccountStatus;
import com.skillswap.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard statistics retrieved", adminService.getDashboardStats()));
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<AdminStudentResponse>>> getAllStudents() {
        return ResponseEntity.ok(ApiResponse.success("All students retrieved", adminService.getAllStudents()));
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<ApiResponse<AdminStudentResponse>> getStudentDetails(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Student details retrieved", adminService.getStudentDetails(id)));
    }

    @PatchMapping("/students/{id}/status")
    public ResponseEntity<ApiResponse<AdminStudentResponse>> updateStudentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        String statusStr = payload.get("accountStatus");
        AccountStatus status = AccountStatus.valueOf(statusStr.toUpperCase());
        return ResponseEntity.ok(ApiResponse.success("Student status updated", adminService.updateStudentStatus(id, status)));
    }

    @GetMapping("/skills")
    public ResponseEntity<ApiResponse<List<SkillResponse>>> getAllSkills() {
        return ResponseEntity.ok(ApiResponse.success("All skills retrieved", adminService.getAllSkills()));
    }

    @GetMapping("/requests")
    public ResponseEntity<ApiResponse<List<ExchangeRequestResponse>>> getAllRequests() {
        return ResponseEntity.ok(ApiResponse.success("All exchange requests retrieved", adminService.getAllExchangeRequests()));
    }

    @GetMapping("/connections")
    public ResponseEntity<ApiResponse<List<ConnectionResponse>>> getAllConnections() {
        return ResponseEntity.ok(ApiResponse.success("All connections retrieved", adminService.getAllConnections()));
    }
}
