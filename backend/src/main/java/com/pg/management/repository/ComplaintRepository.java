package com.pg.management.repository;

import com.pg.management.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByStudentId(Long studentId);
    List<Complaint> findByStatus(Complaint.ComplaintStatus status);
    List<Complaint> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<Complaint> findAllByOrderByCreatedAtDesc();
    long countByStatus(Complaint.ComplaintStatus status);

    @Modifying
    @Query("DELETE FROM Complaint c WHERE c.student.id = :studentId")
    void deleteByStudentId(Long studentId);
}
