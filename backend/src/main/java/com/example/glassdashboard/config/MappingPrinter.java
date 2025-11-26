package com.example.glassdashboard.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@Configuration
public class MappingPrinter {

   @Bean
   public CommandLineRunner printMappings(ApplicationContext context) {
      return args -> {
         System.err.println("DEBUG: --- Request Mappings ---");
         RequestMappingHandlerMapping mapping = context.getBean(RequestMappingHandlerMapping.class);
         mapping.getHandlerMethods().forEach((key, value) -> {
            System.err.println("DEBUG: Mapping: " + key + " -> " + value);
         });
         System.err.println("DEBUG: ------------------------");
      };
   }
}
