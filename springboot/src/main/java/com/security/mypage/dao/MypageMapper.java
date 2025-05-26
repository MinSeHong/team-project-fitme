package com.security.mypage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.security.mypage.dto.MypageAccountDto;
import com.security.mypage.dto.MypageGameRoomDto;
import com.security.mypage.dto.MypageWorkAccuracyDto;
import com.security.mypage.dto.MypageWorkBigThreeDto;

@Mapper
public interface MypageMapper {
	
	//자신의 개인 프로필
	public MypageAccountDto findByUsername(String username);
	public MypageAccountDto findByNo(String accountNo);
	
	//게임 기록
	public List<MypageGameRoomDto> findAllByNo(int accountNo);
	
	//운동별 정확도 증가 추이
	public List<MypageWorkAccuracyDto> findAccuracyAllByNo(int accountNo);
	//3대 운동 증가 추이(횟수?)
	public List<MypageWorkBigThreeDto> findBigThreeAllByNo(int accountNo);
	
	public List<MypageWorkBigThreeDto> findWorkAllByNo(int accountNo);
	
	// 계정 정보 업데이트
	public int updateAccountInfo(MypageAccountDto accountDto);
}
