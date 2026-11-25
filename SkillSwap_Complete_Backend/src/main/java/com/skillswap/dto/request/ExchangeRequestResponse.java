package com.skillswap.dto.request;

import com.skillswap.enums.RequestStatus;
import java.time.LocalDateTime;

public class ExchangeRequestResponse {

    private Long id;
    private Long senderId;
    private String senderName;
    private String senderDepartment;
    private Long receiverId;
    private String receiverName;
    private String receiverDepartment;
    private String message;
    private RequestStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getSenderDepartment() { return senderDepartment; }
    public void setSenderDepartment(String senderDepartment) { this.senderDepartment = senderDepartment; }

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }

    public String getReceiverDepartment() { return receiverDepartment; }
    public void setReceiverDepartment(String receiverDepartment) { this.receiverDepartment = receiverDepartment; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
