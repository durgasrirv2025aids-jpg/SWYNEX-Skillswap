package com.skillswap.controller;

import com.skillswap.dto.common.ApiResponse;
import com.skillswap.dto.common.PageResponse;
import com.skillswap.dto.skill.SkillRequest;
import com.skillswap.dto.skill.SkillResponse;
import com.skillswap.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SkillResponse>> createSkill(@Valid @RequestBody SkillRequest request) {
        SkillResponse created = skillService.createSkillResponse(request);
        return new ResponseEntity<>(ApiResponse.success("Skill created successfully", created), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<SkillResponse>>> getAllSkills(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ApiResponse.success("Skills retrieved", skillService.getAllSkills(keyword, page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SkillResponse>> getSkillById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Skill retrieved", skillService.getSkillById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SkillResponse>> updateSkill(
            @PathVariable Long id,
            @Valid @RequestBody SkillRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Skill updated successfully", skillService.updateSkill(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
        return ResponseEntity.ok(ApiResponse.success("Skill deleted successfully", null));
    }
}
