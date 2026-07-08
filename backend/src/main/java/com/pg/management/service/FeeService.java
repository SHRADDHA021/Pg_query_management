package com.pg.management.service;

import com.pg.management.dto.FeeDto;
import com.pg.management.model.FeeRecord;
import com.pg.management.model.User;
import com.pg.management.repository.FeeRepository;
import com.pg.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FeeService {

    private final FeeRepository feeRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public List<FeeDto> getStudentFees(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return feeRepository.findByStudentIdOrderByYearDescMonthDesc(student.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<FeeDto> getStudentFeesById(Long studentId) {
        return feeRepository.findByStudentIdOrderByYearDescMonthDesc(studentId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<FeeDto> getAllFees() {
        return feeRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<FeeDto> getFeesByStatus(FeeRecord.FeeStatus status) {
        return feeRepository.findByStatus(status)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public FeeDto createFeeRecord(Long studentId, int month, int year, double amount, LocalDate dueDate, String remarks) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Optional<FeeRecord> existing = feeRepository.findByStudentIdAndMonthAndYear(studentId, month, year);
        if (existing.isPresent()) {
            throw new RuntimeException("Fee record already exists for this month/year");
        }

        FeeRecord fee = FeeRecord.builder()
                .student(student)
                .month(month)
                .year(year)
                .amount(amount)
                .status(FeeRecord.FeeStatus.UNPAID)
                .dueDate(dueDate)
                .remarks(remarks)
                .build();

        return mapToDto(feeRepository.save(fee));
    }

    @Transactional
    public FeeDto updateFeeStatus(Long feeId, FeeRecord.FeeStatus status, String remarks) {
        FeeRecord fee = feeRepository.findById(feeId)
                .orElseThrow(() -> new RuntimeException("Fee record not found"));

        fee.setStatus(status);
        if (status == FeeRecord.FeeStatus.PAID) {
            fee.setPaidDate(LocalDate.now());
        }
        if (remarks != null) fee.setRemarks(remarks);

        return mapToDto(feeRepository.save(fee));
    }

    @Transactional
    public void deleteFeeRecord(Long feeId) {
        feeRepository.findById(feeId)
                .orElseThrow(() -> new RuntimeException("Fee record not found"));
        feeRepository.deleteById(feeId);
    }

    // Runs on 1st of every month at 9:00 AM
    @Scheduled(cron = "0 0 9 1 * *")
    public void sendMonthlyFeeReminders() {
        log.info("Running monthly fee reminder job...");
        List<FeeRecord> unpaidFees = feeRepository.findByStatus(FeeRecord.FeeStatus.UNPAID);
        for (FeeRecord fee : unpaidFees) {
            try {
                emailService.sendFeeReminderEmail(
                        fee.getStudent().getEmail(),
                        fee.getStudent().getName(),
                        fee.getMonth(),
                        fee.getYear(),
                        fee.getAmount(),
                        fee.getDueDate() != null ? fee.getDueDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy")) : "N/A"
                );
                log.info("Fee reminder sent to {}", fee.getStudent().getEmail());
            } catch (Exception e) {
                log.error("Failed to send fee reminder to {}: {}", fee.getStudent().getEmail(), e.getMessage());
            }
        }
    }

    // Runs every day at 8:00 AM to mark overdue fees
    @Scheduled(cron = "0 0 8 * * *")
    @Transactional
    public void markOverdueFees() {
        log.info("Running overdue fee check...");
        List<FeeRecord> overdueFees = feeRepository.findOverdueFees(LocalDate.now());
        for (FeeRecord fee : overdueFees) {
            fee.setStatus(FeeRecord.FeeStatus.OVERDUE);
            feeRepository.save(fee);
        }
        log.info("Marked {} fees as overdue", overdueFees.size());
    }

    // Runs every day at 9:00 AM to send 3-day reminders
    @Scheduled(cron = "0 0 9 * * *")
    public void sendUpcomingDueReminders() {
        LocalDate today = LocalDate.now();
        LocalDate upcoming = today.plusDays(3);
        List<FeeRecord> fees = feeRepository.findUpcomingDueFees(today, upcoming);
        for (FeeRecord fee : fees) {
            try {
                emailService.sendFeeReminderEmail(
                        fee.getStudent().getEmail(),
                        fee.getStudent().getName(),
                        fee.getMonth(),
                        fee.getYear(),
                        fee.getAmount(),
                        fee.getDueDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy"))
                );
            } catch (Exception e) {
                log.error("Failed to send upcoming due reminder: {}", e.getMessage());
            }
        }
    }

    private FeeDto mapToDto(FeeRecord fee) {
        return FeeDto.builder()
                .id(fee.getId())
                .studentId(fee.getStudent().getId())
                .studentName(fee.getStudent().getName())
                .studentEmail(fee.getStudent().getEmail())
                .roomNumber(fee.getStudent().getRoom() != null ? fee.getStudent().getRoom().getRoomNumber() : null)
                .month(fee.getMonth())
                .year(fee.getYear())
                .amount(fee.getAmount())
                .status(fee.getStatus())
                .dueDate(fee.getDueDate())
                .paidDate(fee.getPaidDate())
                .remarks(fee.getRemarks())
                .createdAt(fee.getCreatedAt())
                .build();
    }
}
