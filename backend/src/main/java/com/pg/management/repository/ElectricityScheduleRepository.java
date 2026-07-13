package com.pg.management.repository;

import com.pg.management.model.ElectricitySchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ElectricityScheduleRepository extends JpaRepository<ElectricitySchedule, Long> {
    List<ElectricitySchedule> findAllByOrderByStartTimeAsc();
}
