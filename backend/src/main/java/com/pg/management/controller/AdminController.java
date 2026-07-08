package com.pg.management.controller;

import com.pg.management.dto.*;
import com.pg.management.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin management endpoints")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard statistics")
    public ResponseEntity<ApiResponse<AdminDashboardStats>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats", adminService.getDashboardStats()));
    }

    @GetMapping("/students")
    @Operation(summary = "Get all students")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllStudents() {
        return ResponseEntity.ok(ApiResponse.success("All students", adminService.getAllStudents()));
    }

    @GetMapping("/students/pending")
    @Operation(summary = "Get students pending verification")
    public ResponseEntity<ApiResponse<List<UserDto>>> getPendingStudents() {
        return ResponseEntity.ok(ApiResponse.success("Pending students", adminService.getPendingStudents()));
    }

    @GetMapping("/students/{id}")
    @Operation(summary = "Get student by ID")
    public ResponseEntity<ApiResponse<UserDto>> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Student details", adminService.getStudentById(id)));
    }

    @PostMapping("/students/{studentId}/verify")
    @Operation(summary = "Verify student and assign room")
    public ResponseEntity<ApiResponse<UserDto>> verifyAndAssignRoom(
            @PathVariable Long studentId,
            @RequestBody Map<String, Long> request) {
        Long roomId = request.get("roomId");
        UserDto user = adminService.verifyAndAssignRoom(studentId, roomId);
        return ResponseEntity.ok(ApiResponse.success("Student verified and room assigned", user));
    }

    @PostMapping("/students/{studentId}/reject")
    @Operation(summary = "Reject a student registration")
    public ResponseEntity<ApiResponse<UserDto>> rejectStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success("Student rejected", adminService.rejectStudent(studentId)));
    }

    @PutMapping("/students/{studentId}/room")
    @Operation(summary = "Reassign student to a different room")
    public ResponseEntity<ApiResponse<UserDto>> reassignRoom(
            @PathVariable Long studentId,
            @RequestBody Map<String, Long> request) {
        Long roomId = request.get("roomId");
        UserDto user = adminService.reassignRoom(studentId, roomId);
        return ResponseEntity.ok(ApiResponse.success("Room reassigned successfully", user));
    }
}
