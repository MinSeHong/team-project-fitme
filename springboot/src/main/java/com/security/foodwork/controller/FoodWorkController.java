package com.security.foodwork.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.security.foodwork.dto.AccountFoodWorkDto;
import com.security.foodwork.service.FoodWorkService;
import com.security.util.JWTOkens;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin
@RequestMapping("/api/v1")
public class FoodWorkController {
	
	private FoodWorkService foodWorkService;
	
	
	public FoodWorkController(FoodWorkService foodWorkService) {
		this.foodWorkService = foodWorkService;
	}
	
	@GetMapping("/foodworks/account")
	public ResponseEntity<AccountFoodWorkDto> accountInfo(HttpServletRequest request){
		System.out.println("Authorization");
		String token = request.getHeader("Authorization");
		Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
		String username = payload.get("sub").toString();
		
		System.out.println("username"+username);
		AccountFoodWorkDto accountInfo = foodWorkService.findByNo(username);
		
		System.out.println(accountInfo);
		
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(accountInfo);
		  
	}
	
	
	
	

}
