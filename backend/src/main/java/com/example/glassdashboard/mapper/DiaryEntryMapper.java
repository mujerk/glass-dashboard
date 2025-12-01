package com.example.glassdashboard.mapper;

import com.example.glassdashboard.entity.DiaryEntry;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Optional;

@Mapper
public interface DiaryEntryMapper {
   void insert(DiaryEntry entry);

   void update(DiaryEntry entry);

   void delete(Long id);

   Optional<DiaryEntry> findById(Long id);

   List<DiaryEntry> findAll();

   int countRecent(java.time.LocalDateTime since);
}
