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
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [analysis, setAnalysis] = useState<UploadResponse['data'] | null>(null);

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
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    setAnalysis(null);
    
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let the browser set it with the correct boundary
        headers: {}
      });
      
      const result: UploadResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }
      
      setSuccess('Resume uploaded and analyzed successfully!');
      setAnalysis(result.data || null);
      
      // Reset file input
      const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload resume. Please try again.');
    } finally {
      setIsLoading(false);
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
