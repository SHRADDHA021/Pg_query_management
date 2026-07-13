package com.pg.management.controller;

import com.pg.management.dto.*;
import com.pg.management.model.MessMenu;
import com.pg.management.model.ElectricitySchedule;
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

    @PostMapping("/students")
    @Operation(summary = "Create a new student (Admin)")
    public ResponseEntity<ApiResponse<UserDto>> createStudent(@RequestBody Map<String, Object> body) {
        UserDto dto = UserDto.builder()
                .name((String) body.get("name"))
                .username((String) body.get("username"))
                .phone((String) body.get("phone"))
                .address((String) body.get("address"))
                .emergencyContact((String) body.get("emergencyContact"))
                .age(body.get("age") != null ? Integer.parseInt(body.get("age").toString()) : null)
                .rentStatus((String) body.get("rentStatus"))
                .roomId(body.get("roomId") != null ? Long.parseLong(body.get("roomId").toString()) : null)
                .build();
        String password = (String) body.get("password");
        return ResponseEntity.ok(ApiResponse.success("Student created successfully", adminService.createStudent(dto, password)));
    }

    @PutMapping("/students/{id}")
    @Operation(summary = "Update student details (Admin)")
    public ResponseEntity<ApiResponse<UserDto>> updateStudent(@PathVariable Long id, @RequestBody UserDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully", adminService.updateStudent(id, dto)));
    }

    @DeleteMapping("/students/{id}")
    @Operation(summary = "Remove student record (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {
        adminService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student removed successfully", null));
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

    // Weekly Mess Menu Management Endpoints
    @PostMapping("/menu")
    @Operation(summary = "Add/overwrite weekly mess menu item")
    public ResponseEntity<ApiResponse<MessMenu>> addMenu(@RequestBody MessMenuRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Menu item added successfully", adminService.addMenu(request)));
    }

    @PutMapping("/menu/{id}")
    @Operation(summary = "Update menu item text")
    public ResponseEntity<ApiResponse<MessMenu>> updateMenu(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String menuItems = body.get("menuItems");
        return ResponseEntity.ok(ApiResponse.success("Menu item updated successfully", adminService.updateMenu(id, menuItems)));
    }

    @DeleteMapping("/menu/{id}")
    @Operation(summary = "Delete menu item")
    public ResponseEntity<ApiResponse<Void>> deleteMenu(@PathVariable Long id) {
        adminService.deleteMenu(id);
        return ResponseEntity.ok(ApiResponse.success("Menu item deleted successfully", null));
    }

    // Electricity Shutdown Schedule Management Endpoints
    @PostMapping("/schedule")
    @Operation(summary = "Add electricity shutdown schedule")
    public ResponseEntity<ApiResponse<ElectricitySchedule>> addSchedule(@RequestBody ElectricitySchedule schedule) {
        return ResponseEntity.ok(ApiResponse.success("Schedule added successfully", adminService.addSchedule(schedule)));
    }

    @PutMapping("/schedule/{id}")
    @Operation(summary = "Update electricity shutdown schedule")
    public ResponseEntity<ApiResponse<ElectricitySchedule>> updateSchedule(
            @PathVariable Long id,
            @RequestBody ElectricitySchedule schedule) {
        return ResponseEntity.ok(ApiResponse.success("Schedule updated successfully", adminService.updateSchedule(id, schedule)));
    }

    @DeleteMapping("/schedule/{id}")
    @Operation(summary = "Delete electricity shutdown schedule")
    public ResponseEntity<ApiResponse<Void>> deleteSchedule(@PathVariable Long id) {
        adminService.deleteSchedule(id);
        return ResponseEntity.ok(ApiResponse.success("Schedule deleted successfully", null));
    }
}
