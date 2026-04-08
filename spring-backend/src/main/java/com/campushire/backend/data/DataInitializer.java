package com.campushire.backend.data;

import com.campushire.backend.model.ApplicationEntity;
import com.campushire.backend.model.Job;
import com.campushire.backend.model.Placement;
import com.campushire.backend.model.User;
import com.campushire.backend.repository.ApplicationRepository;
import com.campushire.backend.repository.JobRepository;
import com.campushire.backend.repository.PlacementRepository;
import com.campushire.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final PlacementRepository placementRepository;

    public DataInitializer(
            UserRepository userRepository,
            JobRepository jobRepository,
            ApplicationRepository applicationRepository,
            PlacementRepository placementRepository
    ) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.placementRepository = placementRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User alice = new User();
            alice.setName("Aisha Khan");
            alice.setEmail("aisha.khan@example.com");
            alice.setPhone("+91 98765 43210");
            alice.setRole("student");
            alice.setBranch("Computer Science");
            alice.setPasswordHash("secret");
            alice.setCreatedAt(LocalDateTime.now().minusDays(10));
            alice.setAvatar("https://via.placeholder.com/150");
            userRepository.save(alice);

            User ramesh = new User();
            ramesh.setName("Ramesh Patel");
            ramesh.setEmail("ramesh.patel@example.com");
            ramesh.setPhone("+91 91234 56789");
            ramesh.setRole("student");
            ramesh.setBranch("Information Technology");
            ramesh.setPasswordHash("secret");
            ramesh.setCreatedAt(LocalDateTime.now().minusDays(8));
            ramesh.setAvatar("https://via.placeholder.com/150");
            userRepository.save(ramesh);

            User admin = new User();
            admin.setName("Campus Admin");
            admin.setEmail("admin@campushire.com");
            admin.setRole("admin");
            admin.setPasswordHash("secret");
            admin.setCreatedAt(LocalDateTime.now().minusDays(30));
            admin.setAvatar("https://via.placeholder.com/150");
            userRepository.save(admin);
        }

        if (jobRepository.count() == 0) {
            Job frontend = new Job();
            frontend.setTitle("Senior Frontend Developer");
            frontend.setCompany("Tech Corp");
            frontend.setSalary("12-15 LPA");
            frontend.setLocation("Bangalore");
            frontend.setDescription("Looking for experienced React developers with strong TypeScript knowledge.");
            frontend.setSkills(Arrays.asList("React", "TypeScript", "Node.js"));
            frontend.setPosted(LocalDate.now().minusDays(5));
            frontend.setDeadline(LocalDate.now().plusDays(25));
            frontend.setApplicants(45);
            frontend.setStatus("active");
            frontend.setLogo("https://via.placeholder.com/100/2563eb/ffffff?text=TechCorp");
            jobRepository.save(frontend);

            Job fullstack = new Job();
            fullstack.setTitle("Full Stack Developer");
            fullstack.setCompany("CloudNine");
            fullstack.setSalary("10-12 LPA");
            fullstack.setLocation("Pune");
            fullstack.setDescription("Join our team to build scalable cloud applications.");
            fullstack.setSkills(Arrays.asList("React", "Node.js", "MongoDB", "AWS"));
            fullstack.setPosted(LocalDate.now().minusDays(7));
            fullstack.setDeadline(LocalDate.now().plusDays(20));
            fullstack.setApplicants(32);
            fullstack.setStatus("active");
            fullstack.setLogo("https://via.placeholder.com/100/f59e0b/ffffff?text=CloudNine");
            jobRepository.save(fullstack);
        }

        if (applicationRepository.count() == 0) {
            ApplicationEntity app1 = new ApplicationEntity();
            app1.setStudentId(1L);
            app1.setJobId(1L);
            app1.setStatus("shortlisted");
            app1.setDate(LocalDate.now().minusDays(2));
            app1.setResume("resume-aisha.pdf");
            app1.setCoverLetter("Excited to apply for this role.");
            applicationRepository.save(app1);
        }

        if (placementRepository.count() == 0) {
            Placement placement = new Placement();
            placement.setStudentName("Aisha Khan");
            placement.setCompanyName("Tech Corp");
            placement.setPosition("Senior Developer");
            placement.setSalary("14 LPA");
            placement.setDate(LocalDate.now().minusDays(3));
            placementRepository.save(placement);
        }
    }
}
