'use client';

import { useState, useCallback } from 'react';
import { Button, Loading, Note, Text } from '@geist-ui/core';
import { Upload } from '@geist-ui/icons'; // Import the Upload icon

interface UploadResponse {
  success: boolean;
  message?: string;
  data?: {
    skills?: string[];
    experience?: string;
    education?: string;
  };
}

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [analysis, setAnalysis] = useState<UploadResponse['data'] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = useCallback((file: File): { valid: boolean; message?: string } => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
      return { 
        valid: false, 
        message: 'Please upload a PDF, DOC, or DOCX file' 
      };
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return { 
        valid: false, 
        message: 'File size must be less than 5MB' 
      };
    }
    
    return { valid: true };
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) {
      return;
    }
    
    const droppedFile = e.dataTransfer.files[0];
    const validation = validateFile(droppedFile);
    
    if (!validation.valid) {
      setError(validation.message || 'Invalid file');
      toast({
        title: 'Error',
        description: validation.message || 'Invalid file',
        variant: 'destructive',
      });
      return;
    }
    
    setFile(droppedFile);
  }, [validateFile, toast]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setSuccess('');
    setAnalysis(null);
    
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      return;
    }
    
    const selectedFile = e.target.files[0];
    const validation = validateFile(selectedFile);
    
    if (!validation.valid) {
      setError(validation.message || 'Invalid file');
      toast({
        title: 'Error',
        description: validation.message || 'Invalid file',
        variant: 'destructive',
      });
      return;
    }
    
    setFile(selectedFile);
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setSuccess('');
    setAnalysis(null);
    
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      return;
    }
    
    const selectedFile = e.target.files[0];
    const validation = validateFile(selectedFile);
    
    if (!validation.valid) {
      setError(validation.message || 'Invalid file');
      return;
    }
    
    setFile(selectedFile);
  }, [validateFile]);

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      toast({
        title: 'Error',
        description: 'Please select a file first',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    setAnalysis(null);
    setProgress(0);
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      // Convert file to base64 for Gemini API
      const base64File = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
      
      // Call Gemini API for analysis
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze this resume and provide key insights:\n${base64File}\n\nFocus on:
1. Key skills and technologies
2. Years of experience
3. Education background
4. Career highlights
5. Areas for improvement

Format the response as JSON with these fields: {"skills": string[], "experience": string, "education": string, "highlights": string[], "improvements": string[]}`
            }]
          }]
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to analyze resume');
      }
      
      const result = await response.json();
      const analysisResult = JSON.parse(result.candidates[0].content.parts[0].text);
      
      // Complete progress
      setProgress(100);
      
      // Set analysis results
      setAnalysis({
        skills: analysisResult.skills || [],
        experience: analysisResult.experience || '',
        education: analysisResult.education || '',
        highlights: analysisResult.highlights || [],
        improvements: analysisResult.improvements || []
      });
      
      setSuccess('Resume analyzed successfully!');
      
      toast({
        title: 'Success',
        description: 'Your resume has been analyzed successfully!',
      });
      
    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze resume. Please try again.';
      setError(errorMessage);
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Upload size={32} className="text-gray-400" />
          <div>
            <Text p className="text-gray-600 dark:text-gray-300">
              <label 
                htmlFor="resume-upload" 
                className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none"
              >
                <span>Upload a file</span>
                <input 
                  id="resume-upload"
                  name="resume-upload"
                  type="file" 
                  onChange={handleFileChange}
                  className="sr-only"
                  accept=".pdf,.doc,.docx"
                  aria-label="Choose resume file"
                />
              </label>
              <span className="pl-1">or drag and drop</span>
            </Text>
            <Text small className="text-gray-500 dark:text-gray-400">
              PDF, DOC, or DOCX up to 5MB
            </Text>
          </div>
          {file && (
            <Text small className="text-gray-700 dark:text-gray-300 mt-2">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </Text>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleUpload}
          disabled={!file || isLoading}
          loading={isLoading}
          type="success"
          icon={!isLoading ? <Upload /> : undefined}
          aria-label="Upload resume"
          className="w-full sm:w-auto"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Resume'}
        </Button>
      </div>
      
      {error && (
        <Note type="error" label="Error" className="mt-4">
          {error}
        </Note>
      )}
      
      {success && (
        <Note type="success" label="Success" className="mt-4">
          {success}
        </Note>
      )}
      
      {analysis && (
        <div className="mt-6 space-y-4">
          <Text h4>Analysis Results</Text>
          
          {analysis.skills && analysis.skills.length > 0 && (
            <div>
              <Text h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Key Skills
              </Text>
              <div className="flex flex-wrap gap-2 mt-2">
                {analysis.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {analysis.experience && (
            <div className="mt-4">
              <Text h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Experience
              </Text>
              <Text p className="mt-1 text-gray-600 dark:text-gray-400">
                {analysis.experience}
              </Text>
            </div>
          )}
          
          {analysis.education && (
            <div className="mt-4">
              <Text h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Education
              </Text>
              <Text p className="mt-1 text-gray-600 dark:text-gray-400">
                {analysis.education}
              </Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
