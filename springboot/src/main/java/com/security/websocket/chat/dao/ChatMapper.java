package com.security.websocket.chat.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.security.websocket.chat.dto.ChatCommentListDto;
import com.security.websocket.chat.dto.ChatFriendsDto;
import com.security.websocket.chat.dto.ChatListDto;
import com.security.websocket.chat.dto.ChatMemberDto;
import com.security.websocket.chat.dto.ChatRoomDto;
import com.security.websocket.chat.dto.ChatRoomFriendsDto;
import com.security.websocket.dto.ChatDto;

@Mapper
public interface ChatMapper {

	public List<ChatListDto> findChatListByNo(int accountNo);
	
	public int insertChat(ChatDto dto);
	
	public List<ChatCommentListDto> findChatCommentByNo(int chattingNo);
	
	public ChatRoomDto findChatByNo(int chattingNo);
	
	public List<ChatMemberDto> findChatRoomMemberByChatNo(int chattingNo);
	
	public List<ChatFriendsDto> findChatFriendsByChatNo(ChatDto dto);
	
	public int chatAddRoom(String accountNo);
	
	public String chatAddRoomCheck();
	
	public int chatRoomSave(ChatRoomFriendsDto dto);
	
	public int chatRoomEditName(ChatListDto dto);
	
	public int chatMemberDelete(ChatRoomDto dto);
	
	public int delete(int chattingNo);
	
}
