package com.pg.management.service;

import com.pg.management.dto.*;
import com.pg.management.model.User;
import com.pg.management.repository.UserRepository;
import com.pg.management.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtUtil.generateToken(userDetails);
            return buildAuthResponse(token, user);

        } catch (DisabledException e) {
            throw new RuntimeException("Account is pending verification. Please wait for admin approval.");
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid username or password.");
        }
    }

    @Transactional
    public AuthResponse register(UserDto dto, String password) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username already taken. Please choose a different username.");
        }

        User student = User.builder()
                .name(dto.getName())
                .username(dto.getUsername())
                .password(passwordEncoder.encode(password))
                .role(User.Role.STUDENT)
                .status(User.UserStatus.PENDING)
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .emergencyContact(dto.getEmergencyContact())
                .age(dto.getAge())
                .rentStatus("Pending")
                .joinedDate(LocalDate.now())
                .build();

        userRepository.save(student);

        // Return response without token – student must wait for admin verification
        return AuthResponse.builder()
                .id(student.getId())
                .name(student.getName())
                .username(student.getUsername())
                .role(student.getRole())
                .status(student.getStatus())
                .build();
    }

    public UserDto getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserDto(user);
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .role(user.getRole())
                .status(user.getStatus())
                .phone(user.getPhone())
                .address(user.getAddress())
                .emergencyContact(user.getEmergencyContact())
                .age(user.getAge())
                .rentStatus(user.getRentStatus())
                .joinedDate(user.getJoinedDate())
                .roomNumber(user.getRoom() != null ? user.getRoom().getRoomNumber() : null)
                .floor(user.getRoom() != null ? user.getRoom().getFloor() : null)
                .roomType(user.getRoom() != null ? user.getRoom().getType().name() : null)
                .build();
    }

    public UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .role(user.getRole())
                .status(user.getStatus())
                .phone(user.getPhone())
                .address(user.getAddress())
                .emergencyContact(user.getEmergencyContact())
                .age(user.getAge())
                .rentStatus(user.getRentStatus())
                .joinedDate(user.getJoinedDate())
                .roomId(user.getRoom() != null ? user.getRoom().getId() : null)
                .roomNumber(user.getRoom() != null ? user.getRoom().getRoomNumber() : null)
                .floor(user.getRoom() != null ? user.getRoom().getFloor() : null)
                .roomType(user.getRoom() != null ? user.getRoom().getType().name() : null)
                .build();
    }
}
