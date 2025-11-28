package com.example.glassdashboard.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Board {

   private Long id;

   private String title;

   private String content;

   private User author;

   private LocalDateTime createdAt;

   private int viewCount = 0;
}
