package com.security.websocket.chat.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.security.util.JWTOkens;
import com.security.websocket.chat.dto.ChatCommentListDto;
import com.security.websocket.chat.dto.ChatFriendsDto;
import com.security.websocket.chat.dto.ChatListDto;
import com.security.websocket.chat.dto.ChatMemberDto;
import com.security.websocket.chat.dto.ChatRoomDto;
import com.security.websocket.chat.dto.ChatRoomFriendsDto;
import com.security.websocket.chat.service.ChatService;
import com.security.websocket.dto.ChatDto;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin
@RequestMapping("/api/v1")
public class ChattingContoller {
	
	private ChatService chatService;
	
	@Autowired
	public ChattingContoller(ChatService chatService) {
		this.chatService = chatService;
	}
	
	@GetMapping("/chat/list/{accountNo}")
	public ResponseEntity<List<ChatListDto>> chatList(@PathVariable int accountNo){
		System.out.println("accountNo:"+accountNo);
		List<ChatListDto> findByNoAll = chatService.findChatListByNo(accountNo);
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(findByNoAll);
	}
	
	//채팅 내용
	@GetMapping("/chat/list/room/{chattingNo}")
	public ResponseEntity<List<ChatCommentListDto>> chatComments(@PathVariable int chattingNo){
		List<ChatCommentListDto> findCommentByNo = chatService.findChatCommentByNo(chattingNo);
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(findCommentByNo);
	}
	
	
	//채팅방 멤버 
	@GetMapping("/chat/list/room/member/{chattingNo}")
	public ResponseEntity<List<ChatMemberDto>> chatMember(@PathVariable int chattingNo){
		List<ChatMemberDto> findMemberByNo = chatService.findChatRoomMemberByChatNo(chattingNo);
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(findMemberByNo);
	}
	//멤버 삭제
	@DeleteMapping("/chat/list/room/member/{chattingNo}")
	public ResponseEntity<String> deleteChatRoomMember(@PathVariable int chattingNo, HttpServletRequest request){
		String token = request.getHeader("Authorization");
		Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
		String accountNo = payload.get("sub").toString();
		
		ChatRoomDto dto = new ChatRoomDto();
		
		dto.setAccountNo(Integer.parseInt(accountNo));
		dto.setChattingNo(chattingNo);
		int num = chatService.chatMemberDelete(dto);
		
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(String.valueOf(num));	
	}
	//채팅방 초대 리스트 
	@GetMapping("/chat/list/room/friends/{chattingNo}")
	public ResponseEntity<List<ChatFriendsDto>> chatFriends(@PathVariable String chattingNo,HttpServletRequest request){
		String token = request.getHeader("Authorization");
		Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
		String accountNo = payload.get("sub").toString();
		ChatDto dto = new ChatDto();
		dto.setAccountNo(Integer.parseInt(accountNo));
		dto.setChattingNo(Integer.parseInt(chattingNo));
		
		List<ChatFriendsDto> findChatFriendsByChatNo = chatService.findChatFriendsByChatNo(dto);
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(findChatFriendsByChatNo);
	}
	
	@PostMapping("/chat/list/room/friends")
	public ResponseEntity<ChatRoomFriendsDto> chatRoomFriends(@RequestBody ChatRoomFriendsDto dto,HttpServletRequest request){
		String token = request.getHeader("Authorization");
		Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
		String accountNo = payload.get("sub").toString();
		
		int num = chatService.chatRoomSave(dto,accountNo);
		return null;
	}
	
	
	//이름 변경
	@PutMapping("/chat/list/room")
	public ResponseEntity<String> putChatRoom(@RequestBody ChatListDto dto,HttpServletRequest request){
		String token = request.getHeader("Authorization");
		Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
		String accountNo = payload.get("sub").toString();
		dto.setAccountNo(Integer.parseInt(accountNo));
		
		int num = chatService.chatRoomEditName(dto);
		
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(String.valueOf(num));
	}
	
	
	
	@DeleteMapping("/chat/list/room/{chattingNo}")
	public ResponseEntity<String> deleteChatRoom(@PathVariable int chattingNo, HttpServletRequest request){
		String token = request.getHeader("Authorization");
		Map<String, Object> payload = JWTOkens.getTokenPayloads(token);
		String accountNo = payload.get("sub").toString();
		
		
		ChatRoomDto dto = chatService.findChatByNo(chattingNo);
		if(!accountNo.equalsIgnoreCase(String.valueOf(dto.getAccountNo()))) {
			return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body("삭제실패(동일회원X):"+accountNo.equalsIgnoreCase(accountNo));
		}
		String msg = "성공적으로 삭제되었습니다";
		int num = chatService.chatDelete(chattingNo);
		if(num == 0) msg ="실패";
		
		return ResponseEntity.ok().header("Content-Type", "application/json; charset=UTF-8").body(String.valueOf(num));
		
	}
	

}
