package com.security.game.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.annotation.SessionScope;

@Configuration
public class SessionConfig {

	@Bean
	public SessionBean sessionBean() {
		return new SessionBean();
	}
	
}
