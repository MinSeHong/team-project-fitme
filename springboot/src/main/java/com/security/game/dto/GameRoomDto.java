package com.security.game.dto;


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
@Alias("GameRoomDto")
public class GameRoomDto {
	
	private String accountNo;
	private String gameMode;
	private String roomName;
	private int gameroomNo;
}
