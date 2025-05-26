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
@Alias("FriendshipDto")
public class FriendshipDto {
	
	private String accountNo;
	private String opponentNo;
	private String nickname;
	// S : 일반, R : 친한, B : 차단
	private char realation; 

}
