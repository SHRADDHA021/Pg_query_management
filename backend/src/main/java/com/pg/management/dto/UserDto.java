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
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private User.Role role;
    private User.UserStatus status;
    private String phone;
    private String address;
    private String emergencyContact;
    private LocalDate joinedDate;
    private Long roomId;
    private String roomNumber;
    private Integer floor;
    private String roomType;
}
