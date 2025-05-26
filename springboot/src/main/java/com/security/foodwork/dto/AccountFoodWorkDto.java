package com.security.foodwork.dto;

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
@Alias("AccountFoodWorkDto")
public class AccountFoodWorkDto {
	
	private Long accountNo; //어카운트
	private String name; //
	private char gender;
	private Long age;
	private Long height;
	private Long weight;
	private String image;

}
