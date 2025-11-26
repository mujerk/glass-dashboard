package com.example.glassdashboard.repository;

import com.example.glassdashboard.entity.DiaryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiaryEntryRepository extends JpaRepository<DiaryEntry, Long> {
}
