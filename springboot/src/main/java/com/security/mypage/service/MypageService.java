package com.security.mypage.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.security.mypage.dao.MypageMapper;
import com.security.mypage.dto.MypageAccountDto;
import com.security.mypage.dto.MypageGameRoomDto;
import com.security.mypage.dto.MypageWorkAccuracyDto;
import com.security.mypage.dto.MypageWorkBigThreeDto;

@Service
public class MypageService {

	private MypageMapper mypageMapper;
	
	public MypageService(MypageMapper mypageMapper) {
		this.mypageMapper = mypageMapper;
	}
	
	public MypageAccountDto findByUsername(String username) {
		return mypageMapper.findByUsername(username);
	}
	public MypageAccountDto findByNo(String accountNo) {
		return mypageMapper.findByNo(accountNo);
	}
	
	public List<MypageGameRoomDto> findAllByNo(int accountNo){
		return mypageMapper.findAllByNo(accountNo);
	}
	
	public List<MypageWorkAccuracyDto> findAccuracyAllByNo(int accountNo){
		return mypageMapper.findAccuracyAllByNo(accountNo);
	}
	
	public List<MypageWorkBigThreeDto> findBigThreeAllByNo(int accountNo){
		return mypageMapper.findBigThreeAllByNo(accountNo);
	}
	
	public List<MypageWorkBigThreeDto> findWorkAllByNo(int accountNo){
		return mypageMapper.findWorkAllByNo(accountNo);
	}
	
	public void updateAccountInfo(MypageAccountDto accountDto) {
		mypageMapper.updateAccountInfo(accountDto);
	}
	 
}
