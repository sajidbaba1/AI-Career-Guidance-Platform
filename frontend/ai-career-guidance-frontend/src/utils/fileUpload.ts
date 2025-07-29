import { api } from '@/lib/api';
import { ResumeUploadResponse } from '@/types';

export const uploadResume = async (file: File): Promise<ResumeUploadResponse> => {
  const formData = new FormData();
  formData.append('resume', file);

  try {
    const response = await api.post('/api/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw new Error('Failed to upload resume. Please try again.');
  }
};

export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Invalid file type. Please upload a PDF or Word document.' 
    };
  }

  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: 'File is too large. Maximum size is 5MB.' 
    };
  }

  return { isValid: true };
};
