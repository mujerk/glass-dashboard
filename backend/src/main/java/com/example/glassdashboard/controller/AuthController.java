package com.example.glassdashboard.controller;

import com.example.glassdashboard.entity.User;
import com.example.glassdashboard.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

   @Autowired
   private UserMapper userMapper;

   @Autowired
   private PasswordEncoder passwordEncoder;

   @PostMapping("/signup")
   public ResponseEntity<?> signup(@RequestBody User user) {
      if (userMapper.findByUsername(user.getUsername()).isPresent()) {
         return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
      }

      user.setPassword(passwordEncoder.encode(user.getPassword()));
      user.setRole("ROLE_USER");
      user.setProvider("LOCAL");
      userMapper.insert(user);

      return ResponseEntity.ok(Map.of("message", "User registered successfully"));
   }
}
