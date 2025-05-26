package com.security.game.config;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.type.Alias;

import com.security.game.dto.GameRoomDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SessionBean implements Serializable {
	
	private static final SessionBean INSTANCE = new SessionBean();
	
    private Map<Integer, List<GameRoomDto>> gameRooms = new HashMap<>();
    private Map<Integer, List<String>> gameRoomsUsers = new HashMap<>();
    
    public static SessionBean getInstance() {
        return INSTANCE;
    }
    public Map<Integer, List<String>> getGameRoomsUsers() {
        return gameRoomsUsers;
    }
    public void setGameRoomsUsers(Map<Integer, List<String>> gameRoomsUsers) {
        this.gameRoomsUsers = gameRoomsUsers;
    }
}
