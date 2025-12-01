package com.example.glassdashboard.entity;

import lombok.Data;

@Data
public class Todo {

   private Long id;

   private String text;

   private Boolean completed;

   private java.time.LocalDateTime createdAt;
}
