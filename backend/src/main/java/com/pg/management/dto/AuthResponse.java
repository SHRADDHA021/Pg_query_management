package com.pg.management.dto;

import com.pg.management.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String name;
    private String username;
    private User.Role role;
    private User.UserStatus status;
    // Room info
    private String roomNumber;
    private Integer floor;
    private String roomType;
    // Personal info
    private String phone;
    private String address;
    private String emergencyContact;
    private Integer age;
    private String rentStatus;
    private LocalDate joinedDate;
}
