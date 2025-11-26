package com.example.glassdashboard.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "calendar_events")
public class CalendarEvent {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   private String title;

   private LocalDate startDate;

   private LocalDate endDate;

   private String color;
}
