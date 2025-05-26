package com.security.pay.dto;

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
@Alias("PayDao")
public class PayDto {
	
	private String payNo;
	private String accountNo;
	private char payType;
	private String payName;
	private String payPrice;
	private String payMethod;
	private Date payDate; 
}
