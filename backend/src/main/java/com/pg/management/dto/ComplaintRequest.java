package com.pg.management.dto;

import com.pg.management.model.Complaint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ComplaintRequest {
    @NotNull(message = "Category is required")
    private Complaint.ComplaintCategory category;

    @NotBlank(message = "Description is required")
    private String description;
}
