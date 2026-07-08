package com.pg.management.dto;

import com.pg.management.model.Room;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomDto {
    private Long id;
    private String roomNumber;
    private Integer capacity;
    private Integer occupiedCount;
    private Integer availableSlots;
    private Integer floor;
    private Room.RoomType type;
    private Double monthlyRent;
    private String description;
    private String occupancyStatus; // VACANT, PARTIAL, FULL
}
