package SunoSarkar.respository;

import SunoSarkar.entity.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {

    // "used" field name (not "isUsed") — matches OtpToken.used
    Optional<OtpToken> findByEmailAndOtpTokenAndUsedFalse(String email, String otpToken);

    @Modifying
    @Transactional
    void deleteByEmail(String email);
}
