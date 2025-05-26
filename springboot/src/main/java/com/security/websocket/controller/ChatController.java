package com.security.websocket.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;


import com.security.websocket.chat.service.ChatService;

import com.security.websocket.dto.ChatDto;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin
@RequiredArgsConstructor
public class ChatController {

	private SimpMessagingTemplate simpMessagingTemplate;
	
	private ChatService service;
	
	@Autowired
	public ChatController(ChatService service,SimpMessagingTemplate simpMessagingTemplate) {
		this.service=service;
		this.simpMessagingTemplate = simpMessagingTemplate;
	}
	
	
    @MessageMapping("/chat")
    public void sendMessage(ChatDto dto, SimpMessageHeaderAccessor accessor) {
    	
    	service.insert(dto);

        simpMessagingTemplate.convertAndSend("/sub/chat/" + dto.getChattingNo(), dto);
    }

}
