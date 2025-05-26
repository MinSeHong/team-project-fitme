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
@Alias("ChatListDto")
public class ChatListDto {
	
	private String chattingNick;
	private int chattingNo;
	private int accountNo;
	private int count;

}
