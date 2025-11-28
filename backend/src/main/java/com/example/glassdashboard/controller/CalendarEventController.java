package com.example.glassdashboard.controller;

import com.example.glassdashboard.entity.CalendarEvent;
import com.example.glassdashboard.mapper.CalendarEventMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class CalendarEventController {

   @Autowired
   private CalendarEventMapper calendarEventMapper;

   @GetMapping
   public List<CalendarEvent> getAllEvents() {
      return calendarEventMapper.findAll();
   }

   @PostMapping
   public CalendarEvent createEvent(@RequestBody CalendarEvent event) {
      calendarEventMapper.insert(event);
      return event;
   }

   @GetMapping("/{id}")
   public CalendarEvent getEventById(@PathVariable Long id) {
      return calendarEventMapper.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found with id " + id));
   }

   @PutMapping("/{id}")
   public CalendarEvent updateEvent(@PathVariable Long id, @RequestBody CalendarEvent eventDetails) {
      return calendarEventMapper.findById(id).map(event -> {
         event.setTitle(eventDetails.getTitle());
         event.setStartDate(eventDetails.getStartDate());
         event.setEndDate(eventDetails.getEndDate());
         event.setColor(eventDetails.getColor());
         calendarEventMapper.update(event);
         return event;
      }).orElseThrow(() -> new RuntimeException("Event not found with id " + id));
   }

   @DeleteMapping("/{id}")
   public void deleteEvent(@PathVariable Long id) {
      calendarEventMapper.delete(id);
   }
}
