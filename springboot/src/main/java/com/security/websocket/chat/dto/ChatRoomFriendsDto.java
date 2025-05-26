package com.security.websocket.chat.dto;

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
@Alias("ChatRoomFriendsDto")
public class ChatRoomFriendsDto {
	private String[] friends;
	private String chattingNo;
	private String accountNo;
}
