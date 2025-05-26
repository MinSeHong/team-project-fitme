package com.security.game.service;

import org.springframework.stereotype.Service;


import com.security.game.dao.GameAccountMapper;
import com.security.game.dto.GameAccountDto;

@Service
public class GameAccountService {
	
	private GameAccountMapper gameAccountMapper;
	
	public GameAccountService(GameAccountMapper gameAccountMapper) {
		this.gameAccountMapper = gameAccountMapper;
	}
	
	public GameAccountDto findByAccountNo(String accountNo) {
		return gameAccountMapper.findByAccountNo(accountNo);
	}
	
    public void gameAccountUpdate(GameAccountDto dto) {
        gameAccountMapper.gameAccountUpdate(dto);
        System.out.println("+++gameDTO:" + dto);
        System.out.println("게임 계정 정보가 업데이트되었습니다." + dto);
    }
	
    public void gameAccountInsert(GameAccountDto dto) {
        // 새로운 게임 계정 등록
    	System.out.println("새로운 게임 계정이 등록되었습니다." + dto);
        gameAccountMapper.gameAccountInsert(dto);
        
    }
	
}
