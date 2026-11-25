package com.skillswap.service;

import com.skillswap.dto.connection.ConnectionResponse;
import com.skillswap.entity.Connection;
import com.skillswap.entity.Student;
import com.skillswap.entity.StudentSkill;
import com.skillswap.enums.NotificationType;
import com.skillswap.enums.SkillType;
import com.skillswap.exception.AccessDeniedException;
import com.skillswap.exception.BadRequestException;
import com.skillswap.exception.DuplicateResourceException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.repository.ConnectionRepository;
import com.skillswap.repository.StudentSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final NotificationService notificationService;
    private final AuthService authService;

    public ConnectionService(
            ConnectionRepository connectionRepository,
            StudentSkillRepository studentSkillRepository,
            NotificationService notificationService,
            AuthService authService
    ) {
        this.connectionRepository = connectionRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.notificationService = notificationService;
        this.authService = authService;
    }

    @Transactional
    public Connection createConnectionBetween(Student studentOne, Student studentTwo) {
        if (studentOne.getId().equals(studentTwo.getId())) {
            throw new BadRequestException("Cannot create connection with the same student");
        }
        if (connectionRepository.existsConnectionBetweenStudents(studentOne.getId(), studentTwo.getId())) {
            throw new DuplicateResourceException("Connection already exists between these two students");
        }

        String summary = buildExchangedSkillsSummary(studentOne.getId(), studentTwo.getId());
        Connection connection = new Connection();
        connection.setStudentOne(studentOne);
        connection.setStudentTwo(studentTwo);
        connection.setExchangedSkillsSummary(summary);
        Connection saved = connectionRepository.save(connection);

        notificationService.createNotification(
                studentOne,
                NotificationType.CONNECTION_CREATED,
                "New SkillSwap Connection",
                "You are now connected with " + studentTwo.getFullName() + " (" + summary + ")"
        );
        notificationService.createNotification(
                studentTwo,
                NotificationType.CONNECTION_CREATED,
                "New SkillSwap Connection",
                "You are now connected with " + studentOne.getFullName() + " (" + summary + ")"
        );

        return saved;
    }

    public List<ConnectionResponse> getMyConnections() {
        Long myId = authService.getAuthenticatedStudentId();
        return connectionRepository.findAllByStudentId(myId).stream()
                .map(conn -> toResponse(conn, myId))
                .toList();
    }

    public ConnectionResponse getConnectionById(Long connectionId) {
        Long myId = authService.getAuthenticatedStudentId();
        Connection conn = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Connection not found with ID: " + connectionId));

        boolean isMember = conn.getStudentOne().getId().equals(myId) || conn.getStudentTwo().getId().equals(myId);
        if (!isMember) {
            throw new AccessDeniedException("You are not a member of this connection");
        }
        return toResponse(conn, myId);
    }

    @Transactional
    public void removeConnection(Long connectionId) {
        Long myId = authService.getAuthenticatedStudentId();
        Connection conn = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Connection not found with ID: " + connectionId));

        boolean isMember = conn.getStudentOne().getId().equals(myId) || conn.getStudentTwo().getId().equals(myId);
        if (!isMember) {
            throw new AccessDeniedException("You can only remove your own connections");
        }
        connectionRepository.delete(conn);
    }

    private String buildExchangedSkillsSummary(Long idA, Long idB) {
        Set<String> aTeach = getSkillNames(idA, SkillType.TEACH);
        Set<String> aLearn = getSkillNames(idA, SkillType.LEARN);
        Set<String> bTeach = getSkillNames(idB, SkillType.TEACH);
        Set<String> bLearn = getSkillNames(idB, SkillType.LEARN);

        List<String> aToB = aTeach.stream().filter(s -> bLearn.contains(s.toLowerCase())).toList();
        List<String> bToA = bTeach.stream().filter(s -> aLearn.contains(s.toLowerCase())).toList();

        return "Student A -> B: " + aToB + " | Student B -> A: " + bToA;
    }

    private Set<String> getSkillNames(Long studentId, SkillType type) {
        return studentSkillRepository.findByStudentIdAndSkillType(studentId, type).stream()
                .map(StudentSkill::getSkill)
                .map(sk -> sk.getSkillName().trim())
                .collect(Collectors.toSet());
    }

    public ConnectionResponse toResponse(Connection conn, Long currentStudentId) {
        Student partner = conn.getStudentOne().getId().equals(currentStudentId)
                ? conn.getStudentTwo()
                : conn.getStudentOne();

        ConnectionResponse res = new ConnectionResponse();
        res.setConnectionId(conn.getId());
        res.setPartnerId(partner.getId());
        res.setPartnerName(partner.getFullName());
        res.setPartnerEmail(partner.getEmail());
        res.setPartnerCollege(partner.getCollegeName());
        res.setPartnerDepartment(partner.getDepartment());
        res.setPartnerYearOfStudy(partner.getYearOfStudy());
        res.setPartnerBio(partner.getBio());
        res.setExchangedSkillsSummary(conn.getExchangedSkillsSummary());
        res.setConnectedAt(conn.getConnectedAt());
        return res;
    }
}
