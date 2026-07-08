package com.pg.management.controller;

import com.pg.management.dto.ApiResponse;
import com.pg.management.dto.MessMenuRequest;
import com.pg.management.model.MessMenu;
import com.pg.management.service.MessMenuService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mess")
@RequiredArgsConstructor
@Tag(name = "Mess Menu", description = "Weekly mess menu endpoints")
public class MessMenuController {

    private final MessMenuService messMenuService;

    @GetMapping("/current")
    @Operation(summary = "Get current week's mess menu")
    public ResponseEntity<ApiResponse<List<MessMenu>>> getCurrentMenu() {
        return ResponseEntity.ok(ApiResponse.success("Current week menu", messMenuService.getCurrentWeekMenu()));
    }

    @GetMapping("/week")
    @Operation(summary = "Get mess menu for a specific week")
    public ResponseEntity<ApiResponse<List<MessMenu>>> getMenuByWeek(@RequestParam String weekStart) {
        LocalDate date = LocalDate.parse(weekStart);
        return ResponseEntity.ok(ApiResponse.success("Week menu", messMenuService.getMenuByWeek(date)));
    }

    @PostMapping("/week/{weekStart}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Save/replace full weekly menu (Admin)")
    public ResponseEntity<ApiResponse<Void>> saveWeeklyMenu(
            @PathVariable String weekStart,
            @RequestBody List<MessMenuRequest> requests) {
        LocalDate date = LocalDate.parse(weekStart);
        messMenuService.saveWeeklyMenu(date, requests);
        return ResponseEntity.ok(ApiResponse.success("Weekly menu saved successfully", null));
    }

    @PostMapping("/item/{weekStart}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Save single menu item for a week (Admin)")
    public ResponseEntity<ApiResponse<MessMenu>> saveMenuItem(
            @PathVariable String weekStart,
            @RequestBody MessMenuRequest request) {
        LocalDate date = LocalDate.parse(weekStart);
        MessMenu menu = messMenuService.saveMenuItem(date, request);
        return ResponseEntity.ok(ApiResponse.success("Menu item saved", menu));
    }

    @PatchMapping("/item/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a menu item (Admin)")
    public ResponseEntity<ApiResponse<MessMenu>> updateMenuItem(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        MessMenu menu = messMenuService.updateMenuItem(id, request.get("menuItems"));
        return ResponseEntity.ok(ApiResponse.success("Menu item updated", menu));
    }

    @DeleteMapping("/item/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a menu item (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable Long id) {
        messMenuService.deleteMenuItem(id);
        return ResponseEntity.ok(ApiResponse.success("Menu item deleted", null));
    }
}
