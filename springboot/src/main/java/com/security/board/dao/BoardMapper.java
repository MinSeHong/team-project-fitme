package com.security.board.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.security.board.dto.AccountDto;
import com.security.board.dto.BoardDto;
import com.security.board.dto.BoardImageDto;
import com.security.board.dto.BoardLikesDto;
import com.security.board.dto.BoardReportDto;
import com.security.board.dto.FriendDto;
import com.security.board.dto.FriendshipDto;

@Mapper
public interface BoardMapper {
	
	//전체 게시물 조회(좋아요 및 스크렙 수 까지)
	List<BoardDto> findByAll();
	
	//게시글에 등록된 이미지 번호 조회
	List<String> findImageByBno(String bno);
	
	//특정 게시물 상세 조회
	BoardDto findByNo(String bno);
	
	//게시글 검색
	List<BoardDto> findBySearchWord(Map<String, String> searchData);

	//특정 사용자가 등록한 게시글 전체 조회
	List<BoardDto> findAllByNo(String accountNo);
	
	//특정 사용자가 올린 bno를 통해 사용자 정보 조회
	AccountDto findAccountByNo(String bno);
	
	//로그인한 사용자 정보 조회
	AccountDto findByAccountNo(String accountNo);
	
	//로그인한 사용자 친구 정보 조회(친구 정보 + 친구 게시글 정보)
	List<FriendDto> findFriendByAccountNo(String accountNo);
	
	//친구 추가
	int saveFriend(FriendshipDto dto);
	
	//특정 게시물 조회시 마다 조회수 증가
	int incrementHitCount(String bno);
	
	//좋아요 누른지 확인 여부
	int findByLike(BoardLikesDto dto);
	
	//좋아요 등록
	int insertLike(BoardLikesDto dto);
	
	//좋아요 삭제
	int deleteLike(BoardLikesDto dto);
	
	//게시글 등록
	int save(BoardDto dto);
	
	//게시글 등록 시 이미지 등록
	int imageUpload(BoardImageDto dto);
	
	//게시글 수정
	int update(BoardDto dto);
	
	//게시글 삭제
	int delete(BoardDto dto);
	
	//게시글 스크랩
	int saveScraps(Map<String, String> map);

	//게시글 신고 여부 조회
	int findReportByNo(BoardReportDto dto);
	
	//게시글 신고
	int saveReport(BoardReportDto dto);
	

}
