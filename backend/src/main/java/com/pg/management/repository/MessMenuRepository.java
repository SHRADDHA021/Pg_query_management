package com.pg.management.repository;

import com.pg.management.model.MessMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MessMenuRepository extends JpaRepository<MessMenu, Long> {
    List<MessMenu> findByWeekStartDate(LocalDate weekStartDate);
    List<MessMenu> findByWeekStartDateOrderByDayOfWeekAscMealTypeAsc(LocalDate weekStartDate);
    void deleteByWeekStartDate(LocalDate weekStartDate);
}
