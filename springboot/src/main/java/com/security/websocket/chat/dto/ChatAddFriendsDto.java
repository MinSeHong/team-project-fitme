package com.security.websocket.chat.dto;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import com.security.websocket.dto.ChatDto;

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
@Alias("ChatAddFriendsDto")
public class ChatAddFriendsDto {
	private String chattingNo;
	private String accountNo;
	private int num; //배열크기
	
}
