package com.pg.management.service;

import com.pg.management.dto.RoomDto;
import com.pg.management.model.Room;
import com.pg.management.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    public List<RoomDto> getAllRooms() {
        return roomRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public RoomDto getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        return mapToDto(room);
    }

    public List<RoomDto> getAvailableRooms() {
        return roomRepository.findAvailableRooms()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<RoomDto> getVacantRooms() {
        return roomRepository.findVacantRooms()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public RoomDto createRoom(RoomDto request) {
        if (roomRepository.existsByRoomNumber(request.getRoomNumber())) {
            throw new RuntimeException("Room number " + request.getRoomNumber() + " already exists");
        }
        Room room = Room.builder()
                .roomNumber(request.getRoomNumber())
                .capacity(request.getCapacity())
                .occupiedCount(0)
                .floor(request.getFloor())
                .type(request.getType())
                .monthlyRent(request.getMonthlyRent())
                .description(request.getDescription())
                .build();
        return mapToDto(roomRepository.save(room));
    }

    @Transactional
    public RoomDto updateRoom(Long id, RoomDto request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        if (request.getCapacity() != null) room.setCapacity(request.getCapacity());
        if (request.getFloor() != null) room.setFloor(request.getFloor());
        if (request.getType() != null) room.setType(request.getType());
        if (request.getMonthlyRent() != null) room.setMonthlyRent(request.getMonthlyRent());
        if (request.getDescription() != null) room.setDescription(request.getDescription());
        return mapToDto(roomRepository.save(room));
    }

    @Transactional
    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        if (room.getOccupiedCount() > 0) {
            throw new RuntimeException("Cannot delete room with occupants");
        }
        roomRepository.delete(room);
    }

    public RoomDto mapToDto(Room room) {
        String occupancyStatus;
        if (room.isVacant()) {
            occupancyStatus = "VACANT";
        } else if (room.isFull()) {
            occupancyStatus = "FULL";
        } else {
            occupancyStatus = "PARTIAL";
        }

        return RoomDto.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .capacity(room.getCapacity())
                .occupiedCount(room.getOccupiedCount())
                .availableSlots(room.getAvailableSlots())
                .floor(room.getFloor())
                .type(room.getType())
                .monthlyRent(room.getMonthlyRent())
                .description(room.getDescription())
                .occupancyStatus(occupancyStatus)
                .build();
    }
}
