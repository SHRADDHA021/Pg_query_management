package com.pg.management.controller;

import com.pg.management.dto.ApiResponse;
import com.pg.management.dto.FeeDto;
import com.pg.management.model.FeeRecord;
import com.pg.management.service.FeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
@Tag(name = "Fees", description = "Fee management endpoints")
public class FeeController {

    private final FeeService feeService;

    @GetMapping("/my")
    @Operation(summary = "Get my fee records (Student)")
    public ResponseEntity<ApiResponse<List<FeeDto>>> getMyFees(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Your fee records", feeService.getStudentFees(userDetails.getUsername())));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all fee records (Admin)")
    public ResponseEntity<ApiResponse<List<FeeDto>>> getAllFees() {
        return ResponseEntity.ok(ApiResponse.success("All fees", feeService.getAllFees()));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get fee records for a specific student (Admin)")
    public ResponseEntity<ApiResponse<List<FeeDto>>> getStudentFees(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success("Student fee records", feeService.getStudentFeesById(studentId)));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get fees by status (Admin)")
    public ResponseEntity<ApiResponse<List<FeeDto>>> getFeesByStatus(@PathVariable String status) {
        FeeRecord.FeeStatus feeStatus = FeeRecord.FeeStatus.valueOf(status.toUpperCase());
        return ResponseEntity.ok(ApiResponse.success("Fees by status", feeService.getFeesByStatus(feeStatus)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create fee record for a student (Admin)")
    public ResponseEntity<ApiResponse<FeeDto>> createFeeRecord(@RequestBody Map<String, Object> request) {
        Long studentId = Long.parseLong(request.get("studentId").toString());
        int month = Integer.parseInt(request.get("month").toString());
        int year = Integer.parseInt(request.get("year").toString());
        double amount = Double.parseDouble(request.get("amount").toString());
        LocalDate dueDate = request.containsKey("dueDate")
                ? LocalDate.parse(request.get("dueDate").toString()) : null;
        String remarks = request.containsKey("remarks") ? request.get("remarks").toString() : null;

        FeeDto fee = feeService.createFeeRecord(studentId, month, year, amount, dueDate, remarks);
        return ResponseEntity.ok(ApiResponse.success("Fee record created", fee));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update fee status (Admin)")
    public ResponseEntity<ApiResponse<FeeDto>> updateFeeStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        FeeRecord.FeeStatus status = FeeRecord.FeeStatus.valueOf(request.get("status").toUpperCase());
        String remarks = request.get("remarks");
        return ResponseEntity.ok(ApiResponse.success("Fee status updated", feeService.updateFeeStatus(id, status, remarks)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete fee record (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteFeeRecord(@PathVariable Long id) {
        feeService.deleteFeeRecord(id);
        return ResponseEntity.ok(ApiResponse.success("Fee record deleted", null));
    }
}
