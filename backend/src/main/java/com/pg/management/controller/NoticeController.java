package com.pg.management.controller;

import com.pg.management.dto.ApiResponse;
import com.pg.management.model.Notice;
import com.pg.management.service.NoticeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
@Tag(name = "Notice Board", description = "Notice management endpoints")
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping
    @Operation(summary = "Get all notices (Student/Admin)")
    public ResponseEntity<ApiResponse<List<Notice>>> getAllNotices() {
        return ResponseEntity.ok(ApiResponse.success("All notices", noticeService.getAllNotices()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new notice (Admin only)")
    public ResponseEntity<ApiResponse<Notice>> createNotice(@RequestBody Notice notice) {
        Notice created = noticeService.createNotice(notice);
        return ResponseEntity.ok(ApiResponse.success("Notice posted successfully", created));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a notice (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok(ApiResponse.success("Notice deleted successfully", null));
    }
}
