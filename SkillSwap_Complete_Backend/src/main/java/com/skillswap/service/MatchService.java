package com.skillswap.service;

import com.skillswap.dto.match.MatchFilterRequest;
import com.skillswap.dto.match.MatchResponse;
import com.skillswap.dto.match.MatchedStudentResponse;
import com.skillswap.entity.Student;
import com.skillswap.entity.StudentSkill;
import com.skillswap.enums.AccountStatus;
import com.skillswap.enums.SkillType;
import com.skillswap.enums.UserRole;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.repository.ConnectionRepository;
import com.skillswap.repository.StudentRepository;
import com.skillswap.repository.StudentSkillRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchService {

    private final StudentRepository studentRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final ConnectionRepository connectionRepository;
    private final AuthService authService;

    public MatchService(
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

    public MatchResponse findMyMatches(MatchFilterRequest filter) {
        Student me = authService.getAuthenticatedStudent();
        List<MatchedStudentResponse> matches = computeMutualMatchesForStudent(me, filter);
        return new MatchResponse(me.getId(), matches.size(), matches);
    }

    public MatchedStudentResponse getMatchDetailsWithStudent(Long targetStudentId) {
        Student me = authService.getAuthenticatedStudent();
        Student target = studentRepository.findById(targetStudentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + targetStudentId));

        return buildMatchDto(me, target, new MatchFilterRequest())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No mutual skill match found between you and student ID: " + targetStudentId
                ));
    }

    public List<MatchedStudentResponse> computeMutualMatchesForStudent(Student currentStudent, MatchFilterRequest filter) {
        Set<Long> seenIds = new HashSet<>();
        List<MatchedStudentResponse> results = new ArrayList<>();

        for (Student candidate : studentRepository.findAll()) {
            if (candidate.getId().equals(currentStudent.getId())) {
                continue;
            }
            if (candidate.getRole() != UserRole.STUDENT || candidate.getAccountStatus() == AccountStatus.DISABLED) {
                continue;
            }
            if (seenIds.contains(candidate.getId())) {
                continue;
            }
            if (connectionRepository.existsConnectionBetweenStudents(currentStudent.getId(), candidate.getId())) {
                continue;
            }
            if (!matchesFilters(candidate, filter)) {
                continue;
            }

            buildMatchDto(currentStudent, candidate, filter).ifPresent(dto -> {
                seenIds.add(candidate.getId());
                results.add(dto);
            });
        }

        return results;
    }

    private Optional<MatchedStudentResponse> buildMatchDto(Student currentStudent, Student candidate, MatchFilterRequest filter) {
        Map<String, String> myTeachMap = getSkillMap(currentStudent.getId(), SkillType.TEACH);
        Map<String, String> myLearnMap = getSkillMap(currentStudent.getId(), SkillType.LEARN);

        Map<String, String> theirTeachMap = getSkillMap(candidate.getId(), SkillType.TEACH);
        Map<String, String> theirLearnMap = getSkillMap(candidate.getId(), SkillType.LEARN);

        // A's teaching skill must match B's learning skill
        List<String> iTeachTheyLearn = myTeachMap.entrySet().stream()
                .filter(e -> theirLearnMap.containsKey(e.getKey()))
                .map(Map.Entry::getValue)
                .sorted()
                .toList();

        // A's learning skill must match B's teaching skill
        List<String> theyTeachILearn = myLearnMap.entrySet().stream()
                .filter(e -> theirTeachMap.containsKey(e.getKey()))
                .map(Map.Entry::getValue)
                .sorted()
                .toList();

        // Both conditions must be satisfied for mutual skill exchange
        if (iTeachTheyLearn.isEmpty() || theyTeachILearn.isEmpty()) {
            return Optional.empty();
        }

        if (filter != null && filter.getSkill() != null && !filter.getSkill().isBlank()) {
            String querySkill = filter.getSkill().trim().toLowerCase();
            boolean skillMatched = iTeachTheyLearn.stream().anyMatch(s -> s.toLowerCase().contains(querySkill))
                    || theyTeachILearn.stream().anyMatch(s -> s.toLowerCase().contains(querySkill));
            if (!skillMatched) {
                return Optional.empty();
            }
        }

        MatchedStudentResponse dto = new MatchedStudentResponse();
        dto.setStudentId(candidate.getId());
        dto.setFullName(candidate.getFullName());
        dto.setEmail(candidate.getEmail());
        dto.setCollegeName(candidate.getCollegeName());
        dto.setDepartment(candidate.getDepartment());
        dto.setYearOfStudy(candidate.getYearOfStudy());
        dto.setBio(candidate.getBio());
        dto.setSkillsYouTeachTheyLearn(iTeachTheyLearn);
        dto.setSkillsTheyTeachYouLearn(theyTeachILearn);
        dto.setMutualMatch(true);
        return Optional.of(dto);
    }

    private Map<String, String> getSkillMap(Long studentId, SkillType type) {
        return studentSkillRepository.findByStudentIdAndSkillType(studentId, type).stream()
                .map(StudentSkill::getSkill)
                .filter(Objects::nonNull)
                .collect(Collectors.toMap(
                        sk -> sk.getSkillName().trim().toLowerCase(),
                        sk -> sk.getSkillName(),
                        (first, second) -> first
                ));
    }

    private boolean matchesFilters(Student candidate, MatchFilterRequest filter) {
        if (filter == null) {
            return true;
        }
        if (filter.getCollege() != null && !filter.getCollege().isBlank()) {
            if (candidate.getCollegeName() == null ||
                    !candidate.getCollegeName().toLowerCase().contains(filter.getCollege().trim().toLowerCase())) {
                return false;
            }
        }
        if (filter.getDepartment() != null && !filter.getDepartment().isBlank()) {
            if (candidate.getDepartment() == null ||
                    !candidate.getDepartment().toLowerCase().contains(filter.getDepartment().trim().toLowerCase())) {
                return false;
            }
        }
        return true;
    }
}
