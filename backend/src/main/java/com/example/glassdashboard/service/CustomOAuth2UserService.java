package com.example.glassdashboard.service;

import com.example.glassdashboard.entity.User;
import com.example.glassdashboard.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

   private static final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);

   @Autowired
   private UserMapper userMapper;

   @Override
   public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
      OAuth2User oAuth2User = super.loadUser(userRequest);

      String provider = userRequest.getClientRegistration().getRegistrationId(); // google
      Map<String, Object> attributes = oAuth2User.getAttributes();
      String providerId = attributes.get("sub").toString();
      String email = attributes.get("email").toString();
      String name = attributes.get("name").toString();

      System.err.println("DEBUG: OAuth2 Login: Provider=" + provider + ", Email=" + email);

      // Check if user exists
      Optional<User> userOptional = userMapper.findByUsername(email);
      User user;
      if (userOptional.isPresent()) {
         user = userOptional.get();
         // Update info if needed
         user.setName(name);
         user.setProvider(provider.toUpperCase());
         user.setProviderId(providerId);
         userMapper.update(user);
      } else {
         // Register new user
         user = new User();
         user.setUsername(email); // Use email as username for Google login
         user.setName(name);
         user.setProvider(provider.toUpperCase());
         user.setProviderId(providerId);
         user.setRole("ROLE_USER");
         user.setPassword(""); // No password for OAuth users
         userMapper.insert(user);
      }

      return oAuth2User;
   }
}
