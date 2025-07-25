package com.example.aicareerguidance.repository;

import com.example.aicareerguidance.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
}