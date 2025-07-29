package com.example.aicareerguidance;

import com.example.aicareerguidance.config.TestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = {AiCareerGuidancePlatformApplication.class, TestConfig.class})
@ActiveProfiles("test")
class AiCareerGuidancePlatformApplicationTests {

    @Test
    void contextLoads() {
        // This test verifies that the application context loads successfully
    }
}
