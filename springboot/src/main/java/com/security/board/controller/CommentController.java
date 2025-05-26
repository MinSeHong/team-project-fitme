package com.security.board.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.security.board.dto.AccountDto;
import com.security.board.dto.BoardCommentDto;
import com.security.board.dto.CommentLikeDto;
import com.security.board.dto.CommentReportDto;
import com.security.board.service.CommentService;
import com.security.util.JWTOkens;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin
@RequestMapping("/api/v1")
public class CommentController {
	
private CommentService commentService;
	
	public CommentController(CommentService commentService) {
		this.commentService = commentService;
	}
	
	//특정 게시글에 대한 댓글 목록 조회
	@GetMapping("/comments/{bno}")
	public ResponseEntity<List<BoardCommentDto>> commentAllList(@PathVariable String bno){
		
		List<BoardCommentDto> commentList = commentService.commentList(bno);
		
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(commentList);
	}
	
	//댓글 등록
	@PostMapping("/comments")
	public ResponseEntity<String> commentSave(@RequestBody BoardCommentDto dto){
		
		System.out.println(dto);
		
		String message = "";
		
		int flag = 0;
		
		flag = commentService.commentPost(dto);
		
		if(flag == 0) message = "댓글 작성에 실패했습니다.";
		
		message="댓글 작성에 성공하였습니다.";
		
		System.out.println(message);
		
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(message);
	}
	
	//댓글 삭제
	@DeleteMapping("/comments/{bcno}")
	public ResponseEntity<String> commentDelete(@PathVariable String bcno, HttpServletRequest request) {
		
		String token = request.getHeader("Authorization");
		Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
		String accountNo = payload.get("sub").toString();
		
		String message = "";
		int flag = 0;
		
		BoardCommentDto dto = commentService.commentOne(bcno);
		System.out.println("삭제 할려고 하는 bcno" + bcno);
		System.out.println("삭제 할려고 하는 dto" + dto);
		
		
		if(!(accountNo.equals(dto.getAccountNo()))) {
			message = "댓글을 작성한 사용자가 아닙니다";
			return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(message);
		}
		
		flag = commentService.commentDelete(dto.getBcno());
		
		if(flag == 0) {
			message = "삭제에 실패했습니다";
			return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(message);
		}
		
		message = "삭제에 성공했습니다";
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(message);
	}
	
	
	//댓글 수정
	@PutMapping("/comments")
	public ResponseEntity<String> commentUpdate(@RequestBody BoardCommentDto dto, HttpServletRequest request) {
		
		String token = request.getHeader("Authorization");
		Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
		String accountNo = payload.get("sub").toString();
		
		String message = "";
		int flag = 0;
		
		BoardCommentDto commentDto = new BoardCommentDto();
		
		commentDto.setBcComment(dto.getBcComment());
		commentDto.setBcno(dto.getBcno());
		
		System.out.println(commentDto);
		
		System.out.println("같아? : " + accountNo.equals(dto.getAccountNo()));
		if(!(accountNo.equals(dto.getAccountNo()))) {
			message = "댓글을 등록한 회원이 아닙니다.";
			return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(message);
		} else {
			flag = commentService.commentUpdate(commentDto);
			
			if(flag == 0) {
				message = "수정에 실패했습니다.";
				return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(message);
			}
			
			message = commentDto.getBcno() + "번 수정에 성공하였습니다";
			
			return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(message);
		}
	}
	
	//좋아요 누른 여부 확인
	@GetMapping("/comments/like/{bcno}")
	public ResponseEntity<Integer> checkCommentLike(CommentLikeDto dto, HttpServletRequest request) {
		
		String token = request.getHeader("Authorization");
		Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
		String accountNo = payload.get("sub").toString();
		
		//누른적 있으면 1, 아니면 0
		int state = 0;
		
		dto.setAccountNo(accountNo);
		
		System.out.println(dto);
		
		state = commentService.CheckCommentLike(dto);
		
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(state);
	}
	
	//댓글 좋아요
	@PostMapping("/comments/like")
	public ResponseEntity<String> commentLike(@RequestBody CommentLikeDto dto, HttpServletRequest request) {
		
		String token = request.getHeader("Authorization");
		Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
		String accountNo = payload.get("sub").toString();
		
		String message = "";
		int count = 0;
		
		dto.setAccountNo(accountNo);
		
		System.out.println(dto);
		
		count = commentService.commentLike(dto);
		
		if(count == 1) {
			message = "댓글 좋아요";
			return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(message);
		} else {
			message = "댓글 좋아요 취소";
			return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(message);
		}
		
	}
	
	//댓글 신고
	@PostMapping("/comment/reports")
	public ResponseEntity<String> commentReport(@RequestBody CommentReportDto dto, HttpServletRequest request) {
		
		String token = request.getHeader("Authorization");
		Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
		String accountNo = payload.get("sub").toString();
		
		dto.setAccountNo(accountNo);
		
		int flag = 0;
		String message = "";
		
		flag = commentService.saveReport(dto);
		
		if(flag == 0) {
			message = "이미 신고한 댓글 입니다!";
			return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(message);
		}
		
		message="신고 성공~!";
		
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(message);
	}
	
}
