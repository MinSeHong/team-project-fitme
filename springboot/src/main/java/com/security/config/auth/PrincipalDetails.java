package com.security.config.auth;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import com.security.model.UserDto;
import lombok.Data;


@Data
public class PrincipalDetails implements UserDetails, OAuth2User {


  private UserDto dto;
  private Map<String, Object> attributes;

  public PrincipalDetails(UserDto dto) {
    this.dto = dto;
  }

  public PrincipalDetails(UserDto dto, Map<String, Object> attributes) {
    this.dto = dto;
    this.attributes = attributes;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    Collection<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
//    dto = new UserDto(); // 수정함
    dto.getRoleList().forEach(r -> {
      authorities.add(() -> {
        return r;
      });
    });
    return authorities;
  }

  @Override
  public String getPassword() {
    return dto.getPassword();
  }

  @Override
  public String getUsername() {
    return dto.getUsername();
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

  @Override
  public Map<String, Object> getAttributes() {
    return attributes;
  }

  @Override
  public String getName() {
    return null;
  }

}
