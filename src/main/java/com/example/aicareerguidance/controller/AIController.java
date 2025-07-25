package com.example.aicareerguidance.controller;

import com.example.aicareerguidance.dto.InterviewRequest;
import com.example.aicareerguidance.dto.InterviewResponse;
import com.example.aicareerguidance.dto.ReportResponse;
import com.example.aicareerguidance.dto.ResumeRequest;
import com.example.aicareerguidance.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:3000")
public class AIController {
    private final AIService aiService;

    @Autowired
    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/resume")
    public ResumeRequest uploadResume(@RequestParam("resume") MultipartFile file) throws IOException {
        return aiService.processResume(file);
    }

    @PostMapping("/interview/question")
    public InterviewResponse getQuestion(@RequestBody InterviewRequest request) {
        return aiService.getInterviewQuestion(request);
    }

    @PostMapping("/interview/report")
    public ReportResponse generateReport(@RequestBody InterviewRequest request) throws IOException {
        return aiService.generateReport(request);
    }
}