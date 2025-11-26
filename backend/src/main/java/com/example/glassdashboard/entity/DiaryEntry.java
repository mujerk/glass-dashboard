package com.example.glassdashboard.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "diary_entries")
public class DiaryEntry {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   private LocalDateTime date;

   @Column(columnDefinition = "TEXT")
   private String content;
}
