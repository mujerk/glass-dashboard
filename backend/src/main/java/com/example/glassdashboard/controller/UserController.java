package com.example.glassdashboard.controller;

import com.example.glassdashboard.entity.User;
import com.example.glassdashboard.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/user")
public class UserController {

   private static final Logger logger = LoggerFactory.getLogger(UserController.class);

   @Autowired
   private UserMapper userMapper;

   @Autowired
   private PasswordEncoder passwordEncoder;

   @GetMapping("/me")
   public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal Object principal) {
      String username;
      if (principal instanceof UserDetails) {
         username = ((UserDetails) principal).getUsername();
      } else if (principal instanceof OAuth2User) {
         username = ((OAuth2User) principal).getAttribute("email");
      } else {
         return ResponseEntity.status(401).build();
      }

      System.out.println("UserController: Fetching user with username=" + username);
      System.err.println("DEBUG: UserController: Principal type = " + principal.getClass().getName());
      System.err.println("DEBUG: UserController: Fetching user with username=" + username);

      return userMapper.findByUsername(username)
            .map(user -> {
               user.setPassword(null); // Don't return password
               return ResponseEntity.ok(user);
            })
            .orElse(ResponseEntity.notFound().build());
   }

   @PutMapping("/update")
   public ResponseEntity<?> updateUser(@AuthenticationPrincipal Object principal, @RequestBody User userDetails) {
      String username;
      if (principal instanceof UserDetails) {
         username = ((UserDetails) principal).getUsername();
      } else if (principal instanceof OAuth2User) {
         username = ((OAuth2User) principal).getAttribute("email");
      } else {
         return ResponseEntity.status(401).build();
      }

      return userMapper.findByUsername(username)
            .map(user -> {
               user.setName(userDetails.getName());
               user.setGender(userDetails.getGender());
               if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                  user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
               }
               userMapper.update(user);
               return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
            })
            .orElse(ResponseEntity.notFound().build());
   }

   @DeleteMapping("/delete")
   public ResponseEntity<?> deleteUser(@AuthenticationPrincipal Object principal) {
      String username;
      if (principal instanceof UserDetails) {
         username = ((UserDetails) principal).getUsername();
      } else if (principal instanceof OAuth2User) {
         username = ((OAuth2User) principal).getAttribute("email");
      } else {
         return ResponseEntity.status(401).build();
      }

      return userMapper.findByUsername(username)
            .map(user -> {
               userMapper.delete(user.getId());
               return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
            })
            .orElse(ResponseEntity.notFound().build());
   }
}
