package com.example.glassdashboard.controller;

import com.example.glassdashboard.mapper.BoardMapper;
import com.example.glassdashboard.mapper.DiaryEntryMapper;
import com.example.glassdashboard.mapper.TodoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

   @Autowired
   private BoardMapper boardMapper;

   @Autowired
   private DiaryEntryMapper diaryEntryMapper;

   @Autowired
   private TodoMapper todoMapper;

   @GetMapping("/count")
   public Map<String, Object> getNotificationCount() {
      LocalDateTime since = LocalDateTime.now().minusHours(24);

      int boardCount = boardMapper.countRecent(since);
      int diaryCount = diaryEntryMapper.countRecent(since);
      int todoCount = todoMapper.countRecent(since);

      int totalCount = boardCount + diaryCount + todoCount;

      Map<String, Object> response = new HashMap<>();
      response.put("count", totalCount);
      response.put("details", Map.of(
            "board", boardCount,
            "diary", diaryCount,
            "todo", todoCount));

      return response;
   }
}
