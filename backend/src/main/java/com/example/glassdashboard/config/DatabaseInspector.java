package com.example.glassdashboard.config;

import com.example.glassdashboard.mapper.UserMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseInspector {

   @Bean
   public CommandLineRunner inspect(UserMapper userMapper) {
      return args -> {
         System.err.println("DEBUG: --- Database Users ---");
         userMapper.findAll().forEach(user -> {
            System.err.println("DEBUG: User: " + user.getUsername() + " / " + user.getProvider());
         });
         System.err.println("DEBUG: -----------------------");
      };
   }
}
