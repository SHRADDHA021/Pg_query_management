package com.pg.management.dto;

import com.pg.management.model.Complaint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentUsername;
    private String roomNumber;
    private Complaint.ComplaintCategory category;
    private String description;
    private Complaint.ComplaintStatus status;
    private String adminNote;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
