package com.example.aicareerguidance.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Interview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String jobRole;
    private String domain;
    private String resumeText;
    private String favoriteLanguage;
    private String interviewMode;
    @Column(columnDefinition = "TEXT")
    private String responses;
    private boolean selected;
    @Column(columnDefinition = "TEXT")
    private String feedback;
}