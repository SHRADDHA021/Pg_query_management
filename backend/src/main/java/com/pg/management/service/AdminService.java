package com.pg.management.service;

import com.pg.management.dto.*;
import com.pg.management.model.Room;
import com.pg.management.model.User;
import com.pg.management.repository.ComplaintRepository;
import com.pg.management.repository.FeeRepository;
import com.pg.management.repository.RoomRepository;
import com.pg.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final ComplaintRepository complaintRepository;
    private final FeeRepository feeRepository;
    private final EmailService emailService;
    private final AuthService authService;

    public AdminDashboardStats getDashboardStats() {
        return AdminDashboardStats.builder()
                .totalStudents(userRepository.countByRole(User.Role.STUDENT))
                .pendingVerifications(userRepository.countByStatus(User.UserStatus.PENDING))
                .verifiedStudents(userRepository.countByStatus(User.UserStatus.VERIFIED))
                .totalRooms(roomRepository.count())
                .vacantRooms(roomRepository.findVacantRooms().size())
                .fullRooms(roomRepository.findFullRooms().size())
                .openComplaints(complaintRepository.countByStatus(com.pg.management.model.Complaint.ComplaintStatus.OPEN))
                .inProgressComplaints(complaintRepository.countByStatus(com.pg.management.model.Complaint.ComplaintStatus.IN_PROGRESS))
                .resolvedComplaints(complaintRepository.countByStatus(com.pg.management.model.Complaint.ComplaintStatus.RESOLVED))
                .unpaidFees(feeRepository.countByStatus(com.pg.management.model.FeeRecord.FeeStatus.UNPAID))
                .overdueFees(feeRepository.countByStatus(com.pg.management.model.FeeRecord.FeeStatus.OVERDUE))
                .paidFees(feeRepository.countByStatus(com.pg.management.model.FeeRecord.FeeStatus.PAID))
                .build();
    }

    public List<UserDto> getPendingStudents() {
        return userRepository.findByStatus(User.UserStatus.PENDING)
                .stream()
                .map(authService::mapToUserDto)
                .collect(Collectors.toList());
    }

    public List<UserDto> getAllStudents() {
        return userRepository.findByRole(User.Role.STUDENT)
                .stream()
                .map(authService::mapToUserDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto verifyAndAssignRoom(Long studentId, Long roomId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (student.getStatus() == User.UserStatus.VERIFIED) {
            throw new RuntimeException("Student is already verified");
        }

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (room.isFull()) {
            throw new RuntimeException("Room " + room.getRoomNumber() + " is full");
        }

        // Update student
        student.setStatus(User.UserStatus.VERIFIED);
        student.setRoom(room);

        // Update room occupancy
        room.setOccupiedCount(room.getOccupiedCount() + 1);
        roomRepository.save(room);

        User saved = userRepository.save(student);
        log.info("Student {} verified and assigned to room {}", student.getEmail(), room.getRoomNumber());

        // Send notification email
        try {
            emailService.sendVerificationEmail(student.getEmail(), student.getName(), room.getRoomNumber());
        } catch (Exception e) {
            log.warn("Failed to send verification email: {}", e.getMessage());
        }

        return authService.mapToUserDto(saved);
    }

    @Transactional
    public UserDto rejectStudent(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        student.setStatus(User.UserStatus.REJECTED);
        return authService.mapToUserDto(userRepository.save(student));
    }

    @Transactional
    public UserDto reassignRoom(Long studentId, Long newRoomId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Free old room
        if (student.getRoom() != null) {
            Room oldRoom = student.getRoom();
            oldRoom.setOccupiedCount(Math.max(0, oldRoom.getOccupiedCount() - 1));
            roomRepository.save(oldRoom);
        }

        Room newRoom = roomRepository.findById(newRoomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (newRoom.isFull()) {
            throw new RuntimeException("Room " + newRoom.getRoomNumber() + " is full");
        }

        newRoom.setOccupiedCount(newRoom.getOccupiedCount() + 1);
        roomRepository.save(newRoom);

        student.setRoom(newRoom);
        return authService.mapToUserDto(userRepository.save(student));
    }

    public UserDto getStudentById(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return authService.mapToUserDto(student);
    }
}
