package SunoSarkar.respository;

import SunoSarkar.entity.ComplaintMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintMessageRepository extends JpaRepository<ComplaintMessage,Long> {
    List<ComplaintMessage> findByComplaintIdOrderBySentAtAsc(long complaintId);
}
