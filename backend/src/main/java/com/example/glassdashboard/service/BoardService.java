package com.example.glassdashboard.service;

import com.example.glassdashboard.entity.Board;
import com.example.glassdashboard.entity.User;
import com.example.glassdashboard.mapper.BoardMapper;
import com.example.glassdashboard.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BoardService {

   @Autowired
   private BoardMapper boardMapper;

   @Autowired
   private UserMapper userMapper;

   public Page<Board> getBoards(Pageable pageable) {
      int limit = pageable.getPageSize();
      long offset = pageable.getOffset();
      List<Board> content = boardMapper.findAllByOrderByCreatedAtDesc(limit, offset);
      long total = boardMapper.count();
      return new PageImpl<>(content, pageable, total);
   }

   public Board getBoard(Long id) {
      Board board = boardMapper.findById(id).orElseThrow(() -> new RuntimeException("Board not found"));
      board.setViewCount(board.getViewCount() + 1);
      boardMapper.update(board);
      return board;
   }

   public Board createBoard(Board board, Object principal) {
      User user = getUserFromPrincipal(principal);
      board.setAuthor(user);
      boardMapper.insert(board);
      return board;
   }

   public Board updateBoard(Long id, Board updatedBoard, Object principal) {
      Board board = boardMapper.findById(id).orElseThrow(() -> new RuntimeException("Board not found"));
      User user = getUserFromPrincipal(principal);

      if (!board.getAuthor().getId().equals(user.getId())) {
         throw new RuntimeException("Unauthorized");
      }

      board.setTitle(updatedBoard.getTitle());
      board.setContent(updatedBoard.getContent());
      boardMapper.update(board);
      return board;
   }

   public void deleteBoard(Long id, Object principal) {
      Board board = boardMapper.findById(id).orElseThrow(() -> new RuntimeException("Board not found"));
      User user = getUserFromPrincipal(principal);

      if (!board.getAuthor().getId().equals(user.getId())) {
         throw new RuntimeException("Unauthorized");
      }

      boardMapper.delete(id);
   }

   private User getUserFromPrincipal(Object principal) {
      String username;
      if (principal instanceof OAuth2User) {
         username = ((OAuth2User) principal).getAttribute("email");
      } else if (principal instanceof UserDetails) {
         username = ((UserDetails) principal).getUsername();
      } else {
         throw new RuntimeException("Unknown principal type");
      }
      return userMapper.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
   }
}
