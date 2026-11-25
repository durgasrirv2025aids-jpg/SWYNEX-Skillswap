package com.skillswap.controller;

import com.skillswap.dto.common.ApiResponse;
import com.skillswap.dto.notification.NotificationResponse;
import com.skillswap.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getMyNotifications() {
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved", notificationService.getMyNotifications()));
    }

    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getUnreadNotifications() {
        return ResponseEntity.ok(ApiResponse.success("Unread notifications retrieved", notificationService.getMyUnreadNotifications()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", notificationService.markAsRead(id)));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Integer>> markAllAsRead() {
        int count = notificationService.markAllAsRead();
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", count));
    }
}
