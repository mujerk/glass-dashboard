package com.example.glassdashboard.controller;

import com.example.glassdashboard.entity.Todo;
import com.example.glassdashboard.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

   @Autowired
   private TodoRepository todoRepository;

   @GetMapping
   public List<Todo> getAllTodos() {
      return todoRepository.findAll();
   }

   @PostMapping
   public Todo createTodo(@RequestBody Todo todo) {
      return todoRepository.save(todo);
   }

   @PutMapping("/{id}")
   public Todo updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
      return todoRepository.findById(id).map(todo -> {
         todo.setText(todoDetails.getText());
         todo.setCompleted(todoDetails.getCompleted());
         return todoRepository.save(todo);
      }).orElseThrow(() -> new RuntimeException("Todo not found with id " + id));
   }

   @DeleteMapping("/{id}")
   public void deleteTodo(@PathVariable Long id) {
      todoRepository.deleteById(id);
   }
}
