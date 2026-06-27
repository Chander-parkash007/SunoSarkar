package SunoSarkar.respository;

import SunoSarkar.entity.Complaint;
import SunoSarkar.enums.ComplaintStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByUserId(Long userId);
    List<Complaint> findByUcCode(String ucCode);
    List<Complaint> findByCity(String city);
    List<Complaint> findByStatus(ComplaintStatus status);
    List<Complaint> findByUcCodeAndStatus(String ucCode, ComplaintStatus status);
    List<Complaint> findByCityOrderByCreatedAtDesc(String city);
    List<Complaint> findAllByOrderByCreatedAtDesc();
    Page<Complaint> findByCityOrderByCreatedAtDesc(String city, Pageable pageable);
    Page<Complaint> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Complaint> findByUcCodeOrderByCreatedAtDesc(String ucCode, Pageable pageable);
}
