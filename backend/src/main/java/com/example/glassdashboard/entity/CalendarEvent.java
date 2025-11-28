package com.example.glassdashboard.entity;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CalendarEvent {

   private Long id;

   private String title;

   private LocalDate startDate;

   private LocalDate endDate;

   private String color;
}
