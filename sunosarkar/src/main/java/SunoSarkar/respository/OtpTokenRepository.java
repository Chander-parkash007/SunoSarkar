package SunoSarkar.respository;

import SunoSarkar.entity.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {
Optional<OtpToken> findByEmailAndOtpTokenAndIsUsedFalse(String email, String optToken);

    void deleteByEmail(String email);

}