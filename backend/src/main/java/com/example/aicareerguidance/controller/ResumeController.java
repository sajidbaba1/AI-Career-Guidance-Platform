package com.example.aicareerguidance.controller;

import com.example.aicareerguidance.service.ResumeProcessingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {
    
    private final ResumeProcessingService resumeService;
    
    public ResumeController(ResumeProcessingService resumeService) {
        this.resumeService = resumeService;
    }
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file) {
        String resumeText = resumeService.extractTextFromResume(file);
        return ResponseEntity.ok(resumeText);
    }
    
    @GetMapping("/skills/{resumeId}")
    public ResponseEntity<?> analyzeSkills(@PathVariable String resumeId) {
        // Implementation will go here
        return ResponseEntity.ok("Skills analysis");
    }
    
    @GetMapping("/recommendations/{resumeId}")
    public ResponseEntity<?> getRecommendations(@PathVariable String resumeId) {
        // Implementation will go here
        return ResponseEntity.ok("Career recommendations");
    }
}
