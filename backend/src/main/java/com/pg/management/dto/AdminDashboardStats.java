package com.pg.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStats {
    private long totalStudents;
    private long pendingVerifications;
    private long verifiedStudents;
    private long totalRooms;
    private long vacantRooms;
    private long fullRooms;
    private long openComplaints;
    private long inProgressComplaints;
    private long resolvedComplaints;
    private long unpaidFees;
    private long overdueFees;
    private long paidFees;
}
