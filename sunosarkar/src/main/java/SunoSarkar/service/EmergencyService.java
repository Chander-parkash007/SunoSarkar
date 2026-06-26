package SunoSarkar.service;

import SunoSarkar.entity.EmergencyContact;
import SunoSarkar.respository.EmergencyContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmergencyService {
    @Autowired
    private EmergencyContactRepository emergencyContactRepository;
    public List<EmergencyContact> getByCity(String city){
        return emergencyContactRepository.findByCity(city);
    }
    public EmergencyContact save(EmergencyContact contact){
        return emergencyContactRepository.save(contact);
    }
}
