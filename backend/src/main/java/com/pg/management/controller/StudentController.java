package com.pg.management.controller;

import com.pg.management.dto.ApiResponse;
import com.pg.management.model.MessMenu;
import com.pg.management.model.ElectricitySchedule;
import com.pg.management.service.MessMenuService;
import com.pg.management.service.ElectricityScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
@Tag(name = "Student", description = "Student-specific query endpoints")
public class StudentController {

    private final MessMenuService messMenuService;
    private final ElectricityScheduleService electricityScheduleService;

    @GetMapping("/menu")
    @Operation(summary = "Get current week's mess menu")
    public ResponseEntity<ApiResponse<List<MessMenu>>> getCurrentMenu(@RequestParam(required = false) String weekStart) {
        if (weekStart != null) {
            java.time.LocalDate date = java.time.LocalDate.parse(weekStart);
            return ResponseEntity.ok(ApiResponse.success("Week menu", messMenuService.getMenuByWeek(date)));
        }
        return ResponseEntity.ok(ApiResponse.success("Current week menu", messMenuService.getCurrentWeekMenu()));
    }

    @GetMapping("/schedule")
    @Operation(summary = "Get all electricity shutdown schedules")
    public ResponseEntity<ApiResponse<List<ElectricitySchedule>>> getAllSchedules() {
        return ResponseEntity.ok(ApiResponse.success("All schedules", electricityScheduleService.getAllSchedules()));
    }
}
