package com.example.glassdashboard.controller;

import com.example.glassdashboard.entity.Todo;
import com.example.glassdashboard.mapper.TodoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

   @Autowired
   private TodoMapper todoMapper;

   @GetMapping
   public List<Todo> getAllTodos() {
      return todoMapper.findAll();
   }

   @PostMapping
   public Todo createTodo(@RequestBody Todo todo) {
      todo.setCreatedAt(java.time.LocalDateTime.now());
      todoMapper.insert(todo);
      return todo;
   }

   @PutMapping("/{id}")
   public Todo updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
      return todoMapper.findById(id).map(todo -> {
         todo.setText(todoDetails.getText());
         todo.setCompleted(todoDetails.getCompleted());
         todoMapper.update(todo);
         return todo;
      }).orElseThrow(() -> new RuntimeException("Todo not found with id " + id));
   }

   @DeleteMapping("/{id}")
   public void deleteTodo(@PathVariable Long id) {
      todoMapper.delete(id);
   }
}
