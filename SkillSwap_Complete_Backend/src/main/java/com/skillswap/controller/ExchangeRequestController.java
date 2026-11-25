package com.skillswap.controller;

import com.skillswap.dto.common.ApiResponse;
import com.skillswap.dto.request.ExchangeRequestDTO;
import com.skillswap.dto.request.ExchangeRequestResponse;
import com.skillswap.service.ExchangeRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class ExchangeRequestController {

    private final ExchangeRequestService exchangeRequestService;

    public ExchangeRequestController(ExchangeRequestService exchangeRequestService) {
        this.exchangeRequestService = exchangeRequestService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ExchangeRequestResponse>> sendRequest(@Valid @RequestBody ExchangeRequestDTO dto) {
        ExchangeRequestResponse created = exchangeRequestService.sendRequest(dto);
        return new ResponseEntity<>(ApiResponse.success("Exchange request sent successfully", created), HttpStatus.CREATED);
    }

    @GetMapping("/sent")
    public ResponseEntity<ApiResponse<List<ExchangeRequestResponse>>> getSentRequests() {
        return ResponseEntity.ok(ApiResponse.success("Sent requests retrieved", exchangeRequestService.getSentRequests()));
    }

    @GetMapping("/received")
    public ResponseEntity<ApiResponse<List<ExchangeRequestResponse>>> getReceivedRequests() {
        return ResponseEntity.ok(ApiResponse.success("Received requests retrieved", exchangeRequestService.getReceivedRequests()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExchangeRequestResponse>> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Exchange request retrieved", exchangeRequestService.getRequestById(id)));
    }

    @PatchMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<ExchangeRequestResponse>> acceptRequest(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Exchange request accepted", exchangeRequestService.acceptRequest(id)));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<ExchangeRequestResponse>> rejectRequest(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Exchange request rejected", exchangeRequestService.rejectRequest(id)));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<ExchangeRequestResponse>> cancelRequest(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Exchange request cancelled", exchangeRequestService.cancelRequest(id)));
    }
}
