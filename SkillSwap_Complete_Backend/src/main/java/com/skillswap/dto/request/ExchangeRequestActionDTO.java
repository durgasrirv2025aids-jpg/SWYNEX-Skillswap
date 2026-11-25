package com.skillswap.dto.request;

import com.skillswap.enums.RequestStatus;
import jakarta.validation.constraints.NotNull;

public class ExchangeRequestActionDTO {

    @NotNull(message = "Action status is required")
    private RequestStatus status;

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }
}
