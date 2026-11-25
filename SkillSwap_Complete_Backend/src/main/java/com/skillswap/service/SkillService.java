package com.skillswap.service;

import com.skillswap.dto.common.PageResponse;
import com.skillswap.dto.skill.SkillRequest;
import com.skillswap.dto.skill.SkillResponse;
import com.skillswap.entity.Skill;
import com.skillswap.exception.DuplicateResourceException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.repository.SkillRepository;
import com.skillswap.util.ValidationUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public Skill findEntityById(Long id) {
        return skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with ID: " + id));
    }

    @Transactional
    public Skill createSkill(SkillRequest request) {
        String normalizedName = ValidationUtil.normalizeSkillName(request.getSkillName());
        if (skillRepository.existsBySkillNameIgnoreCase(normalizedName)) {
            throw new DuplicateResourceException("Skill already exists: " + normalizedName);
        }
        Skill skill = new Skill();
        skill.setSkillName(normalizedName);
        skill.setCategory(request.getCategory() != null ? request.getCategory().trim() : "General");
        skill.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        return skillRepository.save(skill);
    }

    @Transactional
    public Skill getOrCreateSkill(String rawSkillName, String category) {
        String normalizedName = ValidationUtil.normalizeSkillName(rawSkillName);
        return skillRepository.findBySkillNameIgnoreCase(normalizedName)
                .orElseGet(() -> {
                    Skill s = new Skill();
                    s.setSkillName(normalizedName);
                    s.setCategory(category != null && !category.isBlank() ? category.trim() : "General");
                    return skillRepository.save(s);
                });
    }

    public SkillResponse createSkillResponse(SkillRequest request) {
        return toResponse(createSkill(request));
    }

    public PageResponse<SkillResponse> getAllSkills(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100), Sort.by("skillName").ascending());
        Page<Skill> skillPage = (keyword != null && !keyword.isBlank())
                ? skillRepository.searchSkills(keyword.trim(), pageable)
                : skillRepository.findAll(pageable);

        List<SkillResponse> content = skillPage.getContent().stream()
                .map(this::toResponse)
                .toList();

        return new PageResponse<>(
                content,
                skillPage.getNumber(),
                skillPage.getSize(),
                skillPage.getTotalElements(),
                skillPage.getTotalPages(),
                skillPage.isLast()
        );
    }

    public SkillResponse getSkillById(Long id) {
        return toResponse(findEntityById(id));
    }

    @Transactional
    public SkillResponse updateSkill(Long id, SkillRequest request) {
        Skill existing = findEntityById(id);
        String normalizedName = ValidationUtil.normalizeSkillName(request.getSkillName());
        skillRepository.findBySkillNameIgnoreCase(normalizedName).ifPresent(other -> {
            if (!other.getId().equals(id)) {
                throw new DuplicateResourceException("Another skill already uses name: " + normalizedName);
            }
        });
        existing.setSkillName(normalizedName);
        if (request.getCategory() != null) {
            existing.setCategory(request.getCategory().trim());
        }
        if (request.getDescription() != null) {
            existing.setDescription(request.getDescription().trim());
        }
        return toResponse(skillRepository.save(existing));
    }

    @Transactional
    public void deleteSkill(Long id) {
        Skill existing = findEntityById(id);
        skillRepository.delete(existing);
    }

    public SkillResponse toResponse(Skill skill) {
        SkillResponse res = new SkillResponse();
        res.setId(skill.getId());
        res.setSkillName(skill.getSkillName());
        res.setCategory(skill.getCategory());
        res.setDescription(skill.getDescription());
        res.setCreatedAt(skill.getCreatedAt());
        return res;
    }
}
