package com.security.websocket.chat.dto;

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
@Alias("ChatMemberDto")
public class ChatMemberDto {
	private int chattingNo;
	private int accountNo;
	private String name;
	private int image;
	private int king;
	
	
}
