package com.pg.management.service;

import com.pg.management.dto.MessMenuRequest;
import com.pg.management.model.MessMenu;
import com.pg.management.repository.MessMenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessMenuService {

    private final MessMenuRepository messMenuRepository;

    public LocalDate getCurrentWeekStart() {
        return LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
    }

    public List<MessMenu> getCurrentWeekMenu() {
        return messMenuRepository.findByWeekStartDateOrderByDayOfWeekAscMealTypeAsc(getCurrentWeekStart());
    }

    public List<MessMenu> getMenuByWeek(LocalDate weekStartDate) {
        return messMenuRepository.findByWeekStartDateOrderByDayOfWeekAscMealTypeAsc(weekStartDate);
    }

    @Transactional
    public MessMenu saveMenuItem(LocalDate weekStartDate, MessMenuRequest request) {
        // Check if entry already exists
        List<MessMenu> existing = messMenuRepository.findByWeekStartDate(weekStartDate);
        existing.stream()
                .filter(m -> m.getDayOfWeek() == request.getDayOfWeek() && m.getMealType() == request.getMealType())
                .findFirst()
                .ifPresent(messMenuRepository::delete);

        MessMenu menu = MessMenu.builder()
                .weekStartDate(weekStartDate)
                .dayOfWeek(request.getDayOfWeek())
                .mealType(request.getMealType())
                .menuItems(request.getMenuItems())
                .build();

        return messMenuRepository.save(menu);
    }

    @Transactional
    public void saveWeeklyMenu(LocalDate weekStartDate, List<MessMenuRequest> requests) {
        messMenuRepository.deleteByWeekStartDate(weekStartDate);
        for (MessMenuRequest req : requests) {
            MessMenu menu = MessMenu.builder()
                    .weekStartDate(weekStartDate)
                    .dayOfWeek(req.getDayOfWeek())
                    .mealType(req.getMealType())
                    .menuItems(req.getMenuItems())
                    .build();
            messMenuRepository.save(menu);
        }
    }

    @Transactional
    public void deleteMenuItem(Long id) {
        messMenuRepository.deleteById(id);
    }

    @Transactional
    public MessMenu updateMenuItem(Long id, String menuItems) {
        MessMenu menu = messMenuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        menu.setMenuItems(menuItems);
        return messMenuRepository.save(menu);
    }
}
