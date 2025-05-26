package com.security.mypage.dto;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Alias("MypageGameRoomDto")
public class MypageGameRoomDto {
	
	//게임 기록
	private int gameroomNo;
	private int accountNo;
	private Date gameDate;
	private int gameroomRank;
	

}
