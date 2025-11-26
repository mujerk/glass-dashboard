package com.example.glassdashboard.controller;

import com.example.glassdashboard.entity.DiaryEntry;
import com.example.glassdashboard.repository.DiaryEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diary")
public class DiaryEntryController {

   @Autowired
   private DiaryEntryRepository diaryEntryRepository;

   @GetMapping
   public List<DiaryEntry> getAllEntries() {
      return diaryEntryRepository.findAll();
   }

   @PostMapping
   public DiaryEntry createEntry(@RequestBody DiaryEntry entry) {
      return diaryEntryRepository.save(entry);
   }

   @DeleteMapping("/{id}")
   public void deleteEntry(@PathVariable Long id) {
      diaryEntryRepository.deleteById(id);
   }
}
