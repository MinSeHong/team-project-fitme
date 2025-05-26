package com.security.game.dao;

import org.apache.ibatis.annotations.Mapper;

import com.security.game.dto.GameRoomDto;

@Mapper
public interface GameRoomMapper {
	 void createGameRoom(GameRoomDto gameRoomDto);
}
	

