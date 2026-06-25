package SunoSarkar.respository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import SunoSarkar.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByCnic(String cnic);

    Boolean existsByEmail(String email);

    Boolean existsByCnic(String cnic);

}
