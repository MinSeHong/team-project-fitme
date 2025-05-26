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
@Alias("ChatCommentListDto")
public class ChatCommentListDto {
	
	private int chattingCno;
	private int accountNo;
	private String name;
	private String chatComment;
	private String time;
	private int read;

}
