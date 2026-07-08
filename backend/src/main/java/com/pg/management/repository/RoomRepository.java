package com.pg.management.repository;

import com.pg.management.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findByRoomNumber(String roomNumber);
    boolean existsByRoomNumber(String roomNumber);

    @Query("SELECT r FROM Room r WHERE r.occupiedCount < r.capacity")
    List<Room> findAvailableRooms();

    @Query("SELECT r FROM Room r WHERE r.occupiedCount = 0")
    List<Room> findVacantRooms();

    @Query("SELECT r FROM Room r WHERE r.occupiedCount >= r.capacity")
    List<Room> findFullRooms();

    List<Room> findByType(Room.RoomType type);
}
