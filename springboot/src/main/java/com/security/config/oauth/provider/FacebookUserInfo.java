package com.security.config.oauth.provider;

import java.util.Map;

public class FacebookUserInfo implements OAuth2UserInfo{
	
	private Map<String, Object> attributes; //oauth2User.getAttribute()
	
	public FacebookUserInfo(Map<String, Object> attributes) {
		this.attributes = attributes;
	}
	
	@Override
	public String getProviderId() {
		return (String)attributes.get("id");
	}

	@Override
	public String getProvider() {
		return "facebook";
	}
	
}
