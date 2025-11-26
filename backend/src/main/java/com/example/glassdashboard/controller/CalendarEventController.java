package com.example.glassdashboard.controller;

import com.example.glassdashboard.entity.CalendarEvent;
import com.example.glassdashboard.repository.CalendarEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class CalendarEventController {

   @Autowired
   private CalendarEventRepository calendarEventRepository;

   @GetMapping
   public List<CalendarEvent> getAllEvents() {
      return calendarEventRepository.findAll();
   }

   @PostMapping
   public CalendarEvent createEvent(@RequestBody CalendarEvent event) {
      return calendarEventRepository.save(event);
   }

   @GetMapping("/{id}")
   public CalendarEvent getEventById(@PathVariable Long id) {
      return calendarEventRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Event not found with id " + id));
   }

   @PutMapping("/{id}")
   public CalendarEvent updateEvent(@PathVariable Long id, @RequestBody CalendarEvent eventDetails) {
      return calendarEventRepository.findById(id).map(event -> {
         event.setTitle(eventDetails.getTitle());
         event.setStartDate(eventDetails.getStartDate());
         event.setEndDate(eventDetails.getEndDate());
         event.setColor(eventDetails.getColor());
         return calendarEventRepository.save(event);
      }).orElseThrow(() -> new RuntimeException("Event not found with id " + id));
   }

   @DeleteMapping("/{id}")
   public void deleteEvent(@PathVariable Long id) {
      calendarEventRepository.deleteById(id);
   }
}
