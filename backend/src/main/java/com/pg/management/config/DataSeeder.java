package com.pg.management.config;

import com.pg.management.model.Room;
import com.pg.management.model.User;
import com.pg.management.repository.RoomRepository;
import com.pg.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed Admin user
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .name("Admin")
                    .username("admin")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(User.Role.ADMIN)
                    .status(User.UserStatus.VERIFIED)
                    .phone("9999999999")
                    .joinedDate(LocalDate.now())
                    .build();
            userRepository.save(admin);
            log.info("Default admin user created: admin / Admin@123");
        }

        // Seed some rooms if none exist
        if (roomRepository.count() == 0) {
            Room[] rooms = {
                Room.builder().roomNumber("101").capacity(2).occupiedCount(0).floor(1).type(Room.RoomType.DOUBLE).monthlyRent(5000.0).description("Ground floor, garden view").build(),
                Room.builder().roomNumber("102").capacity(2).occupiedCount(0).floor(1).type(Room.RoomType.DOUBLE).monthlyRent(5000.0).description("Ground floor").build(),
                Room.builder().roomNumber("103").capacity(1).occupiedCount(0).floor(1).type(Room.RoomType.SINGLE).monthlyRent(7000.0).description("Single occupancy, AC").build(),
                Room.builder().roomNumber("201").capacity(3).occupiedCount(0).floor(2).type(Room.RoomType.TRIPLE).monthlyRent(4000.0).description("First floor").build(),
                Room.builder().roomNumber("202").capacity(2).occupiedCount(0).floor(2).type(Room.RoomType.DOUBLE).monthlyRent(5000.0).description("First floor, city view").build(),
                Room.builder().roomNumber("203").capacity(1).occupiedCount(0).floor(2).type(Room.RoomType.SINGLE).monthlyRent(7500.0).description("Single occupancy, AC, city view").build(),
                Room.builder().roomNumber("301").capacity(3).occupiedCount(0).floor(3).type(Room.RoomType.TRIPLE).monthlyRent(4000.0).description("Second floor").build(),
                Room.builder().roomNumber("302").capacity(2).occupiedCount(0).floor(3).type(Room.RoomType.DOUBLE).monthlyRent(5500.0).description("Second floor, balcony").build(),
            };
            for (Room room : rooms) {
                roomRepository.save(room);
            }
            log.info("Sample rooms created");
        }
    }
}
