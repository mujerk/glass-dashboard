package com.example.glassdashboard.controller;

import com.example.glassdashboard.entity.DiaryEntry;
import com.example.glassdashboard.mapper.DiaryEntryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diary")
public class DiaryEntryController {

   @Autowired
   private DiaryEntryMapper diaryEntryMapper;

   @GetMapping
   public List<DiaryEntry> getAllEntries() {
      return diaryEntryMapper.findAll();
   }

   @PostMapping
   public DiaryEntry createEntry(@RequestBody DiaryEntry entry) {
      diaryEntryMapper.insert(entry);
      return entry;
   }

   @DeleteMapping("/{id}")
   public void deleteEntry(@PathVariable Long id) {
      diaryEntryMapper.delete(id);
   }
}
