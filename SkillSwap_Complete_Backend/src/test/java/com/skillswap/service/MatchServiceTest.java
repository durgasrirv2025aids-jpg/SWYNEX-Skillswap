package com.skillswap.service;

import com.skillswap.dto.match.MatchFilterRequest;
import com.skillswap.dto.match.MatchedStudentResponse;
import com.skillswap.entity.Skill;
import com.skillswap.entity.Student;
import com.skillswap.entity.StudentSkill;
import com.skillswap.enums.AccountStatus;
import com.skillswap.enums.SkillType;
import com.skillswap.enums.UserRole;
import com.skillswap.repository.ConnectionRepository;
import com.skillswap.repository.StudentRepository;
import com.skillswap.repository.StudentSkillRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class MatchServiceTest {

    private final StudentRepository studentRepository = mock(StudentRepository.class);
    private final StudentSkillRepository studentSkillRepository = mock(StudentSkillRepository.class);
    private final ConnectionRepository connectionRepository = mock(ConnectionRepository.class);
    private final MatchService matchService = new MatchService(
            studentRepository,
            studentSkillRepository,
            connectionRepository,
            null
    );

    private Student currentStudent;
    private Student candidate;

    @BeforeEach
    void setUp() {
        currentStudent = student(1L, "Current Student", null, null);
        candidate = student(2L, "Matching Student", "  Example   College ", " Computer   Science ");

        when(studentRepository.findAll()).thenReturn(List.of(candidate));
        when(connectionRepository.existsConnectionBetweenStudents(1L, 2L)).thenReturn(false);
        when(studentSkillRepository.findByStudentIdAndSkillType(1L, SkillType.TEACH))
                .thenReturn(List.of(studentSkill("Java", SkillType.TEACH)));
        when(studentSkillRepository.findByStudentIdAndSkillType(1L, SkillType.LEARN))
                .thenReturn(List.of(studentSkill("Python", SkillType.LEARN)));
        when(studentSkillRepository.findByStudentIdAndSkillType(2L, SkillType.TEACH))
                .thenReturn(List.of(studentSkill("  Python  ", SkillType.TEACH)));
        when(studentSkillRepository.findByStudentIdAndSkillType(2L, SkillType.LEARN))
                .thenReturn(List.of(studentSkill("Java", SkillType.LEARN)));
    }

    @Test
    void appliesSkillDepartmentAndCollegeFiltersIndividuallyAndTogether() {
        assertMatchFound(filter("  pYtHoN  ", null, null));
        assertMatchFound(filter(null, null, " computer science "));
        assertMatchFound(filter(null, " example college ", null));
        assertMatchFound(filter(" PYTHON ", " EXAMPLE   COLLEGE ", " computer   science "));
    }

    @Test
    void excludesCandidatesWhenAnyProvidedFilterDoesNotMatch() {
        assertNoMatch(filter("Rust", null, null));
        assertNoMatch(filter(null, null, "Mathematics"));
        assertNoMatch(filter(null, "Other College", null));
        assertNoMatch(filter("Python", "Example College", "Mathematics"));
    }

    private void assertMatchFound(MatchFilterRequest filter) {
        List<MatchedStudentResponse> results = matchService.computeMutualMatchesForStudent(currentStudent, filter);
        assertEquals(1, results.size());
        assertEquals(2L, results.get(0).getStudentId());
    }

    private void assertNoMatch(MatchFilterRequest filter) {
        assertTrue(matchService.computeMutualMatchesForStudent(currentStudent, filter).isEmpty());
    }

    private MatchFilterRequest filter(String skill, String college, String department) {
        MatchFilterRequest filter = new MatchFilterRequest();
        filter.setSkill(skill);
        filter.setCollege(college);
        filter.setDepartment(department);
        return filter;
    }

    private Student student(Long id, String name, String college, String department) {
        Student student = new Student();
        student.setId(id);
        student.setFullName(name);
        student.setCollegeName(college);
        student.setDepartment(department);
        student.setEmail(name.replace(' ', '.').toLowerCase() + "@example.com");
        student.setPassword("unused");
        student.setRole(UserRole.STUDENT);
        student.setAccountStatus(AccountStatus.ACTIVE);
        return student;
    }

    private StudentSkill studentSkill(String name, SkillType type) {
        Skill skill = new Skill();
        skill.setSkillName(name);
        StudentSkill studentSkill = new StudentSkill();
        studentSkill.setSkill(skill);
        studentSkill.setSkillType(type);
        return studentSkill;
    }
}
