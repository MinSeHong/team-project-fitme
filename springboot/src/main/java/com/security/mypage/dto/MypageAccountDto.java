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
@Alias("MypageAccountDto")
public class MypageAccountDto {
	private String accountNo;
	private String username;
	private String name;
	private char gender;
	private int age;
	private String address;
	private char hobby;
	private Date enrollDate;
	private String image;
	private int height;
	private int weight;
	private String gameImage;
	private String nickname;
	private double skeletalMuscle; //SKELETAL_MUSCLE
	private double bodyFatMass; //BODY_FAT_MASS
	private double bodyFatPercentage; //BODY_FAT_PERCENTAGE
	private double abdominalFatRate; //ABDOMINAL_FAT_RATE
	private double basalMetabolicRate; //BASAL_METABOLIC_RATE
	

}
