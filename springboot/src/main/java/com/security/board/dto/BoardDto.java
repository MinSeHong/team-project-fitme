package com.security.board.dto;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Alias("BoardDto")
public class BoardDto {
	
	private String bno;
	private String accountNo;
	private Date postDate;
	private String title;
	private int hitCount;
	private String boardCategory;
	private String boardComment;
	private String address;
	private Date editDate;
	private String[] boardImages;
	//좋아요 수 가져오기 위한 변수
	private int likes;
	//스크랩 수 가져오기 위한 변수
	private int scraps;
	//사용자 이름 가져오기 위한 변수
	private String name;
	//사용자 프로필 이미지
	private String image;
	//게시글에 달린 댓글 수
	private int comments;

}
