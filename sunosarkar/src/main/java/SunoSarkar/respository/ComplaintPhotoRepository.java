package SunoSarkar.respository;

import SunoSarkar.entity.ComplaintPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintPhotoRepository extends JpaRepository<ComplaintPhoto,Long> {
    List<ComplaintPhoto> findByComplaintId(Long complaintId);
}
