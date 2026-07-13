package com.pg.management.service;

import com.pg.management.dto.ComplaintDto;
import com.pg.management.dto.ComplaintRequest;
import com.pg.management.model.Complaint;
import com.pg.management.model.User;
import com.pg.management.repository.ComplaintRepository;
import com.pg.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    @Transactional
    public ComplaintDto createComplaint(ComplaintRequest request, String studentUsername) {
        User student = userRepository.findByUsername(studentUsername)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Complaint complaint = Complaint.builder()
                .student(student)
                .category(request.getCategory())
                .description(request.getDescription())
                .status(Complaint.ComplaintStatus.SUBMITTED)
                .build();

        Complaint saved = complaintRepository.save(complaint);
        log.info("Complaint created by {} - category: {}", studentUsername, request.getCategory());
        return mapToDto(saved);
    }

    public List<ComplaintDto> getComplaintsByStudent(String studentUsername) {
        User student = userRepository.findByUsername(studentUsername)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return complaintRepository.findByStudentIdOrderByCreatedAtDesc(student.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ComplaintDto> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ComplaintDto getComplaintById(Long id) {
        return mapToDto(complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found")));
    }

    @Transactional
    public ComplaintDto updateComplaintStatus(Long id, Complaint.ComplaintStatus status, String adminNote) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(status);
        if (adminNote != null) {
            complaint.setAdminNote(adminNote);
        }

        Complaint saved = complaintRepository.save(complaint);
        log.info("Complaint {} status updated to {}", id, status);

        return mapToDto(saved);
    }

    @Transactional
    public void deleteComplaint(Long id, String studentUsername) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (!complaint.getStudent().getUsername().equals(studentUsername)) {
            throw new RuntimeException("Unauthorized: Cannot delete another student's complaint");
        }

        if (complaint.getStatus() != Complaint.ComplaintStatus.SUBMITTED) {
            throw new RuntimeException("Cannot delete a complaint that is under review or in progress");
        }

        complaintRepository.delete(complaint);
    }

    private ComplaintDto mapToDto(Complaint complaint) {
        return ComplaintDto.builder()
                .id(complaint.getId())
                .studentId(complaint.getStudent().getId())
                .studentName(complaint.getStudent().getName())
                .studentUsername(complaint.getStudent().getUsername())
                .roomNumber(complaint.getStudent().getRoom() != null
                        ? complaint.getStudent().getRoom().getRoomNumber() : null)
                .category(complaint.getCategory())
                .description(complaint.getDescription())
                .status(complaint.getStatus())
                .adminNote(complaint.getAdminNote())
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .build();
    }
}
