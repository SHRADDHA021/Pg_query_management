package com.pg.management.service;

import com.pg.management.dto.*;
import com.pg.management.model.User;
import com.pg.management.repository.UserRepository;
import com.pg.management.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Transactional
    public UserDto register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : User.Role.STUDENT)
                .status(User.UserStatus.PENDING)
                .phone(request.getPhone())
                .address(request.getAddress())
                .emergencyContact(request.getEmergencyContact())
                .joinedDate(LocalDate.now())
                .build();

        User savedUser = userRepository.save(user);
        log.info("New user registered: {} with role {}", savedUser.getEmail(), savedUser.getRole());

        // Send welcome email
        try {
            emailService.sendRegistrationEmail(savedUser.getEmail(), savedUser.getName());
        } catch (Exception e) {
            log.warn("Failed to send registration email to {}: {}", savedUser.getEmail(), e.getMessage());
        }

        return mapToUserDto(savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtUtil.generateToken(userDetails);

            return AuthResponse.builder()
                    .token(token)
                    .type("Bearer")
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .status(user.getStatus())
                    .roomNumber(user.getRoom() != null ? user.getRoom().getRoomNumber() : null)
                    .build();

        } catch (DisabledException e) {
            throw new RuntimeException("Account is pending verification. Please wait for admin approval.");
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid email or password.");
        }
    }

    public UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .phone(user.getPhone())
                .address(user.getAddress())
                .emergencyContact(user.getEmergencyContact())
                .joinedDate(user.getJoinedDate())
                .roomId(user.getRoom() != null ? user.getRoom().getId() : null)
                .roomNumber(user.getRoom() != null ? user.getRoom().getRoomNumber() : null)
                .floor(user.getRoom() != null ? user.getRoom().getFloor() : null)
                .roomType(user.getRoom() != null ? user.getRoom().getType().name() : null)
                .build();
    }
}
