package com.example.glassdashboard.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(unique = true)
   private String username; // ID

   private String password;

   private String name;

   private String gender;

   private String provider; // LOCAL, GOOGLE

   private String providerId;

   private String role; // ROLE_USER
}
