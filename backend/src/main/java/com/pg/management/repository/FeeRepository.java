package com.pg.management.repository;

import com.pg.management.model.FeeRecord;
import com.pg.management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FeeRepository extends JpaRepository<FeeRecord, Long> {
    List<FeeRecord> findByStudentId(Long studentId);
    List<FeeRecord> findByStudentIdOrderByYearDescMonthDesc(Long studentId);
    List<FeeRecord> findByStatus(FeeRecord.FeeStatus status);
    Optional<FeeRecord> findByStudentIdAndMonthAndYear(Long studentId, Integer month, Integer year);

    @Query("SELECT f FROM FeeRecord f WHERE f.status IN ('UNPAID', 'OVERDUE') AND f.dueDate <= :date")
    List<FeeRecord> findOverdueFees(LocalDate date);

    @Query("SELECT f FROM FeeRecord f WHERE f.status = 'UNPAID' AND f.dueDate <= :upcomingDate AND f.dueDate > :today")
    List<FeeRecord> findUpcomingDueFees(LocalDate today, LocalDate upcomingDate);

    long countByStatus(FeeRecord.FeeStatus status);
}
