package com.example.aicareerguidance.dto;

import lombok.Data;
import java.util.Map;

@Data
public class InterviewRequest {
    private String jobRole;
    private String domain;
    private String resume;
    private String round;
    private String favoriteLanguage;
    private String interviewMode;
    private Map<String, String> responses;
}