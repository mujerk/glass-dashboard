package com.example.glassdashboard.mapper;

import com.example.glassdashboard.entity.User;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Optional;

@Mapper
public interface UserMapper {
   void insert(User user);

   void update(User user);

   void delete(Long id);

   Optional<User> findById(Long id);

   Optional<User> findByUsername(String username);

   boolean existsByUsername(String username);

   List<User> findAll();
}
