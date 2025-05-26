package com.security.websocket.dto;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Alias("ChatDto")
public class ChatDto {
	
	private int chattingNo;
	private int accountNo;
	private String name;
	private String chatComment;
	private Date postDate;
}
