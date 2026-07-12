package SunoSarkar.service;

import SunoSarkar.entity.EmergencyContact;
import SunoSarkar.respository.EmergencyContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmergencyService {
    @Autowired
    private EmergencyContactRepository emergencyContactRepository;
    @Cacheable(value = "emergencyService", key = "#city")
    public List<EmergencyContact> getByCityAndNational(String city){
        return emergencyContactRepository.findByCityOrCityIsNull(city);
    }
    public EmergencyContact save(EmergencyContact contact){
        return emergencyContactRepository.save(contact);
    }
}
