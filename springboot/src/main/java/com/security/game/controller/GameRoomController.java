package com.security.game.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.security.game.config.SessionBean;
import com.security.game.dto.GameRoomDto;
import com.security.game.service.GameRoomService;
import com.security.util.JWTOkens;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@CrossOrigin
@SessionAttributes("MapListGame")
@RequestMapping("/api/v1")
public class GameRoomController {
	
    private GameRoomService gameRoomService;
    private final SessionBean sessionBean;
    
    @Autowired
    public GameRoomController(GameRoomService gameRoomService) {
    	this.gameRoomService = gameRoomService;
    	this.sessionBean = SessionBean.getInstance();
    }

    @PostMapping("/game/createRoom/{mode}")
	public ResponseEntity<GameRoomDto> createGameRoom(@PathVariable String mode, @RequestBody GameRoomDto gameRoomDto, HttpServletRequest request) {

        String token = request.getHeader("Authorization");
        Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
        String accountNo = payload.get("sub").toString();

        log.info("게임 생성 요청 받음 - mode: {}, accountNo: {}, roomName: {}", mode, accountNo, gameRoomDto.getRoomName());

        gameRoomDto.setAccountNo(accountNo);
        gameRoomDto.setGameMode(mode);

        System.out.println("accountNo 맞니?: " + accountNo + ", mode: " + mode + ", roomName: " + gameRoomDto.getRoomName());
        
        // 게임룸 생성
        GameRoomDto roomDetails = gameRoomService.createAndRedirectGameRoom(gameRoomDto);
        // 세션에 게임룸 정보 저장
        Map<Integer, List<GameRoomDto>> gameRooms = sessionBean.getGameRooms();
        if (gameRooms == null) {
            gameRooms = new HashMap<>();
        }

        int roomId = roomDetails.getGameroomNo();
        if (!gameRooms.containsKey(roomId)) {
            gameRooms.put(roomId, new ArrayList<>());
        }
        
        gameRooms.get(roomId).add(roomDetails);
        sessionBean.setGameRooms(gameRooms);

        return ResponseEntity.ok(roomDetails);
    }
    
    @DeleteMapping("/game/leaveRoom/{gameroomNo}")
    public ResponseEntity<?> leaveGameRoom(@PathVariable int gameroomNo) {
        boolean isDeleted = gameRoomService.leaveAndDeleteGameRoom(gameroomNo);
        if(isDeleted) {
            return ResponseEntity.ok().body("방이 삭제되었습니다.");
        } else {
            return ResponseEntity.ok().body("방에서 나왔습니다.");
        }
    }


    //게임룸 리스트 받아오기
    @GetMapping("/gameRooms")
    public Map<Integer, List<GameRoomDto>> getGameRooms(Map<String, Object> model) {
        Map<Integer, List<GameRoomDto>> gameRooms = sessionBean.getGameRooms();

        if (gameRooms == null) {
            gameRooms = new HashMap<>();
        }

        return gameRooms;
    }
}