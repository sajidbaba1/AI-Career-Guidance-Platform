import { useState } from 'react';
import { Button, Text, Spacer, Radio, Loading, Note } from '@geist-ui/core';
import { questions } from '../data/quizQuestions';
import { analyzeResumeWithGemini } from '@lib/geminiService';

interface QuizResult {
  question: string;
  answer: string;
}

interface QuestionOption {
  question: string;
  options: { label: string; value: string }[];
}

export default function SkillsQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
    setError('');
  };

  const handleNext = () => {
    if (!answers[currentQuestion]) {
      setError('Please select an answer before proceeding');
      return;
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!answers[currentQuestion]) {
      setError('Please answer the current question before submitting');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const quizResults: QuizResult[] = questions.map((q, i) => ({
        question: q.question,
        answer: answers[i] || 'Not answered'
      }));
      
      const prompt = `Analyze these quiz responses and provide career guidance:\n\n${JSON.stringify(quizResults)}\n\n` +
        `Provide structured suggestions for:\n` +
        `1. Suitable career paths\n` +
        `2. Skills to improve\n` +
        `3. Potential job roles`;
      
      const analysis = await analyzeResumeWithGemini(prompt);
      
      if (analysis.isSuccess) {
        setResult(analysis.text);
      } else {
        setError('Failed to analyze your skills: ' + (analysis.error || 'Unknown error'));
      }
    } catch (err) {
      setError('An unexpected error occurred during analysis');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {isSubmitting ? (
        <Loading>Analyzing your skills</Loading>
      ) : result ? (
        <div>
          <Text h3>Your Skills Analysis</Text>
          <div className="whitespace-pre-wrap">{result}</div>
          <Spacer h={2} />
          <Button 
            onClick={() => {
              setResult('');
              setAnswers({});
              setCurrentQuestion(0);
              setError('');
            }}
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Start Over
          </Button>
        </div>
      ) : (
        <div>
          <Text h3>{questions[currentQuestion].question}</Text>
          <Spacer h={1} />
          <Radio.Group 
            value={answers[currentQuestion] || ''} 
            onChange={(value: string | number) => handleAnswer(value as string)}
          >
            {questions[currentQuestion].options.map((option, i) => (
              <Radio key={i} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
          {error && (
            <>
              <Spacer h={1} />
              <Note type="error" label="Error">{error}</Note>
            </>
          )}
          <Spacer h={2} />
          <div className="flex justify-between">
            <Button 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              Previous
            </Button>
            {currentQuestion < questions.length - 1 ? (
              <Button 
                onClick={handleNext}
                disabled={!answers[currentQuestion]}
                placeholder=""
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              >
                Next
              </Button>
            ) : (
              <Button 
                type="success" 
                onClick={handleSubmit}
                disabled={!answers[currentQuestion]}
                placeholder=""
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              >
                Submit
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
