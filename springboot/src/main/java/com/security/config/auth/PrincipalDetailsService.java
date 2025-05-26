package com.security.config.auth;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.security.model.UserDto;
import com.security.service.UserService;


@Service
public class PrincipalDetailsService implements UserDetailsService {

  private UserService service;

  public PrincipalDetailsService(UserService service) {
    this.service = service;
  }


  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
	System.out.println("username == :" + username);
    UserDto userEntity = service.findAccountByUsername(username);
    System.out.println("userEntity 찍혀? :" + userEntity);
    if (userEntity != null) {
      return new PrincipalDetails(userEntity);
    }
    return null;
  }
}
