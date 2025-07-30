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
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Resume Analysis</h2>
        <p className="text-muted-foreground">
          Upload your resume to get personalized career insights and recommendations
        </p>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Upload Your Resume</CardTitle>
          <CardDescription>
            We support PDF, DOC, and DOCX files up to 5MB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10">
                <UploadIcon className="h-8 w-8 text-primary" />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, DOC, or DOCX (max. 5MB)
                </p>
              </div>
              
              <input 
                ref={fileInputRef}
                type="file" 
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx"
                aria-label="Choose resume file"
              />
            </div>
          </div>
          
          {file && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="mt-6">
            <Button 
              onClick={handleUpload}
              disabled={!file || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Resume'
              )}
            </Button>
            
            {isLoading && progress > 0 && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analyzing resume...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {analysis && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold tracking-tight">Analysis Results</h3>
            <p className="text-muted-foreground">
              Here's what we found in your resume
            </p>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              {analysis.skills && analysis.skills.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3">Key Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid gap-6 md:grid-cols-2">
                {analysis.experience && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Experience</h4>
                    <p className="text-muted-foreground">
                      {analysis.experience}
                    </p>
                  </div>
                )}
                
                {analysis.education && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Education</h4>
                    <p className="text-muted-foreground">
                      {analysis.education}
                    </p>
                  </div>
                )}
              </div>
              
              {analysis.highlights && analysis.highlights.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-3">Career Highlights</h4>
                  <ul className="space-y-2">
                    {analysis.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-primary">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="ml-2 text-muted-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {analysis.improvements && analysis.improvements.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-3">Areas for Improvement</h4>
                  <ul className="space-y-2">
                    {analysis.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-yellow-500">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="ml-2 text-muted-foreground">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => {
                setFile(null);
                setAnalysis(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              Analyze Another Resume
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
