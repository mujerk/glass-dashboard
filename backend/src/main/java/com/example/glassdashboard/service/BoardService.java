package com.example.glassdashboard.service;

import com.example.glassdashboard.entity.Board;
import com.example.glassdashboard.entity.User;
import com.example.glassdashboard.repository.BoardRepository;
import com.example.glassdashboard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class BoardService {

   @Autowired
   private BoardRepository boardRepository;

   @Autowired
   private UserRepository userRepository;

   public Page<Board> getBoards(Pageable pageable) {
      return boardRepository.findAllByOrderByCreatedAtDesc(pageable);
   }

   public Board getBoard(Long id) {
      Board board = boardRepository.findById(id).orElseThrow(() -> new RuntimeException("Board not found"));
      board.setViewCount(board.getViewCount() + 1);
      return boardRepository.save(board);
   }

   public Board createBoard(Board board, Object principal) {
      User user = getUserFromPrincipal(principal);
      board.setAuthor(user);
      return boardRepository.save(board);
   }

   public Board updateBoard(Long id, Board updatedBoard, Object principal) {
      Board board = boardRepository.findById(id).orElseThrow(() -> new RuntimeException("Board not found"));
      User user = getUserFromPrincipal(principal);

      if (!board.getAuthor().getId().equals(user.getId())) {
         throw new RuntimeException("Unauthorized");
      }

      board.setTitle(updatedBoard.getTitle());
      board.setContent(updatedBoard.getContent());
      return boardRepository.save(board);
   }

   public void deleteBoard(Long id, Object principal) {
      Board board = boardRepository.findById(id).orElseThrow(() -> new RuntimeException("Board not found"));
      User user = getUserFromPrincipal(principal);

      if (!board.getAuthor().getId().equals(user.getId())) {
         throw new RuntimeException("Unauthorized");
      }

      boardRepository.delete(board);
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
      return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
   }
}
