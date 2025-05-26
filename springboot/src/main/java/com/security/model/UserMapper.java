package com.security.model;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {

  int insertMember(UserDto dto);
  
  int insertSocial(UserDto dto);
  
  int insertMemberWithSocial(UserDto dto);
  
  int insertMemberInBody(UserDto dto);
  
  
  UserDto findAccountByUsername(String username);

  UserDto findAccountByProviderId(String providerId);
  
  UserDto findMemberInfoByUsername(String username);
  
  UserDto findAccountByAccountNo(String accountNo);
  
  String selectPasswordByUsername(String username);

  void leaveMember(long accountNo);
  
  void updatePasswordByUsername(Map<String, Object> parameters);
  
}
