package com.skillswap.controller;

import com.skillswap.dto.common.ApiResponse;
import com.skillswap.dto.connection.ConnectionResponse;
import com.skillswap.service.ConnectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    private final ConnectionService connectionService;

    public ConnectionController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ConnectionResponse>>> getMyConnections() {
        return ResponseEntity.ok(ApiResponse.success("Connections retrieved", connectionService.getMyConnections()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ConnectionResponse>> getConnectionById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Connection details retrieved", connectionService.getConnectionById(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> removeConnection(@PathVariable Long id) {
        connectionService.removeConnection(id);
        return ResponseEntity.ok(ApiResponse.success("Connection removed successfully", null));
    }
}
