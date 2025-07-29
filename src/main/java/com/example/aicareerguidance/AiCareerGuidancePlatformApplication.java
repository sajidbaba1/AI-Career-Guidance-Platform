package com.example.aicareerguidance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
public class AiCareerGuidancePlatformApplication {
    public static void main(String[] args) {
        SpringApplication.run(AiCareerGuidancePlatformApplication.class, args);
    }
}
