package com.example.glassdashboard.config;

import com.example.glassdashboard.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseInspector {

   @Bean
   public CommandLineRunner inspect(UserRepository userRepository) {
      return args -> {
         System.err.println("DEBUG: --- Database Users ---");
         userRepository.findAll().forEach(user -> {
            System.err.println("DEBUG: User: " + user.getUsername() + " / " + user.getProvider());
         });
         System.err.println("DEBUG: -----------------------");
      };
   }
}
