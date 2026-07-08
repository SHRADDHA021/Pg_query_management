package com.pg.management.controller;

import com.pg.management.dto.ApiResponse;
import com.pg.management.dto.ComplaintDto;
import com.pg.management.dto.ComplaintRequest;
import com.pg.management.model.Complaint;
import com.pg.management.service.ComplaintService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
@Tag(name = "Complaints", description = "Complaint management endpoints")
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    @Operation(summary = "Create a new complaint (Student)")
    public ResponseEntity<ApiResponse<ComplaintDto>> createComplaint(
            @Valid @RequestBody ComplaintRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        ComplaintDto complaint = complaintService.createComplaint(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Complaint submitted successfully", complaint));
    }

    @GetMapping("/my")
    @Operation(summary = "Get my complaints (Student)")
    public ResponseEntity<ApiResponse<List<ComplaintDto>>> getMyComplaints(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<ComplaintDto> complaints = complaintService.getComplaintsByStudent(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Your complaints", complaints));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all complaints (Admin only)")
    public ResponseEntity<ApiResponse<List<ComplaintDto>>> getAllComplaints() {
        return ResponseEntity.ok(ApiResponse.success("All complaints", complaintService.getAllComplaints()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get complaint by ID")
    public ResponseEntity<ApiResponse<ComplaintDto>> getComplaintById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Complaint details", complaintService.getComplaintById(id)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update complaint status (Admin only)")
    public ResponseEntity<ApiResponse<ComplaintDto>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        Complaint.ComplaintStatus status = Complaint.ComplaintStatus.valueOf(request.get("status"));
        String adminNote = request.get("adminNote");
        ComplaintDto complaint = complaintService.updateComplaintStatus(id, status, adminNote);
        return ResponseEntity.ok(ApiResponse.success("Status updated successfully", complaint));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an open complaint (Student)")
    public ResponseEntity<ApiResponse<Void>> deleteComplaint(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        complaintService.deleteComplaint(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Complaint deleted", null));
    }
}
