package com.security.accountcontroller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.security.service.UserService;



@RestController
@CrossOrigin
public class UpdateController {
	
	private final UserService userService;
	private BCryptPasswordEncoder passwordEncoder;

    public UpdateController(UserService userService, BCryptPasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }
	

    @PostMapping("/updatepwd")
	public ResponseEntity<String> changePassword(@RequestBody Map<String, String> requestBody) {
		try {
			String username = requestBody.get("username");
			String newPassword = requestBody.get("newPassword");
			
			String encodedPassword = passwordEncoder.encode(newPassword);
			
			userService.updatePasswordByUsername(username, encodedPassword);
			return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
		} catch (UsernameNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
			                     .body("사용자명을 찾을 수 없습니다.");
		}
	}

	  // 회원 탈퇴 처리
	    @PutMapping("/users/{accountNo}")
	    public ResponseEntity<String> leaveMember(@PathVariable long accountNo) {
	        try {
	            userService.leaveAccountByAccountNo(accountNo);
	            return new ResponseEntity<>("회원 탈퇴가 완료되었습니다.", HttpStatus.OK);
	        } catch (Exception e) {
	            return new ResponseEntity<>("회원 탈퇴 실패: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }
	  
	
}
