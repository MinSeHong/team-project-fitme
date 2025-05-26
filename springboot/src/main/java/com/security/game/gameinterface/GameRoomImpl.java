package com.security.game.gameinterface;

import java.util.Map;

import com.security.game.dto.GameRoomDto;

public interface GameRoomImpl {
	GameRoomDto createAndRedirectGameRoom(GameRoomDto gameDto);
}
