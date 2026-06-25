package SunoSarkar.dto;

import SunoSarkar.enums.ComplainCategory;
import SunoSarkar.enums.ComplaintPriorty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ComplaintRequestDto {
    @NotNull(message = "Complaint title is required")
    private String title;
    @NotNull(message = "Complaint description is required")
    private String description;
    @NotBlank(message = "Complaint category is required")
    private ComplainCategory comaplaintCategory;
    private ComplaintPriorty priorty = ComplaintPriorty.NORMAL;
    private String locationLink;
    private String ucCode;
    @NotNull(message = "City of complaint is required")
    private String city;
    @NotNull(message = "Complaint area address is required")
    private String complaintAreaAddress;
}
