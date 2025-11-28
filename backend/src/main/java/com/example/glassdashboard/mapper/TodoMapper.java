package com.example.glassdashboard.mapper;

import com.example.glassdashboard.entity.Todo;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Optional;

@Mapper
public interface TodoMapper {
   void insert(Todo todo);

   void update(Todo todo);

   void delete(Long id);

   Optional<Todo> findById(Long id);

   List<Todo> findAll();
}
