package com.example.glassdashboard.config;

import com.example.glassdashboard.service.CustomOAuth2UserService;
import com.example.glassdashboard.service.CustomUserDetailsService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

   @Autowired
   private CustomUserDetailsService customUserDetailsService;

   @Autowired
   private CustomOAuth2UserService customOAuth2UserService;

   @Bean
   public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
      http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                  .requestMatchers("/api/auth/**", "/login/**", "/oauth2/**").permitAll()
                  .anyRequest().authenticated())
            .formLogin(form -> form
                  .loginProcessingUrl("/api/auth/login")
                  .successHandler((request, response, authentication) -> {
                     response.setStatus(HttpServletResponse.SC_OK);
                     response.getWriter().write("{\"message\": \"Login successful\"}");
                  })
                  .failureHandler((request, response, exception) -> {
                     response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                     response.getWriter().write("{\"message\": \"Login failed\"}");
                  })
                  .permitAll())
            .oauth2Login(oauth2 -> oauth2
                  .userInfoEndpoint(userInfo -> userInfo
                        .userService(customOAuth2UserService))
                  .successHandler((request, response, authentication) -> {
                     response.sendRedirect("https://mydomain.com/dashboard"); // Redirect to frontend after Google login
                  }))
            .logout(logout -> logout
                  .logoutUrl("/api/auth/logout")
                  .logoutSuccessHandler((request, response, authentication) -> {
                     response.setStatus(HttpServletResponse.SC_OK);
                     response.getWriter().write("{\"message\": \"Logout successful\"}");
                  })
                  .invalidateHttpSession(true)
                  .deleteCookies("JSESSIONID"));

      return http.build();
   }

   @Bean
   public PasswordEncoder passwordEncoder() {
      return new BCryptPasswordEncoder();
   }

   @Bean
   public AuthenticationManager authenticationManager() {
      DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
      provider.setUserDetailsService(customUserDetailsService);
      provider.setPasswordEncoder(passwordEncoder());
      return new ProviderManager(provider);
   }

   @Bean
   public CorsConfigurationSource corsConfigurationSource() {
      CorsConfiguration configuration = new CorsConfiguration();
      configuration
            .setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://mydomain.com", "http://localhost",
                  "https://localhost:5173", "https://mydomain.com", "https://localhost"));
      configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
      configuration.setAllowedHeaders(Collections.singletonList("*"));
      configuration.setAllowCredentials(true);
      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      source.registerCorsConfiguration("/**", configuration);
      return source;
   }
}
