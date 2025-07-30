'use client';

import { useState, useCallback } from 'react';
import { Button, Text, Radio, Loading, useToasts } from '@geist-ui/core';
import { ArrowLeft, ArrowRight, RotateCw } from '@geist-ui/icons';
import { questions } from '../data/quizQuestions';

interface QuizAnswer {
  questionId: number;
  answer: string;
}

interface QuizResult {
  analysis: string;
  recommendations: string[];
  score: number;
}

export default function SkillsQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { setToast } = useToasts();

  const handleAnswer = useCallback((value: string | number) => {
    try {
      // Handle both string and string[] from Radio.Group
      const answerValue = Array.isArray(value) ? value[0] : value;
      setAnswers(prev => ({
        ...prev,
        [currentQuestion]: answerValue
      }));
    } catch (err) {
      console.error('Error handling answer:', err);
      setToast({
        text: 'Failed to save your answer. Please try again.',
        type: 'error'
      });
    }
  }, [currentQuestion, setToast]);

  const handleNext = useCallback(() => {
    if (!answers[currentQuestion]) {
      setToast({
        text: 'Please select an answer before continuing',
        type: 'warning'
      });
      return;
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      // Scroll to top of question
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentQuestion, answers, setToast]);

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      // Scroll to top of question
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentQuestion]);

  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Check if all questions are answered
      const unansweredQuestions = questions.filter((_, index) => !answers[index]);
      if (unansweredQuestions.length > 0) {
        setError('Please answer all questions before submitting.');
        setToast({
          text: 'Please answer all questions before submitting',
          type: 'error'
        });
        return;
      }
      
      // Prepare answers for submission
      const submission: QuizAnswer[] = Object.entries(answers).map(([questionId, answer]) => ({
        questionId: parseInt(questionId, 10),
        answer
      }));
      
      // Simulate API call
      const mockResult: QuizResult = {
        analysis: 'Based on your responses, you have a strong foundation in problem-solving and technical skills. Your experience with programming concepts is at an intermediate level, and you show potential in machine learning.',
        recommendations: [
          'Consider taking advanced courses in data structures and algorithms',
          'Explore machine learning projects to apply your theoretical knowledge',
          'Participate in coding challenges to improve problem-solving speed'
        ],
        score: 78
      };
      
      // In a real app, you would send the answers to your API
      // const response = await fetch('/api/analyze-skills', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ answers: submission })
      // });
      // const result = await response.json();
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResult(mockResult);
      
      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit quiz';
      setError(errorMessage);
      setToast({
        text: 'Failed to submit quiz. Please try again.',
        type: 'error'
      });
      console.error('Error submitting quiz:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, setToast]);

  const resetQuiz = useCallback(() => {
    setResult(null);
    setAnswers({});
    setCurrentQuestion(0);
    setError(null);
  }, []);

  if (isSubmitting) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <Loading>Analyzing your skills</Loading>
        <Text p type="secondary" className="mt-4">
          This may take a moment...
        </Text>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <Text h3 className="text-2xl font-bold mb-4">Your Skills Analysis</Text>
          
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <Text p className="text-lg">{result.analysis}</Text>
            <div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <Text span className="font-medium">Skills Score</Text>
                <Text span className="font-bold">{result.score}/100</Text>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${result.score}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {result.recommendations.length > 0 && (
            <div className="mt-6">
              <Text h4 className="text-xl font-semibold mb-3">Recommendations</Text>
              <ul className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    <Text span className="text-gray-700 dark:text-gray-300">
                      {rec}
                    </Text>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button 
              onClick={resetQuiz}
              type="secondary"
              icon={<RotateCw />}
              className="w-full sm:w-auto"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              Take the Quiz Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="mb-6">
          <Text h3 className="text-xl font-semibold mb-4">
            {questions[currentQuestion].question}
          </Text>
          
          <Radio.Group 
            value={answers[currentQuestion] || ''} 
            onChange={handleAnswer}
            className="space-y-3"
          >
            {questions[currentQuestion].options.map((option, i) => (
              <Radio 
                key={`${currentQuestion}-${i}`} 
                value={option.value}
                className="block p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button 
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || isSubmitting}
            type="abort"
            icon={<ArrowLeft size={16} />}
            className="mb-3 sm:mb-0 sm:mr-3 w-full sm:w-auto justify-center"
            placeholder=""
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            Previous
          </Button>
          
          {currentQuestion < questions.length - 1 ? (
            <Button 
              onClick={handleNext}
              disabled={!answers[currentQuestion] || isSubmitting}
              type="secondary"
              iconRight={<ArrowRight size={16} />}
              className="w-full sm:w-auto justify-center"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={!answers[currentQuestion]}
              type="success"
              className="w-full sm:w-auto justify-center"
              placeholder=""
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
