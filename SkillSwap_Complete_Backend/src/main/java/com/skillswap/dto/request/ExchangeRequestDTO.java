package com.skillswap.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ExchangeRequestDTO {

    @NotNull(message = "Receiver ID is required")
    private Long receiverId;

    @Size(max = 600, message = "Message must be at most 600 characters")
    private String message;

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
