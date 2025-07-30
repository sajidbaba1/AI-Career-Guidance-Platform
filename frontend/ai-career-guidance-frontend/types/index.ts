export interface ResumeUploadResponse {
  success: boolean;
  message: string;
  data?: {
    filePath: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    // Add any additional fields your API returns
  };
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}
