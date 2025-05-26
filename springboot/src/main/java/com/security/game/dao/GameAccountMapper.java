package com.security.game.dao;

import org.apache.ibatis.annotations.Mapper;

import com.security.game.dto.GameAccountDto;

@Mapper
public interface GameAccountMapper {

	// 계정 정보 업데이트
	public int gameAccountUpdate(GameAccountDto accountNo);
	public int gameAccountInsert(GameAccountDto accountDto);
	public GameAccountDto findByAccountNo(String accountNo); 
}
