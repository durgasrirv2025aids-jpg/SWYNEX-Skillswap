package com.skillswap.service;

import com.skillswap.dto.auth.LoginRequest;
import com.skillswap.dto.auth.LoginResponse;
import com.skillswap.dto.auth.RegisterRequest;
import com.skillswap.dto.auth.StudentRegistrationResponse;
import com.skillswap.dto.match.MatchFilterRequest;
import com.skillswap.dto.match.MatchResponse;
import com.skillswap.dto.request.ExchangeRequestDTO;
import com.skillswap.dto.request.ExchangeRequestResponse;
import com.skillswap.dto.skill.StudentSkillRequest;
import com.skillswap.dto.skill.StudentSkillResponse;
import com.skillswap.dto.student.StudentResponse;
import com.skillswap.dto.student.StudentUpdateRequest;
import com.skillswap.entity.*;
import com.skillswap.enums.*;
import com.skillswap.exception.*;
import com.skillswap.repository.*;
import com.skillswap.security.CustomUserDetails;
import com.skillswap.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SkillSwapServiceTests {

    @Mock private StudentRepository studentRepository;
    @Mock private SkillRepository skillRepository;
    @Mock private StudentSkillRepository studentSkillRepository;
    @Mock private ExchangeRequestRepository exchangeRequestRepository;
    @Mock private ConnectionRepository connectionRepository;
    @Mock private NotificationRepository notificationRepository;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtService jwtService;

    private PasswordEncoder passwordEncoder;
    private AuthService authService;
    private StudentService studentService;
    private SkillService skillService;
    private StudentSkillService studentSkillService;
    private MatchService matchService;
    private NotificationService notificationService;
    private ConnectionService connectionService;
    private ExchangeRequestService exchangeRequestService;
    private AdminService adminService;

    private Student studentA;
    private Student studentB;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        authService = new AuthService(studentRepository, passwordEncoder, authenticationManager, jwtService);
        studentService = new StudentService(studentRepository, studentSkillRepository, connectionRepository, authService);
        skillService = new SkillService(skillRepository);
        studentSkillService = new StudentSkillService(studentSkillRepository, studentService, skillService, authService);
        matchService = new MatchService(studentRepository, studentSkillRepository, connectionRepository, authService);
        notificationService = new NotificationService(notificationRepository, authService);
        connectionService = new ConnectionService(connectionRepository, studentSkillRepository, notificationService, authService);
        exchangeRequestService = new ExchangeRequestService(
                exchangeRequestRepository,
                connectionRepository,
                studentSkillRepository,
                studentService,
                connectionService,
                notificationService,
                authService
        );
        adminService = new AdminService(
                studentRepository,
                skillRepository,
                studentSkillRepository,
                exchangeRequestRepository,
                connectionRepository,
                studentService,
                skillService,
                exchangeRequestService,
                connectionService,
                notificationService
        );

        studentA = new Student();
        studentA.setId(1L);
        studentA.setFullName("Karthik Kumar");
        studentA.setEmail("karthik@skillswap.edu");
        studentA.setPassword(passwordEncoder.encode("Password123"));
        studentA.setCollegeName("PSG Tech");
        studentA.setDepartment("CSE");
        studentA.setYearOfStudy(3);
        studentA.setBio("Java backend enthusiast");
        studentA.setRole(UserRole.STUDENT);
        studentA.setAccountStatus(AccountStatus.ACTIVE);
        studentA.setCreatedAt(LocalDateTime.now());
        studentA.setUpdatedAt(LocalDateTime.now());

        studentB = new Student();
        studentB.setId(2L);
        studentB.setFullName("Divya Nair");
        studentB.setEmail("divya@skillswap.edu");
        studentB.setPassword(passwordEncoder.encode("Password123"));
        studentB.setCollegeName("PSG Tech");
        studentB.setDepartment("IT");
        studentB.setYearOfStudy(3);
        studentB.setBio("Python & ML learner");
        studentB.setRole(UserRole.STUDENT);
        studentB.setAccountStatus(AccountStatus.ACTIVE);
        studentB.setCreatedAt(LocalDateTime.now());
        studentB.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void register_success_encryptsPassword() {
        RegisterRequest req = new RegisterRequest();
        req.setFullName("Karthik Kumar");
        req.setEmail("karthik@skillswap.edu");
        req.setPassword("Password123");
        req.setCollegeName("PSG Tech");
        req.setDepartment("CSE");
        req.setYearOfStudy(3);

        when(studentRepository.existsByEmailIgnoreCase("karthik@skillswap.edu")).thenReturn(false);
        when(studentRepository.save(any(Student.class))).thenAnswer(inv -> {
            Student s = inv.getArgument(0);
            s.setId(1L);
            s.setCreatedAt(LocalDateTime.now());
            return s;
        });

        StudentRegistrationResponse res = authService.register(req);
        assertEquals(1L, res.getStudentId());
        assertEquals("karthik@skillswap.edu", res.getEmail());
        assertEquals(UserRole.STUDENT, res.getRole());
        verify(studentRepository).save(argThat(s ->
                !s.getPassword().equals("Password123") && passwordEncoder.matches("Password123", s.getPassword())
        ));
    }

    @Test
    void register_duplicateEmail_throwsDuplicateResourceException() {
        RegisterRequest req = new RegisterRequest();
        req.setFullName("Karthik");
        req.setEmail("karthik@skillswap.edu");
        req.setPassword("Password123");

        when(studentRepository.existsByEmailIgnoreCase("karthik@skillswap.edu")).thenReturn(true);
        assertThrows(DuplicateResourceException.class, () -> authService.register(req));
    }

    @Test
    void login_success_returnsJwtToken() {
        LoginRequest req = new LoginRequest();
        req.setEmail("karthik@skillswap.edu");
        req.setPassword("Password123");

        CustomUserDetails userDetails = new CustomUserDetails(studentA);
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(userDetails);
        when(studentRepository.findByEmailIgnoreCase("karthik@skillswap.edu")).thenReturn(Optional.of(studentA));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(jwtService.generateToken(userDetails)).thenReturn("mock.jwt.token");
        when(jwtService.getExpirationMs()).thenReturn(86400000L);

        LoginResponse res = authService.login(req);
        assertEquals("mock.jwt.token", res.getToken());
        assertEquals("karthik@skillswap.edu", res.getEmail());
    }

    @Test
    void updateProfile_updatesFields() {
        when(studentRepository.findByEmailIgnoreCase(any())).thenReturn(Optional.of(studentA));
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(new CustomUserDetails(studentA), null, new CustomUserDetails(studentA).getAuthorities())
        );

        StudentUpdateRequest update = new StudentUpdateRequest();
        update.setBio("Updated bio");
        update.setDepartment("AI & DS");
        when(studentRepository.save(any(Student.class))).thenReturn(studentA);

        StudentResponse res = studentService.updateMyProfile(update);
        assertEquals("Updated bio", res.getBio());
        assertEquals("AI & DS", res.getDepartment());
        org.springframework.security.core.context.SecurityContextHolder.clearContext();
    }

    @Test
    void addStudentSkill_andPreventDuplicate() {
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(new CustomUserDetails(studentA), null, new CustomUserDetails(studentA).getAuthorities())
        );
        when(studentRepository.findByEmailIgnoreCase(studentA.getEmail())).thenReturn(Optional.of(studentA));

        Skill javaSkill = new Skill();
        javaSkill.setId(10L);
        javaSkill.setSkillName("Java");
        javaSkill.setCategory("Programming");

        when(skillRepository.findBySkillNameIgnoreCase("Java")).thenReturn(Optional.of(javaSkill));
        when(studentSkillRepository.existsByStudentIdAndSkillIdAndSkillType(1L, 10L, SkillType.TEACH)).thenReturn(false);
        when(studentSkillRepository.save(any(StudentSkill.class))).thenAnswer(inv -> {
            StudentSkill ss = inv.getArgument(0);
            ss.setId(100L);
            return ss;
        });

        StudentSkillRequest req = new StudentSkillRequest();
        req.setSkillName("Java");
        req.setSkillType(SkillType.TEACH);
        StudentSkillResponse res = studentSkillService.addStudentSkill(req);
        assertEquals("Java", res.getSkillName());
        assertEquals(SkillType.TEACH, res.getSkillType());

        when(studentSkillRepository.existsByStudentIdAndSkillIdAndSkillType(1L, 10L, SkillType.TEACH)).thenReturn(true);
        assertThrows(DuplicateResourceException.class, () -> studentSkillService.addStudentSkill(req));
        org.springframework.security.core.context.SecurityContextHolder.clearContext();
    }

    @Test
    void findMatches_mutualMatchAndNoMatch() {
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(new CustomUserDetails(studentA), null, new CustomUserDetails(studentA).getAuthorities())
        );
        when(studentRepository.findByEmailIgnoreCase(studentA.getEmail())).thenReturn(Optional.of(studentA));
        when(studentRepository.findAll()).thenReturn(List.of(studentA, studentB));
        when(connectionRepository.existsConnectionBetweenStudents(1L, 2L)).thenReturn(false);

        Skill javaSkill = new Skill(); javaSkill.setId(1L); javaSkill.setSkillName("Java");
        Skill pythonSkill = new Skill(); pythonSkill.setId(2L); pythonSkill.setSkillName("Python");

        StudentSkill aTeachJava = new StudentSkill(); aTeachJava.setSkill(javaSkill); aTeachJava.setSkillType(SkillType.TEACH);
        StudentSkill aLearnPython = new StudentSkill(); aLearnPython.setSkill(pythonSkill); aLearnPython.setSkillType(SkillType.LEARN);

        StudentSkill bTeachPython = new StudentSkill(); bTeachPython.setSkill(pythonSkill); bTeachPython.setSkillType(SkillType.TEACH);
        StudentSkill bLearnJava = new StudentSkill(); bLearnJava.setSkill(javaSkill); bLearnJava.setSkillType(SkillType.LEARN);

        when(studentSkillRepository.findByStudentIdAndSkillType(1L, SkillType.TEACH)).thenReturn(List.of(aTeachJava));
        when(studentSkillRepository.findByStudentIdAndSkillType(1L, SkillType.LEARN)).thenReturn(List.of(aLearnPython));
        when(studentSkillRepository.findByStudentIdAndSkillType(2L, SkillType.TEACH)).thenReturn(List.of(bTeachPython));
        when(studentSkillRepository.findByStudentIdAndSkillType(2L, SkillType.LEARN)).thenReturn(List.of(bLearnJava));

        MatchResponse matchResponse = matchService.findMyMatches(new MatchFilterRequest());
        assertEquals(1, matchResponse.getTotalMatches());
        assertTrue(matchResponse.getMatches().get(0).isMutualMatch());
        assertEquals(2L, matchResponse.getMatches().get(0).getStudentId());

        // No match case
        when(studentSkillRepository.findByStudentIdAndSkillType(2L, SkillType.TEACH)).thenReturn(List.of());
        MatchResponse emptyMatch = matchService.findMyMatches(new MatchFilterRequest());
        assertEquals(0, emptyMatch.getTotalMatches());

        org.springframework.security.core.context.SecurityContextHolder.clearContext();
    }

    @Test
    void exchangeRequest_sendAcceptRejectCancelAndConnectionCreation() {
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(new CustomUserDetails(studentA), null, new CustomUserDetails(studentA).getAuthorities())
        );
        when(studentRepository.findByEmailIgnoreCase(studentA.getEmail())).thenReturn(Optional.of(studentA));
        when(studentRepository.findById(2L)).thenReturn(Optional.of(studentB));
        when(connectionRepository.existsConnectionBetweenStudents(1L, 2L)).thenReturn(false);
        when(exchangeRequestRepository.existsBySenderIdAndReceiverIdAndStatus(1L, 2L, RequestStatus.PENDING)).thenReturn(false);
        when(exchangeRequestRepository.save(any(ExchangeRequest.class))).thenAnswer(inv -> {
            ExchangeRequest er = inv.getArgument(0);
            if (er.getId() == null) er.setId(50L);
            return er;
        });

        ExchangeRequestDTO dto = new ExchangeRequestDTO();
        dto.setReceiverId(2L);
        dto.setMessage("Swap Java & Python!");

        ExchangeRequestResponse sent = exchangeRequestService.sendRequest(dto);
        assertEquals(RequestStatus.PENDING, sent.getStatus());
        verify(notificationRepository, times(1)).save(any(Notification.class));

        // Cancel pending request by sender
        ExchangeRequest pendingEntity = new ExchangeRequest();
        pendingEntity.setId(50L);
        pendingEntity.setSender(studentA);
        pendingEntity.setReceiver(studentB);
        pendingEntity.setStatus(RequestStatus.PENDING);
        when(exchangeRequestRepository.findById(50L)).thenReturn(Optional.of(pendingEntity));

        ExchangeRequestResponse cancelled = exchangeRequestService.cancelRequest(50L);
        assertEquals(RequestStatus.CANCELLED, cancelled.getStatus());

        // Switch auth to Student B (receiver) and accept
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(new CustomUserDetails(studentB), null, new CustomUserDetails(studentB).getAuthorities())
        );
        when(studentRepository.findByEmailIgnoreCase(studentB.getEmail())).thenReturn(Optional.of(studentB));

        ExchangeRequest freshPending = new ExchangeRequest();
        freshPending.setId(51L);
        freshPending.setSender(studentA);
        freshPending.setReceiver(studentB);
        freshPending.setStatus(RequestStatus.PENDING);
        when(exchangeRequestRepository.findById(51L)).thenReturn(Optional.of(freshPending));

        Skill javaSkill = new Skill(); javaSkill.setId(1L); javaSkill.setSkillName("Java");
        Skill pythonSkill = new Skill(); pythonSkill.setId(2L); pythonSkill.setSkillName("Python");
        StudentSkill aTeachJava = new StudentSkill(); aTeachJava.setSkill(javaSkill);
        StudentSkill aLearnPython = new StudentSkill(); aLearnPython.setSkill(pythonSkill);
        StudentSkill bTeachPython = new StudentSkill(); bTeachPython.setSkill(pythonSkill);
        StudentSkill bLearnJava = new StudentSkill(); bLearnJava.setSkill(javaSkill);

        when(studentSkillRepository.findByStudentIdAndSkillType(1L, SkillType.TEACH)).thenReturn(List.of(aTeachJava));
        when(studentSkillRepository.findByStudentIdAndSkillType(1L, SkillType.LEARN)).thenReturn(List.of(aLearnPython));
        when(studentSkillRepository.findByStudentIdAndSkillType(2L, SkillType.TEACH)).thenReturn(List.of(bTeachPython));
        when(studentSkillRepository.findByStudentIdAndSkillType(2L, SkillType.LEARN)).thenReturn(List.of(bLearnJava));
        when(connectionRepository.save(any(Connection.class))).thenAnswer(inv -> {
            Connection c = inv.getArgument(0);
            c.setId(90L);
            return c;
        });

        ExchangeRequestResponse accepted = exchangeRequestService.acceptRequest(51L);
        assertEquals(RequestStatus.ACCEPTED, accepted.getStatus());
        verify(connectionRepository, times(1)).save(any(Connection.class));

        // Duplicate connection prevention
        when(connectionRepository.existsConnectionBetweenStudents(1L, 2L)).thenReturn(true);
        assertThrows(DuplicateResourceException.class, () -> connectionService.createConnectionBetween(studentA, studentB));

        org.springframework.security.core.context.SecurityContextHolder.clearContext();
    }

    @Test
    void adminDashboard_returnsCounts() {
        when(studentRepository.count()).thenReturn(10L);
        when(studentRepository.countByAccountStatus(AccountStatus.ACTIVE)).thenReturn(9L);
        when(studentRepository.countByAccountStatus(AccountStatus.DISABLED)).thenReturn(1L);
        when(skillRepository.count()).thenReturn(20L);
        when(studentSkillRepository.countBySkillType(SkillType.TEACH)).thenReturn(15L);
        when(studentSkillRepository.countBySkillType(SkillType.LEARN)).thenReturn(18L);
        when(exchangeRequestRepository.count()).thenReturn(5L);
        when(exchangeRequestRepository.countByStatus(RequestStatus.PENDING)).thenReturn(2L);
        when(exchangeRequestRepository.countByStatus(RequestStatus.ACCEPTED)).thenReturn(2L);
        when(exchangeRequestRepository.countByStatus(RequestStatus.REJECTED)).thenReturn(1L);
        when(exchangeRequestRepository.countByStatus(RequestStatus.CANCELLED)).thenReturn(0L);
        when(connectionRepository.count()).thenReturn(2L);

        var stats = adminService.getDashboardStats();
        assertEquals(10L, stats.getTotalStudents());
        assertEquals(20L, stats.getTotalSkills());
        assertEquals(2L, stats.getTotalConnections());
    }
}
