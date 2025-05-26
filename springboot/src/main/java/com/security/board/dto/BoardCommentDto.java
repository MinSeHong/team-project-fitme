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
@Alias("BoardCommentDto")
public class BoardCommentDto {
	private String bcno;
	private String bno;
	private String accountNo;
	private Date postDate;
	private String bcComment;
	private Long replyNo;
	private Date editDate;
	//댓글을 작성한 사용자 이름
	private String name;
}
