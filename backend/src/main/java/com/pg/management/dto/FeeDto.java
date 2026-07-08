package com.pg.management.dto;

import com.pg.management.model.FeeRecord;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeeDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String roomNumber;
    private Integer month;
    private Integer year;
    private Double amount;
    private FeeRecord.FeeStatus status;
    private LocalDate dueDate;
    private LocalDate paidDate;
    private String remarks;
    private LocalDateTime createdAt;
}
