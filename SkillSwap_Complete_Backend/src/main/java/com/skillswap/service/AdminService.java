package com.skillswap.service;

import com.skillswap.dto.admin.AdminDashboardResponse;
import com.skillswap.dto.admin.AdminStudentResponse;
import com.skillswap.dto.connection.ConnectionResponse;
import com.skillswap.dto.request.ExchangeRequestResponse;
import com.skillswap.dto.skill.SkillResponse;
import com.skillswap.entity.Student;
import com.skillswap.enums.AccountStatus;
import com.skillswap.enums.NotificationType;
import com.skillswap.enums.RequestStatus;
import com.skillswap.enums.SkillType;
import com.skillswap.exception.BadRequestException;
import com.skillswap.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final StudentRepository studentRepository;
    private final SkillRepository skillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final ExchangeRequestRepository exchangeRequestRepository;
    private final ConnectionRepository connectionRepository;
    private final StudentService studentService;
    private final SkillService skillService;
    private final ExchangeRequestService exchangeRequestService;
    private final ConnectionService connectionService;
    private final NotificationService notificationService;

    public AdminService(
            StudentRepository studentRepository,
            SkillRepository skillRepository,
            StudentSkillRepository studentSkillRepository,
            ExchangeRequestRepository exchangeRequestRepository,
            ConnectionRepository connectionRepository,
            StudentService studentService,
            SkillService skillService,
            ExchangeRequestService exchangeRequestService,
            ConnectionService connectionService,
            NotificationService notificationService
    ) {
        this.studentRepository = studentRepository;
        this.skillRepository = skillRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.exchangeRequestRepository = exchangeRequestRepository;
        this.connectionRepository = connectionRepository;
        this.studentService = studentService;
        this.skillService = skillService;
        this.exchangeRequestService = exchangeRequestService;
        this.connectionService = connectionService;
        this.notificationService = notificationService;
    }

    public AdminDashboardResponse getDashboardStats() {
        AdminDashboardResponse stats = new AdminDashboardResponse();
        stats.setTotalStudents(studentRepository.count());
        stats.setActiveStudents(studentRepository.countByAccountStatus(AccountStatus.ACTIVE));
        stats.setDisabledStudents(studentRepository.countByAccountStatus(AccountStatus.DISABLED));
        stats.setTotalSkills(skillRepository.count());
        stats.setTotalTeachingSkills(studentSkillRepository.countBySkillType(SkillType.TEACH));
        stats.setTotalLearningSkills(studentSkillRepository.countBySkillType(SkillType.LEARN));
        stats.setTotalExchangeRequests(exchangeRequestRepository.count());
        stats.setPendingRequests(exchangeRequestRepository.countByStatus(RequestStatus.PENDING));
        stats.setAcceptedRequests(exchangeRequestRepository.countByStatus(RequestStatus.ACCEPTED));
        stats.setRejectedRequests(exchangeRequestRepository.countByStatus(RequestStatus.REJECTED));
        stats.setCancelledRequests(exchangeRequestRepository.countByStatus(RequestStatus.CANCELLED));
        stats.setTotalConnections(connectionRepository.count());
        return stats;
    }

    public List<AdminStudentResponse> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::toAdminStudentResponse)
                .toList();
    }

    public AdminStudentResponse getStudentDetails(Long studentId) {
        Student student = studentService.findEntityById(studentId);
        return toAdminStudentResponse(student);
    }

    @Transactional
    public AdminStudentResponse updateStudentStatus(Long studentId, AccountStatus newStatus) {
        if (newStatus == null) {
            throw new BadRequestException("Account status must not be null");
        }
        Student student = studentService.findEntityById(studentId);
        student.setAccountStatus(newStatus);
        Student saved = studentRepository.save(student);

        notificationService.createNotification(
                saved,
                NotificationType.ACCOUNT_STATUS_UPDATED,
                "Account Status Updated",
                "Your SkillSwap account status is now set to " + newStatus.name()
        );

        return toAdminStudentResponse(saved);
    }

    public List<SkillResponse> getAllSkills() {
        return skillRepository.findAll().stream()
                .map(skillService::toResponse)
                .toList();
    }

    public List<ExchangeRequestResponse> getAllExchangeRequests() {
        return exchangeRequestRepository.findAll().stream()
                .map(exchangeRequestService::toResponse)
                .toList();
    }

    public List<ConnectionResponse> getAllConnections() {
        return connectionRepository.findAll().stream()
                .map(conn -> connectionService.toResponse(conn, conn.getStudentOne().getId()))
                .toList();
    }

    private AdminStudentResponse toAdminStudentResponse(Student s) {
        AdminStudentResponse res = new AdminStudentResponse();
        res.setId(s.getId());
        res.setFullName(s.getFullName());
        res.setEmail(s.getEmail());
        res.setCollegeName(s.getCollegeName());
        res.setDepartment(s.getDepartment());
        res.setYearOfStudy(s.getYearOfStudy());
        res.setAccountStatus(s.getAccountStatus());
        res.setRole(s.getRole());
        res.setSkillCount(studentSkillRepository.findByStudentId(s.getId()).size());
        res.setConnectionCount(connectionRepository.findAllByStudentId(s.getId()).size());
        res.setCreatedAt(s.getCreatedAt());
        return res;
    }
}
