package com.pg.management.dto;

import com.pg.management.model.MessMenu;
import lombok.Data;
import java.time.LocalDate;

@Data
public class MessMenuRequest {
    private LocalDate weekStartDate;
    private MessMenu.DayOfWeek dayOfWeek;
    private MessMenu.MealType mealType;
    private String menuItems;
}
