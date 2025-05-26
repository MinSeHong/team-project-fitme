package com.security.foodwork.dao;

import org.apache.ibatis.annotations.Mapper;

import com.security.foodwork.dto.AccountFoodWorkDto;

@Mapper
public interface FoodWorkMapper {
	
	public AccountFoodWorkDto findByNo(String accountNo);
//public AccountDto findByUsername(String username);
}
