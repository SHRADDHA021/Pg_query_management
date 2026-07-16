package com.pg.management.controller;

import com.pg.management.dto.*;
import com.pg.management.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Auth endpoints for registration and login")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login and get JWT token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/register")
    @Operation(summary = "Student self-registration (creates PENDING account)")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody Map<String, Object> body) {
        UserDto dto = UserDto.builder()
                .name((String) body.get("name"))
                .username((String) body.get("username"))
                .phone((String) body.get("phone"))
                .address((String) body.get("address"))
                .emergencyContact((String) body.get("emergencyContact"))
                .age(body.get("age") != null ? Integer.parseInt(body.get("age").toString()) : null)
                .build();
        String password = (String) body.get("password");
        AuthResponse response = authService.register(dto, password);
        return ResponseEntity.ok(ApiResponse.success(
                "Registration successful! Your account is pending admin approval.", response));
    }

    @GetMapping("/profile")
    @Operation(summary = "Get currently logged-in user's fresh profile data")
    public ResponseEntity<ApiResponse<UserDto>> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        UserDto profile = authService.getProfile(username);
        return ResponseEntity.ok(ApiResponse.success("Profile data", profile));
    }
}
