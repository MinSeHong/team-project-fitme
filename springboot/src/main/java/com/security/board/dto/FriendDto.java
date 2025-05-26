package com.security.board.dto;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Alias("FriendDto")
public class FriendDto {
	
	//상단 친구 정보
	private String accountNo;
	private String name;
	private String image;
	private String address;
	//이미 친구인지 확인하기 위한 정보
	private String realation;
	//사용자 프로필 정보
	private Date enrollDate;
	private String postCount;
	private String follower;
	private String following;

}
