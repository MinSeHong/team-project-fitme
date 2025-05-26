package com.security.game.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.security.game.dto.GameAccountDto;
import com.security.game.service.GameAccountService;
import com.security.util.JWTOkens;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin
@RequestMapping("/api/v1")
public class GameAccountController {
	
	private GameAccountService gameAccountService;
	
	public GameAccountController(GameAccountService gameAccountService) {
		this.gameAccountService = gameAccountService;
	}
	
	@GetMapping("/games/account/{accountNo}")
	public ResponseEntity<GameAccountDto> getGameAccount(@PathVariable("accountNo") String accountNo) {
	    try {
	        GameAccountDto gameAccountDto = gameAccountService.findByAccountNo(accountNo);
	        if (gameAccountDto != null) {
	            return ResponseEntity.ok(gameAccountDto);
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
	    }
	}

	@PutMapping("/games/account/{accountNo}")
	public ResponseEntity<GameAccountDto> gameAccountUpdate(@RequestBody GameAccountDto dto , HttpServletRequest request){
	    try {
	        String token = request.getHeader("Authorization");
	        Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
	        String accountNo = payload.get("sub").toString();
	        dto.setAccountNo(accountNo);
	        
	        // 게임 계정 정보 업데이트
	        gameAccountService.gameAccountUpdate(dto);
	        
	        // 수정된 계정 정보를 클라이언트에게 반환
	        return ResponseEntity.ok(dto);
	    } catch(Exception e) {   	
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
	    }
	}

	
	@PostMapping("/games/account")
	public ResponseEntity<String> gameAccountInsert(GameAccountDto dto, HttpServletRequest request) {
	    try {
	        String token = request.getHeader("Authorization");
	        Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
	        String accountNo = payload.get("sub").toString();
	        System.out.println("+accountNo"+accountNo);
	        GameAccountDto selectDto = gameAccountService.findByAccountNo(accountNo);
	        System.out.println("+++selectDto"+selectDto);
	        // 게임 계정이 존재하지 않으면 등록
	        if (selectDto == null) {
	            gameAccountService.gameAccountInsert(dto);
	            return ResponseEntity.ok("게임정보 입력 완료");
	        } else {
	            return ResponseEntity.badRequest().body("게임 계정이 이미 존재합니다.");
	        }
	    } catch(Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("게임정보 입력 실패");
	    }
	}

}
