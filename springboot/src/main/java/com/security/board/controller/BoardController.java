package com.security.board.controller;

import java.io.IOException;
import java.util.HashMap;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.security.board.dto.AccountDto;
import com.security.board.dto.BoardDto;
import com.security.board.dto.BoardImageDto;
import com.security.board.dto.BoardLikesDto;
import com.security.board.dto.BoardReportDto;
import com.security.board.dto.FriendDto;
import com.security.board.dto.FriendshipDto;
import com.security.board.service.BoardService;
import com.security.util.JWTOkens;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.experimental.PackagePrivate;

@RestController
@CrossOrigin
@RequestMapping("/api/v1")
public class BoardController {
	
	private BoardService boardService;
	
	public BoardController(BoardService boardService) {
		this.boardService = boardService;
	}
	
	//현재 로그인 중인 사용자 정보 조회
	@GetMapping("/boards/account")
	public ResponseEntity<AccountDto> accountInfo(HttpServletRequest request) {
		  
		String token = request.getHeader("Authorization");
		Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
		String accountNo = payload.get("sub").toString();
		
		AccountDto accountInfo = boardService.findByAccountNo(accountNo);
		
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(accountInfo);
		  
	}
	
	//accountNo를 통한 사용자 정보 조회
	@GetMapping("/boards/account/{accountNo}")
	public ResponseEntity<AccountDto> accountInfoByAccountNo(@PathVariable String accountNo) {
		
		AccountDto accountInfo = boardService.findByAccountNo(accountNo);
		
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(accountInfo);
	}
	
	//게시글 전체 조회
	@GetMapping("/boards")
	public ResponseEntity<List<BoardDto>> boardAllList() {
		
		List<BoardDto> allList = boardService.findByAll();
		
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(allList);
	}
	
	//전체 게시글 조회시 각 게시글 마다 이미지 번호 조회
	@GetMapping("/boards/images/{bno}")
	public ResponseEntity<List<String>> imageAllList(@PathVariable String bno) {
		
		List<String> boardImages = boardService.findImageByBno(bno);
		
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(boardImages);
	}
	
	//특정 회원의 게시글 전체 조회
	@GetMapping("/boards/friends/{accountNo}")
	public ResponseEntity<List<BoardDto>> boardAllListByNo(@PathVariable String accountNo) {
		
		List<BoardDto> allListNo = boardService.findAllByNo(accountNo);
		
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(allListNo);
		
	}
	
	//특정 게시글 상세 조회
	@GetMapping("/boards/{bno}")
	public ResponseEntity<BoardDto> boardOneList(@PathVariable String bno){
		
		BoardDto oneList = boardService.findByOne(bno);
		
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(oneList);
	}
	
	//친구 목록 출력
	@GetMapping("/boards/friend")
	public ResponseEntity<List<FriendDto>> boardFriendList(AccountDto dto, HttpServletRequest request) {
		
		String token = request.getHeader("Authorization");
		Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
		String accountNo = payload.get("sub").toString();
		
		List<FriendDto> friendsInfo = boardService.findFriendByAccountNo(accountNo);
		
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(friendsInfo);	
	}
	
	//친구 추가
	@PostMapping("/boards/follow")
	public ResponseEntity<String> follow(@RequestBody String opponentNo, HttpServletRequest request) {
		
		String token = request.getHeader("Authorization");
		Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
		String accountNo = payload.get("sub").toString();
		
		int flag = 0;
		int save = 0;
		String chage = "";
		
		FriendshipDto follow = new FriendshipDto();
		follow.setAccountNo(accountNo);
		follow.setOpponentNo(opponentNo);
	
		flag = boardService.saveFriend(follow);
		
		if(flag == 1) {
			chage = accountNo;
			accountNo = opponentNo;
			opponentNo = chage;
			
			follow.setAccountNo(accountNo);
			follow.setOpponentNo(opponentNo);
			
			save = boardService.saveFriend(follow);
			
			if(save == 1)
				return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body("둘다 친구 추가 성공");
			else 
				return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body("둘다 친구 추가 실패");
		}
		
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body("로그인한 사용자만 친구 추가 성공");
	}
	
	//게시글 등록
	@PostMapping("/boards")
	public ResponseEntity<BoardDto> boardSave(
			@RequestBody BoardDto boardDto,
			HttpServletRequest request
		) throws IOException, ServletException {
		
		boardService.boardSave(boardDto);
		
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(boardDto);
	}
	
	//좋아요 눌렀는지 여부 확인
	@GetMapping("/boards/like/{bno}")
	public ResponseEntity<Integer> checkLike(BoardLikesDto dto, HttpServletRequest request) {
		
		String token = request.getHeader("Authorization");
		Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
		String accountNo = payload.get("sub").toString();
		
		//누른적 있으면 1, 아니면 0
		int state = 0;
		
		dto.setAccountNo(accountNo);
		
		state = boardService.CheckLike(dto);
		
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(state);
	}
	
	//좋아요
	@PostMapping("/boards/like")
	public ResponseEntity<String> boardLike(@RequestBody BoardLikesDto dto, HttpServletRequest request) {
		
		String token = request.getHeader("Authorization");
		Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
		String accountNo = payload.get("sub").toString();
		
		dto.setAccountNo(accountNo);
		
		String message = "";
		int count = 0;
		
		count= boardService.like(dto);
    
		//프론트에서 좋아요 버튼을 어떤 값으로 온/오프 할거인지 말하고 문자열을 보낼지 숫자를 보낼지 정할 예정 일단 문자열로 응답.
		if(count == 1) {
			message = "활성화";
			return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(message);
		} else {
			message = "비활성화";
			return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(message);
		}
	}
	
	//게시글 수정
	@PutMapping("/boards")
	public ResponseEntity<String> boardUpdate(@RequestBody BoardDto dto, HttpServletRequest request) {
		
		String token = request.getHeader("Authorization");
		Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
		String accountNo = payload.get("sub").toString();
		
		String message = "";
		int flag = 0;
		
		AccountDto accountDto = boardService.findByAccountNo(accountNo);
		BoardDto boardDto = boardService.findByOne(dto.getBno());
		
		if(!(accountDto.getAccountNo() == boardDto.getAccountNo())) {
			message = "등록한 사용자가 아닙니다.";
			return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(message);
		}
	
		flag = boardService.boardUpdate(dto);
		
		if(flag == 0) {
			message = "수정에 실패 했습니다";
		}
		
		message = dto.getBno() +"번 게시글 수정 성공";
		
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(message);
	}
	
	//게시글 삭제
	@DeleteMapping("/boards/{bno}")
	public ResponseEntity<String> boardDelete(@PathVariable String bno, HttpServletRequest request) {
		
		String token = request.getHeader("Authorization");
		Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
		String accountNo = payload.get("sub").toString();
			
		String message = "";
		int flag = 0;
		
		BoardDto boardDto = boardService.findByOne(bno);

		if(!(boardDto.getAccountNo().equals(accountNo))) {
			message = "동일한 회원이 아닙니다";
			return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(message);
		}

		flag = boardService.boardDelete(boardDto);
		
		if(flag == 0) message = "실패";
		
		message = "성공";
		
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(message);
	}
	
	//게시글 스크랩
	@PostMapping("/boards/scrap")
	public ResponseEntity<String> scrapBoard(@RequestBody String bno, HttpServletRequest request) {
		
		String token = request.getHeader("Authorization");
		Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
		String accountNo = payload.get("sub").toString();
		
		String message = "";
		int flag = 0;
		
		Map<String, String> map = new HashMap();
		
		map.put("bno", bno);
		map.put("accountNo", accountNo);
		
		flag = boardService.saveScraps(map);
		
		if(flag == 1) {
			message = bno+"번의 게시글을 스크랩 하였습니다.";
			return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(message);
		} else {
			message = bno+"번의 게시글 스크랩에 실패 하였습니다.";
			return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(message);
		}
		
	}
	
	//게시글 검색
	@GetMapping("/boards/search")
	public ResponseEntity<List<BoardDto>> searchBoard(@RequestParam String searchBy, @RequestParam String searchWord) {
	    Map<String, String> searchData = new HashMap<>();
	    searchData.put("searchBy", searchBy);
	    searchData.put("searchWord", searchWord);
	    
	    System.out.println("검색 시 데이터 : " + searchData);
	    
	    List<BoardDto> searchList = boardService.findBySearchWord(searchData);
	    
	    if (searchList != null && !searchList.isEmpty()) {
	        return ResponseEntity.ok().body(searchList);
	    } else {
	        return ResponseEntity.noContent().build(); // 검색 결과가 없을 때
	    }
	}
	
	//게시글 신고
	@PostMapping("/boards/reports")
	public ResponseEntity<String> boardReport(@RequestBody BoardReportDto dto, HttpServletRequest request) {
		
		String token = request.getHeader("Authorization");
		Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
		String accountNo = payload.get("sub").toString();
		
		int flag = 0;
		String message = "";
		
		dto.setAccountNo(accountNo);
		
		flag = boardService.saveReport(dto);
		
		if(flag == 0) {
			message = "이미 신고한 게시글 입니다!";
			return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(message);
		}
		
		message="게시글 신고 성공~!";
		
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(message);
		
	}
	
}
