package com.skillswap.service;

import com.skillswap.dto.notification.NotificationResponse;
import com.skillswap.entity.Notification;
import com.skillswap.entity.Student;
import com.skillswap.enums.NotificationType;
import com.skillswap.exception.AccessDeniedException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final AuthService authService;

    public NotificationService(NotificationRepository notificationRepository, AuthService authService) {
        this.notificationRepository = notificationRepository;
        this.authService = authService;
    }

    @Transactional
    public void createNotification(Student recipient, NotificationType type, String title, String message) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRead(false);
        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getMyNotifications() {
        Long myId = authService.getAuthenticatedStudentId();
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(myId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<NotificationResponse> getMyUnreadNotifications() {
        Long myId = authService.getAuthenticatedStudentId();
        return notificationRepository.findByRecipientIdAndReadFalseOrderByCreatedAtDesc(myId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public NotificationResponse markAsRead(Long notificationId) {
        Long myId = authService.getAuthenticatedStudentId();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with ID: " + notificationId));

        if (!notification.getRecipient().getId().equals(myId)) {
            throw new AccessDeniedException("You cannot modify another student's notification");
        }

        notification.setRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public int markAllAsRead() {
        Long myId = authService.getAuthenticatedStudentId();
        List<Notification> unread = notificationRepository.findByRecipientIdAndReadFalseOrderByCreatedAtDesc(myId);
        for (Notification n : unread) {
            n.setRead(true);
        }
        notificationRepository.saveAll(unread);
        return unread.size();
    }

    public NotificationResponse toResponse(Notification n) {
        NotificationResponse res = new NotificationResponse();
        res.setId(n.getId());
        res.setRecipientId(n.getRecipient().getId());
        res.setType(n.getType());
        res.setTitle(n.getTitle());
        res.setMessage(n.getMessage());
        res.setRead(n.isRead());
        res.setCreatedAt(n.getCreatedAt());
        return res;
    }
}
