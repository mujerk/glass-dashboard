package com.example.glassdashboard.controller;

import com.example.glassdashboard.entity.Board;
import com.example.glassdashboard.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/board")
public class BoardController {

   @Autowired
   private BoardService boardService;

   @GetMapping
   public Page<Board> getBoards(@PageableDefault(size = 10) Pageable pageable) {
      return boardService.getBoards(pageable);
   }

   @GetMapping("/{id}")
   public Board getBoard(@PathVariable Long id) {
      return boardService.getBoard(id);
   }

   @PostMapping
   public Board createBoard(@RequestBody Board board, @AuthenticationPrincipal Object principal) {
      return boardService.createBoard(board, principal);
   }

   @PutMapping("/{id}")
   public Board updateBoard(@PathVariable Long id, @RequestBody Board board,
         @AuthenticationPrincipal Object principal) {
      return boardService.updateBoard(id, board, principal);
   }

   @DeleteMapping("/{id}")
   public ResponseEntity<?> deleteBoard(@PathVariable Long id, @AuthenticationPrincipal Object principal) {
      boardService.deleteBoard(id, principal);
      return ResponseEntity.ok().build();
   }
}
