package SunoSarkar.dto;

import SunoSarkar.enums.ComplainCategory;
import SunoSarkar.enums.ComplaintPriorty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ComplaintRequestDto {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private ComplainCategory category;

    private ComplaintPriorty priority;

    private String locationLink;

    @NotBlank(message = "City is required")
    private String city;

    private String ucCode;

    @NotBlank(message = "Area address is required")
    private String areaAddress;
}
