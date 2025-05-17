package com.example.cosmoconnect.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.filter.HiddenHttpMethodFilter;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Bean
    public HiddenHttpMethodFilter hiddenHttpMethodFilter() {
        return new HiddenHttpMethodFilter();
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods(
                HttpMethod.GET.name(),
                HttpMethod.POST.name(),
                HttpMethod.PUT.name(),
                HttpMethod.PATCH.name(),
                HttpMethod.DELETE.name(),
                HttpMethod.OPTIONS.name(),
                HttpMethod.HEAD.name()
            )
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String userDir = System.getProperty("user.dir");
        registry.addResourceHandler("/api/posts/files/**")
                .addResourceLocations("file:" + userDir + "/uploads/posts/");
        registry.addResourceHandler("/api/competitions/files/**")
                .addResourceLocations("file:" + userDir + "/uploads/competitions/");
        registry.addResourceHandler("/api/learningplans/files/**")
                .addResourceLocations("file:" + userDir + "/uploads/learningplans/");
    }
} 