export interface ResumeUploadResponse {
  success: boolean;
  message: string;
  data?: {
    resumeId: string;
    skills: string[];
    experience: string[];
  };
}

export interface InterviewRequest {
  jobRole: string;
  domain: string;
  resumeId?: string;
  experienceLevel?: 'entry' | 'mid' | 'senior';
}

export interface InterviewResponse {
  interviewId: string;
  questions: {
    id: string;
    text: string;
    type: 'technical' | 'behavioral' | 'situational';
  }[];
}

export interface InterviewAnswer {
  questionId: string;
  answer: string;
  timeTaken: number; // in seconds
}

export interface InterviewEvaluation {
  score: number;
  feedback: string;
  strengths: string[];
  areasForImprovement: string[];
  suggestedLearningPaths: string[];
}
