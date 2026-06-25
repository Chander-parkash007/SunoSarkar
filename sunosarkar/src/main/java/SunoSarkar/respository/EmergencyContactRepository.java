package SunoSarkar.respository;

import SunoSarkar.entity.EmergencyContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface EmergencyContactRepository extends JpaRepository<EmergencyContact,Long> {
    List<EmergencyContact> findByCity(String city);

    List<EmergencyContact> findByCityOrCityIsNull(String city);
}
