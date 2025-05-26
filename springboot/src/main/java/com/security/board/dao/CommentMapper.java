package com.security.board.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.security.board.dto.AccountDto;
import com.security.board.dto.BoardCommentDto;
import com.security.board.dto.CommentLikeDto;
import com.security.board.dto.CommentReportDto;

@Mapper
public interface CommentMapper {

	//특정 게시글에 대한 전체 댓글 목록 조회
	List<BoardCommentDto> findAllByNo(String bno);
	
	//댓글 한개 정보 조회
	BoardCommentDto findByOne(String bcno);
	
	//로그인한 사용자 정보 조회
	AccountDto findByUsername(String accountNo);
	
	//댓글 등록
	int insert(BoardCommentDto dto);
	
	//댓글 삭제
	int delete(String bcno);
	
	//댓글 수정
	int update(BoardCommentDto dto);
	
	//좋아요 여부 확인
	int findByCommentLike(CommentLikeDto dto);
	
	//좋아요 등록
	int insertCommentLike(CommentLikeDto dto);
	
	//좋아요 삭제
	int deleteCommentLike(CommentLikeDto dto);
	
	//댓글 신고 여부 조회
	int findReportByNo(CommentReportDto dto);
	
	//댓글 신고
	int saveReport(CommentReportDto dto);
}
