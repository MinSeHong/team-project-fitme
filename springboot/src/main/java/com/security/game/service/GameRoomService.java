package com.security.game.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.security.game.config.SessionBean;
import com.security.game.dao.GameAccountMapper;
import com.security.game.dao.GameRoomMapper;
import com.security.game.dto.GameAccountDto;
import com.security.game.dto.GameRoomDto;
import com.security.game.gameinterface.GameRoomImpl;

import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
public class GameRoomService implements GameRoomImpl {
	
	private final SessionBean sessionBean;
	
	 public GameRoomService() {
	        this.sessionBean = SessionBean.getInstance();
	    }

    @Autowired
    private GameAccountMapper gameAccountMapper;

    @Override
    public GameRoomDto createAndRedirectGameRoom(GameRoomDto gameDto) {
    	log.info("게임 방 번호 생성 시작 - accountNo: {}", gameDto.getAccountNo());
        int roomNumber = new Random().nextInt(9000) + 1000;

        log.info("사용자 정보 조회 - accountNo: {}", gameDto.getAccountNo());
        GameAccountDto accountDetails = gameAccountMapper.findByAccountNo(gameDto.getAccountNo());
        

        if (accountDetails != null) {
            log.info("사용자 정보 조회 성공 - accountDetails: {}", accountDetails);
        } else {
            log.warn("사용자 정보 조회 실패 - accountNo: {}", gameDto.getAccountNo());
        }
        
        Map<String, Object> roomDetails = new HashMap<>();
        GameRoomDto dto = new GameRoomDto();
        dto.setAccountNo(gameDto.getAccountNo());
        dto.setGameMode(gameDto.getGameMode());
        dto.setRoomName(gameDto.getRoomName());
        dto.setGameroomNo(roomNumber);

        log.info("게임 방 생성 완료 서비스 - dto: {}", dto);
        return dto;
    
    }
    
    public boolean leaveAndDeleteGameRoom(int gameroomNo) {
        Map<Integer, List<String>> gameRooms = sessionBean.getGameRoomsUsers(); // 방 번호와 해당 방의 사용자 목록을 관리하는 Map
        
        // 게임 방이 존재하는지 확인
        if (gameRooms.containsKey(gameroomNo)) {
            List<String> users = gameRooms.get(gameroomNo);
            
            // 방에 참가자가 없는 경우 삭제 처리
            if (users.isEmpty()) {
                gameRooms.remove(gameroomNo); // 세션에서 게임 방 삭제
                sessionBean.setGameRoomsUsers(gameRooms); // 변경된 게임 방 사용자 목록을 다시 세션에 저장
                
                log.info("게임 방이 삭제되었습니다 - gameroomNo: {}", gameroomNo);
                return true;
            } else {
                log.info("게임 방에 참가자가 남아있어 방을 삭제하지 않습니다 - gameroomNo: {}", gameroomNo);
                return false;
            }
        } else {
            log.warn("삭제할 게임 방이 존재하지 않음 - gameroomNo: {}", gameroomNo);
            return false;
        }
    }
    
}