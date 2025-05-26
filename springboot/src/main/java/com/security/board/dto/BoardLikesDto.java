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
@Alias("BoardLikesDto")
public class BoardLikesDto {
	
	private String bno;
	private String accountNo;
	private Date likeDate;
	//눌렸는지 확인 변수
	private String preState;

}
