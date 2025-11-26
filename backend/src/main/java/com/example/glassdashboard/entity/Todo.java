package com.example.glassdashboard.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "todos")
public class Todo {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   private String text;

   private Boolean completed;
}
