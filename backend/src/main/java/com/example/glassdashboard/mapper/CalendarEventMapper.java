package com.example.glassdashboard.mapper;

import com.example.glassdashboard.entity.CalendarEvent;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Optional;

@Mapper
public interface CalendarEventMapper {
   void insert(CalendarEvent event);

   void update(CalendarEvent event);

   void delete(Long id);

   Optional<CalendarEvent> findById(Long id);

   List<CalendarEvent> findAll();
}
