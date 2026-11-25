package com.skillswap.controller;

import com.skillswap.dto.common.ApiResponse;
import com.skillswap.dto.match.MatchFilterRequest;
import com.skillswap.dto.match.MatchResponse;
import com.skillswap.dto.match.MatchedStudentResponse;
import com.skillswap.service.MatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<MatchResponse>> getMatches() {
        return ResponseEntity.ok(ApiResponse.success("Mutual skill matches retrieved", matchService.findMyMatches(new MatchFilterRequest())));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<MatchResponse>> searchMatches(
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String college,
            @RequestParam(required = false) String department
    ) {
        MatchFilterRequest filter = new MatchFilterRequest();
        filter.setSkill(skill);
        filter.setCollege(college);
        filter.setDepartment(department);
        return ResponseEntity.ok(ApiResponse.success("Filtered skill matches retrieved", matchService.findMyMatches(filter)));
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<ApiResponse<MatchedStudentResponse>> getMatchDetails(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success("Match details retrieved", matchService.getMatchDetailsWithStudent(studentId)));
    }
}
