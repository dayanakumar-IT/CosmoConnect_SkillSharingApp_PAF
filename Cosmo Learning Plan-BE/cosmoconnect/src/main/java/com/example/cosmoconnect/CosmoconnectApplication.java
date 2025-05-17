package com.example.cosmoconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootApplication
public class CosmoconnectApplication {
	@Bean
	public ObjectMapper objectMapper() {
		return new ObjectMapper();
	}
	public static void main(String[] args) {
		SpringApplication.run(CosmoconnectApplication.class, args);
	}

}