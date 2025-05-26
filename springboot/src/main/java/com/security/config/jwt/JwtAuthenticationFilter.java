package com.security.config.jwt;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.security.config.auth.PrincipalDetails;
import com.security.dto.LoginRequestDto;
import com.security.util.JWTOkens;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

// 스프링 시큐리티에서 UsernamePasswordAuthenticationFilter가 있음.
// /login요청해서 username,password 전송하면 (post)
// UsernamePasswordAuthenticationFilter 동작을 함
@Log4j2
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

  private AuthenticationManager authenticationManager;

  public JwtAuthenticationFilter(AuthenticationManager authenticationManager) {
    this.authenticationManager = authenticationManager;
  }

  // login 요청을하면 로그인 시도를 위해서 실행되는 함수
  @Override
  public Authentication attemptAuthentication(HttpServletRequest request,
      HttpServletResponse response) throws AuthenticationException {
    System.out.println("JwtAuthenticationFilter:로그인 시도 중");

    ObjectMapper om = new ObjectMapper();
    LoginRequestDto loginRequestDto = null;

    try {
     
      loginRequestDto = om.readValue(request.getInputStream(), LoginRequestDto.class);
      System.out.println("loginRequestDto:" + loginRequestDto);
    } catch (IOException e) {
      e.printStackTrace();
    }

    UsernamePasswordAuthenticationToken authenticationToken =
        new UsernamePasswordAuthenticationToken(loginRequestDto.getUsername(),
            loginRequestDto.getPassword());
    System.out.println("authenticationToken:" + authenticationToken);

    Authentication authentication = null;
    try {
    authentication = authenticationManager.authenticate(authenticationToken);
    System.out.println("authentication 찍히니? : "+authentication);
    }catch (AuthenticationException e) { 
    	log.error("Authentication Failure:", e);
	}catch (Exception e) {
	    log.error("Unexpected error:", e);
	}
    PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
    return authentication;
  }
  
  @Override
  protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
      FilterChain chain, Authentication authResult) throws IOException, ServletException {
    System.out.println("successfulAuthentication 실행 : 인증 완료 뜻");
    PrincipalDetails principalDetails = (PrincipalDetails) authResult.getPrincipal();


    Map<String, Object> payloads = new HashMap<>();// 사용자 임의 데이타 추가
    long expirationTime = 1000 * 60 * 60 * 3;// 토큰의 만료시간 설정(3시간)
    String token =
        JWTOkens.createToken(principalDetails.getDto().getAccountNo(), 
        		 payloads, expirationTime);
    Cookie cookie = new Cookie("Authorization", token);
    cookie.setPath("/");
    response.addCookie(cookie);
    
  }
}
