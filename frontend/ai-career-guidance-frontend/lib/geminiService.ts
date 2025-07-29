import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyD29IGPYefBzsWnP4R7v4k2uqTSOlqJ-9c');

interface GeminiResponse {
  text: string;
  isSuccess: boolean;
}

export async function analyzeResumeWithGemini(resumeText: string): Promise<GeminiResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Analyze this resume and provide career guidance:\n\n${resumeText}\n\n` +
      `Provide suggestions for career paths, skills to improve, and potential job roles.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return {
      text,
      isSuccess: true
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      text: 'Failed to analyze resume. Please try again.',
      isSuccess: false
    };
  }
}
