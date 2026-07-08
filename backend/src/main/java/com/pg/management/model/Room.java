package com.pg.management.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "rooms")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_number", nullable = false, unique = true)
    private String roomNumber;

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "occupied_count", nullable = false)
    private Integer occupiedCount = 0;

    private Integer floor;

    @Enumerated(EnumType.STRING)
    private RoomType type;

    private Double monthlyRent;

    private String description;

    @OneToMany(mappedBy = "room", fetch = FetchType.LAZY)
    private List<User> residents;

    public enum RoomType { SINGLE, DOUBLE, TRIPLE }

    public boolean isFull() {
        return occupiedCount >= capacity;
    }

    public boolean isVacant() {
        return occupiedCount == 0;
    }

    public int getAvailableSlots() {
        return capacity - occupiedCount;
    }
}
