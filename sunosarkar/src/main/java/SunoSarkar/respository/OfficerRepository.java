package SunoSarkar.respository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import SunoSarkar.entity.Officer;
import SunoSarkar.enums.Roles;

@Repository
public interface

OfficerRepository extends JpaRepository<Officer,Long> {

    Optional<Officer> findByEmail(String email);

    Optional<Officer> findByCnic(String cnic);

    Boolean existsByEmail(String email);

    Boolean existsByCnic(String cnic);

    List<Officer> findByCity(String city);

    List<Officer> findByUcCode(String ucCode);

    List<Officer> findByRole(Roles roles);
}
