package com.security.foodwork.service;

import org.springframework.stereotype.Service;

import com.security.foodwork.dao.FoodWorkMapper;
import com.security.foodwork.dto.AccountFoodWorkDto;

@Service
public class FoodWorkService {

	private FoodWorkMapper foodWorkMapper;
	public FoodWorkService(FoodWorkMapper foodWorkMapper) {
		this.foodWorkMapper = foodWorkMapper;
	}
	
	public AccountFoodWorkDto findByNo(String accountNo) {
		return foodWorkMapper.findByNo(accountNo);
	}
//	public AccountFoodWorkDto findByUsername(String username) {
//		return foodWorkMapper.findByUsername(username);
//	}
	
	
	
	
	
	
}
