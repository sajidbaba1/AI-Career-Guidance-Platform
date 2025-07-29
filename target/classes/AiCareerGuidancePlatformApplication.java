package com.example.aicareerguidance;

import me.paulschwarz.springdotenv.DotenvPropertySource;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@PropertySource(factory = DotenvPropertySource.class, value = "classpath:.env")
public class AiCareerGuidancePlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiCareerGuidancePlatformApplication.class, args);
    }

}
