package com.skillswap.service;

import com.skillswap.dto.skill.StudentSkillRequest;
import com.skillswap.dto.skill.StudentSkillResponse;
import com.skillswap.entity.Skill;
import com.skillswap.entity.Student;
import com.skillswap.entity.StudentSkill;
import com.skillswap.enums.SkillType;
import com.skillswap.exception.AccessDeniedException;
import com.skillswap.exception.DuplicateResourceException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.repository.StudentSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentSkillService {

    private final StudentSkillRepository studentSkillRepository;
    private final StudentService studentService;
    private final SkillService skillService;
    private final AuthService authService;

    public StudentSkillService(
            StudentSkillRepository studentSkillRepository,
            StudentService studentService,
            SkillService skillService,
            AuthService authService
    ) {
        this.studentSkillRepository = studentSkillRepository;
        this.studentService = studentService;
        this.skillService = skillService;
        this.authService = authService;
    }

    @Transactional
    public StudentSkillResponse addStudentSkill(StudentSkillRequest request) {
        Student currentStudent = authService.getAuthenticatedStudent();
        Skill skill = skillService.getOrCreateSkill(request.getSkillName(), request.getCategory());

        if (studentSkillRepository.existsByStudentIdAndSkillIdAndSkillType(
                currentStudent.getId(), skill.getId(), request.getSkillType())) {
            throw new DuplicateResourceException(
                    "You already have '" + skill.getSkillName() + "' added under " + request.getSkillType()
            );
        }

        StudentSkill entity = new StudentSkill();
        entity.setStudent(currentStudent);
        entity.setSkill(skill);
        entity.setSkillType(request.getSkillType());
        entity.setProficiencyLevel(
                request.getProficiencyLevel() != null && !request.getProficiencyLevel().isBlank()
                        ? request.getProficiencyLevel().trim()
                        : "Intermediate"
        );

        return toResponse(studentSkillRepository.save(entity));
    }

    public List<StudentSkillResponse> getMySkills(SkillType type) {
        Long myId = authService.getAuthenticatedStudentId();
        List<StudentSkill> list = (type != null)
                ? studentSkillRepository.findByStudentIdAndSkillType(myId, type)
                : studentSkillRepository.findByStudentId(myId);
        return list.stream().map(this::toResponse).toList();
    }

    public List<StudentSkillResponse> getSkillsByStudentId(Long studentId, SkillType type) {
        studentService.findEntityById(studentId);
        List<StudentSkill> list = (type != null)
                ? studentSkillRepository.findByStudentIdAndSkillType(studentId, type)
                : studentSkillRepository.findByStudentId(studentId);
        return list.stream().map(this::toResponse).toList();
    }

    @Transactional
    public StudentSkillResponse updateMyStudentSkill(Long studentSkillId, StudentSkillRequest request) {
        Long myId = authService.getAuthenticatedStudentId();
        StudentSkill existing = studentSkillRepository.findById(studentSkillId)
                .orElseThrow(() -> new ResourceNotFoundException("Student skill entry not found with ID: " + studentSkillId));

        if (!existing.getStudent().getId().equals(myId)) {
            throw new AccessDeniedException("You can only update your own skills");
        }

        Skill skill = skillService.getOrCreateSkill(request.getSkillName(), request.getCategory());
        SkillType targetType = request.getSkillType() != null ? request.getSkillType() : existing.getSkillType();

        studentSkillRepository.findByStudentIdAndSkillIdAndSkillType(myId, skill.getId(), targetType)
                .ifPresent(dup -> {
                    if (!dup.getId().equals(studentSkillId)) {
                        throw new DuplicateResourceException("Duplicate skill entry for type " + targetType);
                    }
                });

        existing.setSkill(skill);
        existing.setSkillType(targetType);
        if (request.getProficiencyLevel() != null && !request.getProficiencyLevel().isBlank()) {
            existing.setProficiencyLevel(request.getProficiencyLevel().trim());
        }
        return toResponse(studentSkillRepository.save(existing));
    }

    @Transactional
    public void deleteMyStudentSkill(Long studentSkillId) {
        Long myId = authService.getAuthenticatedStudentId();
        StudentSkill existing = studentSkillRepository.findById(studentSkillId)
                .orElseThrow(() -> new ResourceNotFoundException("Student skill entry not found with ID: " + studentSkillId));

        if (!existing.getStudent().getId().equals(myId)) {
            throw new AccessDeniedException("You can only delete your own skills");
        }
        studentSkillRepository.delete(existing);
    }

    public StudentSkillResponse toResponse(StudentSkill ss) {
        StudentSkillResponse res = new StudentSkillResponse();
        res.setId(ss.getId());
        res.setStudentId(ss.getStudent().getId());
        res.setStudentName(ss.getStudent().getFullName());
        res.setSkillId(ss.getSkill().getId());
        res.setSkillName(ss.getSkill().getSkillName());
        res.setCategory(ss.getSkill().getCategory());
        res.setSkillType(ss.getSkillType());
        res.setProficiencyLevel(ss.getProficiencyLevel());
        res.setCreatedAt(ss.getCreatedAt());
        return res;
    }
}
