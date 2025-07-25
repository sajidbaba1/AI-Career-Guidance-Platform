package com.example.aicareerguidance.service;

import com.example.aicareerguidance.dto.InterviewRequest;
import com.example.aicareerguidance.dto.InterviewResponse;
import com.example.aicareerguidance.dto.ReportResponse;
import com.example.aicareerguidance.dto.ResumeRequest;
import com.example.aicareerguidance.model.Interview;
import com.example.aicareerguidance.repository.InterviewRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class AIService {
    private final ChatClient chatClient;
    private final StringRedisTemplate redisTemplate;
    private final InterviewRepository interviewRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public AIService(ChatClient.Builder chatClientBuilder, StringRedisTemplate redisTemplate,
                     InterviewRepository interviewRepository, ObjectMapper objectMapper) {
        this.chatClient = chatClientBuilder.build();
        this.redisTemplate = redisTemplate;
        this.interviewRepository = interviewRepository;
        this.objectMapper = objectMapper;
    }

    public ResumeRequest processResume(MultipartFile file) throws IOException {
        String resumeText = new String(file.getBytes());
        ResumeRequest response = new ResumeRequest();
        response.setResumeText(resumeText);
        return response;
    }

    public InterviewResponse getInterviewQuestion(InterviewRequest request) {
        String cacheKey = String.format("interview:%s:%s:%s", request.getJobRole(), request.getDomain(), request.getRound());
        String cachedQuestion = redisTemplate.opsForValue().get(cacheKey);

        if (cachedQuestion != null) {
            InterviewResponse response = new InterviewResponse();
            response.setQuestion(cachedQuestion);
            return response;
        }

        String prompt = String.format(
                "You are a female interviewer. Generate a %s question for a %s interview for a %s role in the %s domain. Consider the resume: %s. %s",
                request.getRound(), request.getInterviewMode(), request.getJobRole(), request.getDomain(),
                request.getResume(), request.getFavoriteLanguage().isEmpty() ? "" : "Focus on " + request.getFavoriteLanguage()
        );
        String question = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        redisTemplate.opsForValue().set(cacheKey, question);
        InterviewResponse response = new InterviewResponse();
        response.setQuestion(question);
        return response;
    }

    public ReportResponse generateReport(InterviewRequest request) throws IOException {
        String responsesJson = objectMapper.writeValueAsString(request.getResponses());
        String prompt = String.format(
                "You are a female interviewer. Evaluate the candidate for a %s role in the %s domain based on their resume: %s, responses: %s, and favorite language: %s. Provide a selection status (true/false) and detailed feedback.",
                request.getJobRole(), request.getDomain(), request.getResume(), responsesJson, request.getFavoriteLanguage()
        );
        String report = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        ReportResponse response = new ReportResponse();
        response.setSelected(report.contains("Selected"));
        response.setFeedback(report);

        Interview interview = new Interview();
        interview.setJobRole(request.getJobRole());
        interview.setDomain(request.getDomain());
        interview.setResumeText(request.getResume());
        interview.setFavoriteLanguage(request.getFavoriteLanguage());
        interview.setInterviewMode(request.getInterviewMode());
        interview.setResponses(responsesJson);
        interview.setSelected(response.isSelected());
        interview.setFeedback(response.getFeedback());
        interviewRepository.save(interview);

        return response;
    }
}