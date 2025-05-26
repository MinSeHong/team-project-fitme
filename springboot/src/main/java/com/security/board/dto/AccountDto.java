package com.security.board.dto;

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
@Alias("AccountDto")
public class AccountDto {
	
	private String accountNo;
	private String username;
	private String name;
	private Date enrollDate;
	private String image;
	
	private String realation;
	//등록한 게시글 수
	private Long postCount;
	//팔로워 (나를 친구 추가한 사람)
	private Long follower;
	//팔로잉 (내가 친구 추가한 사)
	private Long following;
	

}
