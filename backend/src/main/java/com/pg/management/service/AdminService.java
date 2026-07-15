package com.pg.management.service;

import com.pg.management.dto.*;
import com.pg.management.model.Room;
import com.pg.management.model.User;
import com.pg.management.model.MessMenu;
import com.pg.management.model.ElectricitySchedule;
import com.pg.management.repository.ComplaintRepository;
import com.pg.management.repository.RoomRepository;
import com.pg.management.repository.UserRepository;
import com.pg.management.repository.MessMenuRepository;
import com.pg.management.repository.ElectricityScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final MessMenuRepository messMenuRepository;
    private final ElectricityScheduleRepository electricityScheduleRepository;
    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;

    public AdminDashboardStats getDashboardStats() {
        return AdminDashboardStats.builder()
                .totalStudents(userRepository.countByRole(User.Role.STUDENT))
                .pendingVerifications(userRepository.countByStatus(User.UserStatus.PENDING))
                .verifiedStudents(userRepository.countByStatus(User.UserStatus.VERIFIED))
                .totalRooms(roomRepository.count())
                .vacantRooms(roomRepository.findVacantRooms().size())
                .fullRooms(roomRepository.findFullRooms().size())
                .openComplaints(complaintRepository.countByStatus(com.pg.management.model.Complaint.ComplaintStatus.SUBMITTED) + 
                                complaintRepository.countByStatus(com.pg.management.model.Complaint.ComplaintStatus.IN_REVIEW))
                .inProgressComplaints(complaintRepository.countByStatus(com.pg.management.model.Complaint.ComplaintStatus.IN_PROGRESS))
                .resolvedComplaints(complaintRepository.countByStatus(com.pg.management.model.Complaint.ComplaintStatus.RESOLVED) + 
                                    complaintRepository.countByStatus(com.pg.management.model.Complaint.ComplaintStatus.CLOSED))
                .unpaidFees(0)
                .overdueFees(0)
                .paidFees(0)
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
    public UserDto createStudent(UserDto dto, String password) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username already exists: " + dto.getUsername());
        }

        Room room = null;
        if (dto.getRoomId() != null) {
            room = roomRepository.findById(dto.getRoomId())
                    .orElseThrow(() -> new RuntimeException("Room not found"));
            if (room.isFull()) {
                throw new RuntimeException("Room " + room.getRoomNumber() + " is full");
            }
            room.setOccupiedCount(room.getOccupiedCount() + 1);
            roomRepository.save(room);
        }

        User student = User.builder()
                .name(dto.getName())
                .username(dto.getUsername())
                .password(passwordEncoder.encode(password))
                .role(User.Role.STUDENT)
                .status(User.UserStatus.VERIFIED)
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .emergencyContact(dto.getEmergencyContact())
                .age(dto.getAge())
                .rentStatus(dto.getRentStatus() != null ? dto.getRentStatus() : "Pending")
                .joinedDate(dto.getJoinedDate() != null ? dto.getJoinedDate() : LocalDate.now())
                .room(room)
                .build();

        User saved = userRepository.save(student);
        log.info("Student created successfully: {}", saved.getUsername());
        return authService.mapToUserDto(saved);
    }

    @Transactional
    public UserDto updateStudent(Long id, UserDto dto) {
        User student = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (dto.getName() != null) {
            student.setName(dto.getName());
        }
        if (dto.getPhone() != null) {
            student.setPhone(dto.getPhone());
        }
        if (dto.getAge() != null) {
            student.setAge(dto.getAge());
        }
        if (dto.getAddress() != null) {
            student.setAddress(dto.getAddress());
        }
        if (dto.getEmergencyContact() != null) {
            student.setEmergencyContact(dto.getEmergencyContact());
        }
        if (dto.getRentStatus() != null) {
            student.setRentStatus(dto.getRentStatus());
        }

        // Room reassignment logic
        Long currentRoomId = student.getRoom() != null ? student.getRoom().getId() : null;
        Long targetRoomId = dto.getRoomId();

        boolean shouldProcessRoomChange = false;
        if (targetRoomId != null) {
            shouldProcessRoomChange = (currentRoomId == null || !currentRoomId.equals(targetRoomId));
        } else {
            if (dto.getName() != null) {
                shouldProcessRoomChange = (currentRoomId != null);
            }
        }

        if (shouldProcessRoomChange) {
            // Vacate old room
            if (student.getRoom() != null) {
                Room oldRoom = student.getRoom();
                oldRoom.setOccupiedCount(Math.max(0, oldRoom.getOccupiedCount() - 1));
                roomRepository.save(oldRoom);
            }

            // Allocate new room
            if (targetRoomId != null) {
                Room newRoom = roomRepository.findById(targetRoomId)
                        .orElseThrow(() -> new RuntimeException("Room not found"));
                if (newRoom.isFull()) {
                    throw new RuntimeException("Room " + newRoom.getRoomNumber() + " is full");
                }
                newRoom.setOccupiedCount(newRoom.getOccupiedCount() + 1);
                roomRepository.save(newRoom);
                student.setRoom(newRoom);
            } else {
                student.setRoom(null);
            }
        }

        User saved = userRepository.save(student);
        log.info("Student updated successfully: {}", saved.getUsername());
        return authService.mapToUserDto(saved);
    }

    @Transactional
    public void deleteStudent(Long id) {
        User student = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (student.getRoom() != null) {
            Room room = student.getRoom();
            room.setOccupiedCount(Math.max(0, room.getOccupiedCount() - 1));
            roomRepository.save(room);
        }

        // Delete complaints first to avoid FK constraint violation
        complaintRepository.deleteByStudentId(id);

        userRepository.delete(student);
        log.info("Student deleted successfully: {}", student.getUsername());
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

        student.setStatus(User.UserStatus.VERIFIED);
        student.setRoom(room);

        room.setOccupiedCount(room.getOccupiedCount() + 1);
        roomRepository.save(room);

        User saved = userRepository.save(student);
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
        return updateStudent(studentId, UserDto.builder().roomId(newRoomId).build());
    }

    public UserDto getStudentById(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return authService.mapToUserDto(student);
    }

    // Weekly Mess Menu Management
    @Transactional
    public MessMenu addMenu(MessMenuRequest request) {
        LocalDate weekStart = request.getWeekStartDate();
        // Remove existing if duplicate key
        List<MessMenu> existing = messMenuRepository.findByWeekStartDate(weekStart);
        existing.stream()
                .filter(m -> m.getDayOfWeek() == request.getDayOfWeek() && m.getMealType() == request.getMealType())
                .findFirst()
                .ifPresent(messMenuRepository::delete);

        MessMenu menu = MessMenu.builder()
                .weekStartDate(weekStart)
                .dayOfWeek(request.getDayOfWeek())
                .mealType(request.getMealType())
                .menuItems(request.getMenuItems())
                .build();
        return messMenuRepository.save(menu);
    }

    @Transactional
    public MessMenu updateMenu(Long id, String menuItems) {
        MessMenu menu = messMenuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        menu.setMenuItems(menuItems);
        return messMenuRepository.save(menu);
    }

    @Transactional
    public void deleteMenu(Long id) {
        messMenuRepository.deleteById(id);
    }

    // Electricity Schedule Management
    @Transactional
    public ElectricitySchedule addSchedule(ElectricitySchedule schedule) {
        return electricityScheduleRepository.save(schedule);
    }

    @Transactional
    public ElectricitySchedule updateSchedule(Long id, ElectricitySchedule request) {
        ElectricitySchedule schedule = electricityScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Electricity schedule not found"));
        schedule.setTitle(request.getTitle());
        schedule.setDescription(request.getDescription());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setAffectedAreas(request.getAffectedAreas());
        return electricityScheduleRepository.save(schedule);
    }

    @Transactional
    public void deleteSchedule(Long id) {
        electricityScheduleRepository.deleteById(id);
    }
}
