package com.security.board.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.security.board.dao.BoardMapper;
import com.security.board.dto.AccountDto;
import com.security.board.dto.BoardDto;
import com.security.board.dto.BoardImageDto;
import com.security.board.dto.BoardLikesDto;
import com.security.board.dto.BoardReportDto;
import com.security.board.dto.FriendDto;
import com.security.board.dto.FriendshipDto;

@Service
public class BoardService {

	private BoardMapper boardMapper;
	
	public BoardService(BoardMapper boardMapper) {
		this.boardMapper = boardMapper;
	}
	
	//모든 게시물 조회
	public List<BoardDto> findByAll(){
		return boardMapper.findByAll();
	}
	
	//모든 게시물에 대한 이미지 조회
	public List<String> findImageByBno(String bno) {
		return boardMapper.findImageByBno(bno);
	}
	
	//특정 게시물 상세 조회
	@Transactional
	public BoardDto findByOne(String bno) {
		
		//조회 시 조회수 증가
		boardMapper.incrementHitCount(bno);
		
		return boardMapper.findByNo(bno);
		
	}
	
	//게시글 검색
	public List<BoardDto> findBySearchWord(Map<String, String> searchData){
		System.out.println("category : " + searchData.get("searchBy"));
		System.out.println("word : " + searchData.get("searchWord"));
		return boardMapper.findBySearchWord(searchData);
	}
	
	//회원 번호로 해당 회원 게시글 목록 조회
	public List<BoardDto> findAllByNo(String accountNo) {
		return boardMapper.findAllByNo(accountNo);
	}
	
	//사용자 정보 조회
	public AccountDto findByAccountNo(String accountNo) {
		return boardMapper.findByAccountNo(accountNo);
	}
	
	//사용자 친구 정보 조회
	public List<FriendDto> findFriendByAccountNo(String accountNo) {
		return boardMapper.findFriendByAccountNo(accountNo);
	}
	
	//친구 추가
	@Transactional
	public int saveFriend(FriendshipDto dto) {
		return boardMapper.saveFriend(dto);
	}
	
	//게시글 등록
	@Transactional
	public int boardSave(BoardDto boardDto) {
		
		int boardFlag = 0;
		
		//BOARD 테이블에 입력한 정보 등록
		boardFlag = boardMapper.save(boardDto);
		
		//BOARD_IMAGE 테이블에 이미지 서버에 등록한 이미지 일련번호 등록
		BoardImageDto boarImageDto = new BoardImageDto();
		
		String bno = String.valueOf(boardDto.getBno());
		String[] boardImages = boardDto.getBoardImages();
		int count = 1;
		
		//이미지 수 만큼 INSERT문 동작
		for(String boardImage : boardImages) {
			boarImageDto.setBno(bno);
			boarImageDto.setImage(boardImage);
			boarImageDto.setLineLoc(String.valueOf(count));
			count++;
			boardMapper.imageUpload(boarImageDto);
		}
		
		return boardFlag;
	}
	
	//게시글 등록된 이미지 등록
	@Transactional
	public int saveImage(BoardImageDto boardImageDto) {
		return boardMapper.imageUpload(boardImageDto);
	}
	
	//각 게시글에 대한 좋아요 클릭 여부 확인
	public int CheckLike(BoardLikesDto dto) {
		return boardMapper.findByLike(dto);
	}
	
	//좋아요 버튼 클릭
	@Transactional
	public int like(BoardLikesDto dto) {
		
		//1. 해당 회원이 해당 게시글에 좋아요 누른 여부 확인
		int count = boardMapper.findByLike(dto);
		
		//2. 좋아요를 누른적이 없다면 ? insert : delete
		//좋아요 등록 1, 취소 2
		if(count == 0) {
	        boardMapper.insertLike(dto);
	        return 1;
	    } else {
	        boardMapper.deleteLike(dto);
	        return 2;
	    }
	}
	
	//게시글 수정
	@Transactional
	public int boardUpdate(BoardDto dto) {
		return boardMapper.update(dto);
	}
	
	//게시글 삭제
	@Transactional
	public int boardDelete(BoardDto dto) {
		
		return boardMapper.delete(dto);
	}

	//게시글 스크랩
	@Transactional
	public int saveScraps(Map<String, String> map) {
		return boardMapper.saveScraps(map);
	}
	
	//게시글 신고 등록
	@Transactional
	public int saveReport(BoardReportDto dto) {
		
		int check = boardMapper.findReportByNo(dto);
		
		if(check == 1) {
			return 0;
		} else {
			return boardMapper.saveReport(dto);
		}
	}
	
	
}
