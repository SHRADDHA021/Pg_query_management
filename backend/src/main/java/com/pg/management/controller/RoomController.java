package com.pg.management.controller;

import com.pg.management.dto.ApiResponse;
import com.pg.management.dto.RoomDto;
import com.pg.management.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@Tag(name = "Rooms", description = "Room management endpoints")
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    @Operation(summary = "Get all rooms")
    public ResponseEntity<ApiResponse<List<RoomDto>>> getAllRooms() {
        return ResponseEntity.ok(ApiResponse.success("All rooms", roomService.getAllRooms()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get room by ID")
    public ResponseEntity<ApiResponse<RoomDto>> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Room details", roomService.getRoomById(id)));
    }

    @GetMapping("/available")
    @Operation(summary = "Get all available (not full) rooms")
    public ResponseEntity<ApiResponse<List<RoomDto>>> getAvailableRooms() {
        return ResponseEntity.ok(ApiResponse.success("Available rooms", roomService.getAvailableRooms()));
    }

    @GetMapping("/vacant")
    @Operation(summary = "Get vacant rooms")
    public ResponseEntity<ApiResponse<List<RoomDto>>> getVacantRooms() {
        return ResponseEntity.ok(ApiResponse.success("Vacant rooms", roomService.getVacantRooms()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new room (Admin only)")
    public ResponseEntity<ApiResponse<RoomDto>> createRoom(@RequestBody RoomDto request) {
        return ResponseEntity.ok(ApiResponse.success("Room created successfully", roomService.createRoom(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update room details (Admin only)")
    public ResponseEntity<ApiResponse<RoomDto>> updateRoom(@PathVariable Long id, @RequestBody RoomDto request) {
        return ResponseEntity.ok(ApiResponse.success("Room updated successfully", roomService.updateRoom(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a room (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok(ApiResponse.success("Room deleted successfully", null));
    }
}
