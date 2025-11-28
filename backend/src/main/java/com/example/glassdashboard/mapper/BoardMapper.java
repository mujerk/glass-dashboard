package com.example.glassdashboard.mapper;

import com.example.glassdashboard.entity.Board;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.Optional;

@Mapper
public interface BoardMapper {
   void insert(Board board);

   void update(Board board);

   void delete(Long id);

   Optional<Board> findById(Long id);

   List<Board> findAllByOrderByCreatedAtDesc(@Param("limit") int limit, @Param("offset") long offset);

   long count();
}
