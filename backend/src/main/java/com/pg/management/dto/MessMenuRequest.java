package com.pg.management.dto;

import com.pg.management.model.MessMenu;
import lombok.Data;

@Data
public class MessMenuRequest {
    private MessMenu.DayOfWeek dayOfWeek;
    private MessMenu.MealType mealType;
    private String menuItems;
}
