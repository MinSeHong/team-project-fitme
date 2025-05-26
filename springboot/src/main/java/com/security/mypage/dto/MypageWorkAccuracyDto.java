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
@Alias("MypageWorkAccuracyDto")
public class MypageWorkAccuracyDto {
	
	private String category;
	private Date endPostdate;
	private double accuracy;

}
