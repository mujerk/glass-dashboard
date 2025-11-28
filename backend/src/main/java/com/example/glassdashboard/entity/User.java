package com.example.glassdashboard.entity;

import lombok.Data;

@Data
public class User {

   private Long id;

   private String username; // ID

   private String password;

   private String name;

   private String gender;

   private String provider; // LOCAL, GOOGLE

   private String providerId;

   private String role; // ROLE_USER
}
