package com.pg.management.service;

import com.pg.management.model.ElectricitySchedule;
import com.pg.management.repository.ElectricityScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ElectricityScheduleService {

    private final ElectricityScheduleRepository electricityScheduleRepository;

    public List<ElectricitySchedule> getAllSchedules() {
        return electricityScheduleRepository.findAllByOrderByStartTimeAsc();
    }

    @Transactional
    public ElectricitySchedule createSchedule(ElectricitySchedule schedule) {
        ElectricitySchedule saved = electricityScheduleRepository.save(schedule);
        log.info("Electricity shutdown schedule created: {}", schedule.getTitle());
        return saved;
    }

    @Transactional
    public void deleteSchedule(Long id) {
        if (!electricityScheduleRepository.existsById(id)) {
            throw new RuntimeException("Schedule not found");
        }
        electricityScheduleRepository.deleteById(id);
        log.info("Electricity shutdown schedule deleted: {}", id);
    }
}
