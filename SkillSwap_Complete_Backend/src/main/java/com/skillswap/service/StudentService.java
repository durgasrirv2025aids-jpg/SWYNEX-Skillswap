package com.skillswap.service;

import com.skillswap.dto.common.PageResponse;
import com.skillswap.dto.skill.StudentSkillResponse;
import com.skillswap.dto.student.StudentProfileResponse;
import com.skillswap.dto.student.StudentResponse;
import com.skillswap.dto.student.StudentUpdateRequest;
import com.skillswap.entity.Student;
import com.skillswap.enums.SkillType;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.repository.ConnectionRepository;
import com.skillswap.repository.StudentRepository;
import com.skillswap.repository.StudentSkillRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final ConnectionRepository connectionRepository;
    private final AuthService authService;

    public StudentService(
            StudentRepository studentRepository,
            StudentSkillRepository studentSkillRepository,
            ConnectionRepository connectionRepository,
            AuthService authService
    ) {
        this.studentRepository = studentRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.connectionRepository = connectionRepository;
        this.authService = authService;
    }

    public Student findEntityById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
    }

    public StudentResponse getMyProfile() {
        Student me = authService.getAuthenticatedStudent();
        return toStudentResponse(me);
    }

    @Transactional
    public StudentResponse updateMyProfile(StudentUpdateRequest request) {
        Student me = authService.getAuthenticatedStudent();
        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            me.setFullName(request.getFullName().trim());
        }
        if (request.getCollegeName() != null) {
            me.setCollegeName(request.getCollegeName().trim());
        }
        if (request.getDepartment() != null) {
            me.setDepartment(request.getDepartment().trim());
        }
        if (request.getYearOfStudy() != null) {
            me.setYearOfStudy(request.getYearOfStudy());
        }
        if (request.getBio() != null) {
            me.setBio(request.getBio().trim());
        }
        Student updated = studentRepository.save(me);
        return toStudentResponse(updated);
    }

    public StudentProfileResponse getStudentProfileById(Long id) {
        Student student = findEntityById(id);
        return toStudentProfileResponse(student);
    }

    public PageResponse<StudentResponse> searchStudents(
            String keyword,
            String department,
            String college,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100), Sort.by("id").ascending());
        Page<Student> studentPage = studentRepository.searchStudents(keyword, department, college, pageable);
        List<StudentResponse> content = studentPage.getContent().stream()
                .map(this::toStudentResponse)
                .toList();
        return new PageResponse<>(
                content,
                studentPage.getNumber(),
                studentPage.getSize(),
                studentPage.getTotalElements(),
                studentPage.getTotalPages(),
                studentPage.isLast()
        );
    }

    public StudentResponse toStudentResponse(Student student) {
        StudentResponse res = new StudentResponse();
        res.setId(student.getId());
        res.setFullName(student.getFullName());
        res.setEmail(student.getEmail());
        res.setCollegeName(student.getCollegeName());
        res.setDepartment(student.getDepartment());
        res.setYearOfStudy(student.getYearOfStudy());
        res.setBio(student.getBio());
        res.setAccountStatus(student.getAccountStatus());
        res.setRole(student.getRole());
        res.setCreatedAt(student.getCreatedAt());
        res.setUpdatedAt(student.getUpdatedAt());
        return res;
    }

    public StudentProfileResponse toStudentProfileResponse(Student student) {
        List<StudentSkillResponse> teachList = studentSkillRepository
                .findByStudentIdAndSkillType(student.getId(), SkillType.TEACH)
                .stream()
                .map(this::toStudentSkillResponse)
                .toList();

        List<StudentSkillResponse> learnList = studentSkillRepository
                .findByStudentIdAndSkillType(student.getId(), SkillType.LEARN)
                .stream()
                .map(this::toStudentSkillResponse)
                .toList();

        int connCount = connectionRepository.findAllByStudentId(student.getId()).size();

        StudentProfileResponse res = new StudentProfileResponse();
        res.setId(student.getId());
        res.setFullName(student.getFullName());
        res.setEmail(student.getEmail());
        res.setCollegeName(student.getCollegeName());
        res.setDepartment(student.getDepartment());
        res.setYearOfStudy(student.getYearOfStudy());
        res.setBio(student.getBio());
        res.setAccountStatus(student.getAccountStatus());
        res.setTeachingSkills(teachList);
        res.setLearningSkills(learnList);
        res.setConnectionCount(connCount);
        res.setCreatedAt(student.getCreatedAt());
        res.setUpdatedAt(student.getUpdatedAt());
        return res;
    }

    private StudentSkillResponse toStudentSkillResponse(com.skillswap.entity.StudentSkill ss) {
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
