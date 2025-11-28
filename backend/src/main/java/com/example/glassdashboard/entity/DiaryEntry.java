package com.example.glassdashboard.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DiaryEntry {

   private Long id;

   private LocalDateTime date;

   private String content;
}
