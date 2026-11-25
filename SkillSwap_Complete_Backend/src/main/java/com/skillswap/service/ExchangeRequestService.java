package com.skillswap.service;

import com.skillswap.dto.request.ExchangeRequestDTO;
import com.skillswap.dto.request.ExchangeRequestResponse;
import com.skillswap.entity.ExchangeRequest;
import com.skillswap.entity.Student;
import com.skillswap.entity.StudentSkill;
import com.skillswap.enums.AccountStatus;
import com.skillswap.enums.NotificationType;
import com.skillswap.enums.RequestStatus;
import com.skillswap.enums.SkillType;
import com.skillswap.exception.AccessDeniedException;
import com.skillswap.exception.BadRequestException;
import com.skillswap.exception.DuplicateResourceException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.repository.ConnectionRepository;
import com.skillswap.repository.ExchangeRequestRepository;
import com.skillswap.repository.StudentSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ExchangeRequestService {

    private final ExchangeRequestRepository exchangeRequestRepository;
    private final ConnectionRepository connectionRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final StudentService studentService;
    private final ConnectionService connectionService;
    private final NotificationService notificationService;
    private final AuthService authService;

    public ExchangeRequestService(
            ExchangeRequestRepository exchangeRequestRepository,
            ConnectionRepository connectionRepository,
            StudentSkillRepository studentSkillRepository,
            StudentService studentService,
            ConnectionService connectionService,
            NotificationService notificationService,
            AuthService authService
    ) {
        this.exchangeRequestRepository = exchangeRequestRepository;
        this.connectionRepository = connectionRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.studentService = studentService;
        this.connectionService = connectionService;
        this.notificationService = notificationService;
        this.authService = authService;
    }

    @Transactional
    public ExchangeRequestResponse sendRequest(ExchangeRequestDTO dto) {
        Student sender = authService.getAuthenticatedStudent();
        Student receiver = studentService.findEntityById(dto.getReceiverId());

        if (sender.getId().equals(receiver.getId())) {
            throw new BadRequestException("You cannot send an exchange request to yourself");
        }
        if (receiver.getAccountStatus() == AccountStatus.DISABLED) {
            throw new BadRequestException("Cannot send request to a disabled student account");
        }
        if (connectionRepository.existsConnectionBetweenStudents(sender.getId(), receiver.getId())) {
            throw new DuplicateResourceException("You are already connected with this student");
        }
        if (exchangeRequestRepository.existsBySenderIdAndReceiverIdAndStatus(
                sender.getId(), receiver.getId(), RequestStatus.PENDING)) {
            throw new DuplicateResourceException("A pending exchange request already exists to this student");
        }

        ExchangeRequest request = new ExchangeRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setMessage(dto.getMessage() != null ? dto.getMessage().trim() : "Let's swap skills!");
        request.setStatus(RequestStatus.PENDING);

        ExchangeRequest saved = exchangeRequestRepository.save(request);

        notificationService.createNotification(
                receiver,
                NotificationType.REQUEST_RECEIVED,
                "New Exchange Request",
                sender.getFullName() + " sent you a skill exchange request."
        );

        return toResponse(saved);
    }

    public List<ExchangeRequestResponse> getSentRequests() {
        Long myId = authService.getAuthenticatedStudentId();
        return exchangeRequestRepository.findBySenderIdOrderByCreatedAtDesc(myId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ExchangeRequestResponse> getReceivedRequests() {
        Long myId = authService.getAuthenticatedStudentId();
        return exchangeRequestRepository.findByReceiverIdOrderByCreatedAtDesc(myId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ExchangeRequestResponse getRequestById(Long requestId) {
        Long myId = authService.getAuthenticatedStudentId();
        ExchangeRequest req = findEntityById(requestId);
        if (!req.getSender().getId().equals(myId) && !req.getReceiver().getId().equals(myId)) {
            throw new AccessDeniedException("You are not authorized to view this exchange request");
        }
        return toResponse(req);
    }

    @Transactional
    public ExchangeRequestResponse acceptRequest(Long requestId) {
        Long myId = authService.getAuthenticatedStudentId();
        ExchangeRequest req = findEntityById(requestId);

        if (!req.getReceiver().getId().equals(myId)) {
            throw new AccessDeniedException("Only the receiver can accept this exchange request");
        }
        if (req.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Only PENDING requests can be accepted. Current status: " + req.getStatus());
        }

        validateReciprocalSkills(req.getSender().getId(), req.getReceiver().getId());

        req.setStatus(RequestStatus.ACCEPTED);
        ExchangeRequest updated = exchangeRequestRepository.save(req);

        connectionService.createConnectionBetween(req.getSender(), req.getReceiver());

        notificationService.createNotification(
                req.getSender(),
                NotificationType.REQUEST_ACCEPTED,
                "Exchange Request Accepted",
                req.getReceiver().getFullName() + " accepted your skill exchange request!"
        );

        return toResponse(updated);
    }

    @Transactional
    public ExchangeRequestResponse rejectRequest(Long requestId) {
        Long myId = authService.getAuthenticatedStudentId();
        ExchangeRequest req = findEntityById(requestId);

        if (!req.getReceiver().getId().equals(myId)) {
            throw new AccessDeniedException("Only the receiver can reject this exchange request");
        }
        if (req.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Only PENDING requests can be rejected. Current status: " + req.getStatus());
        }

        req.setStatus(RequestStatus.REJECTED);
        ExchangeRequest updated = exchangeRequestRepository.save(req);

        notificationService.createNotification(
                req.getSender(),
                NotificationType.REQUEST_REJECTED,
                "Exchange Request Declined",
                req.getReceiver().getFullName() + " declined your skill exchange request."
        );

        return toResponse(updated);
    }

    @Transactional
    public ExchangeRequestResponse cancelRequest(Long requestId) {
        Long myId = authService.getAuthenticatedStudentId();
        ExchangeRequest req = findEntityById(requestId);

        if (!req.getSender().getId().equals(myId)) {
            throw new AccessDeniedException("Only the sender can cancel this exchange request");
        }
        if (req.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Only PENDING requests can be cancelled. Current status: " + req.getStatus());
        }

        req.setStatus(RequestStatus.CANCELLED);
        ExchangeRequest updated = exchangeRequestRepository.save(req);

        notificationService.createNotification(
                req.getReceiver(),
                NotificationType.REQUEST_CANCELLED,
                "Exchange Request Cancelled",
                req.getSender().getFullName() + " cancelled their exchange request."
        );

        return toResponse(updated);
    }

    private void validateReciprocalSkills(Long senderId, Long receiverId) {
        Set<String> senderTeach = getSkillLowerSet(senderId, SkillType.TEACH);
        Set<String> senderLearn = getSkillLowerSet(senderId, SkillType.LEARN);
        Set<String> receiverTeach = getSkillLowerSet(receiverId, SkillType.TEACH);
        Set<String> receiverLearn = getSkillLowerSet(receiverId, SkillType.LEARN);

        boolean senderTeachesReceiverLearns = senderTeach.stream().anyMatch(receiverLearn::contains);
        boolean receiverTeachesSenderLearns = receiverTeach.stream().anyMatch(senderLearn::contains);

        if (!senderTeachesReceiverLearns || !receiverTeachesSenderLearns) {
            throw new BadRequestException("Reciprocal skill matching validation failed between both students");
        }
    }

    private Set<String> getSkillLowerSet(Long studentId, SkillType type) {
        return studentSkillRepository.findByStudentIdAndSkillType(studentId, type).stream()
                .map(StudentSkill::getSkill)
                .map(sk -> sk.getSkillName().trim().toLowerCase())
                .collect(Collectors.toSet());
    }

    public ExchangeRequest findEntityById(Long id) {
        return exchangeRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange request not found with ID: " + id));
    }

    public ExchangeRequestResponse toResponse(ExchangeRequest req) {
        ExchangeRequestResponse res = new ExchangeRequestResponse();
        res.setId(req.getId());
        res.setSenderId(req.getSender().getId());
        res.setSenderName(req.getSender().getFullName());
        res.setSenderDepartment(req.getSender().getDepartment());
        res.setReceiverId(req.getReceiver().getId());
        res.setReceiverName(req.getReceiver().getFullName());
        res.setReceiverDepartment(req.getReceiver().getDepartment());
        res.setMessage(req.getMessage());
        res.setStatus(req.getStatus());
        res.setCreatedAt(req.getCreatedAt());
        res.setUpdatedAt(req.getUpdatedAt());
        return res;
    }
}
