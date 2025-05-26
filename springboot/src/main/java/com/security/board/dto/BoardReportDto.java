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
@Alias("BoardReportDto")
public class BoardReportDto {
	
	private String bno;
	private String accountNo;
	private String reportComment;
	private Date reportDate;

}
