package com.example.glassdashboard.config;

import com.example.glassdashboard.mapper.UserMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseInspector {

   @Bean
   public CommandLineRunner inspect(org.springframework.jdbc.core.JdbcTemplate jdbcTemplate) {
      return args -> {
         try {
            jdbcTemplate.execute("ALTER TABLE todos ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
            System.err.println("DEBUG: Added created_at column to todos table.");
         } catch (Exception e) {
            System.err.println("DEBUG: created_at column already exists in todos table or error: " + e.getMessage());
         }

         try {
            jdbcTemplate.execute("ALTER TABLE boards ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
            System.err.println("DEBUG: Added created_at column to boards table.");
         } catch (Exception e) {
            // Ignore if exists
         }

         try {
            jdbcTemplate.execute("ALTER TABLE boards ADD COLUMN view_count INT DEFAULT 0");
            System.err.println("DEBUG: Added view_count column to boards table.");
         } catch (Exception e) {
            // Ignore if exists
         }

         try {
            jdbcTemplate.execute("ALTER TABLE diary_entries ADD COLUMN date TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
            System.err.println("DEBUG: Added date column to diary_entries table.");
         } catch (Exception e) {
            // Ignore if exists
         }

      };
   }
}
