package SunoSarkar.respository;

import SunoSarkar.entity.ComplaintUpVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComplainUpVoteRespository extends JpaRepository<ComplaintUpVote, Long> {
Boolean existsByComplaintIdAndUserId(Long complaintId, Long userId);
Integer countByComplaintId(Long complaintId);
}
