import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyD29IGPYefBzsWnP4R7v4k2uqTSOlqJ-9c');
const RATE_LIMIT_DELAY = 1000; // 1 second between requests
let lastRequestTime = 0;

interface GeminiResponse {
  text: string;
  isSuccess: boolean;
  error?: string;
}

export async function analyzeResumeWithGemini(resumeText: string): Promise<GeminiResponse> {
  try {
    // Rate limiting
    const now = Date.now();
    if (now - lastRequestTime < RATE_LIMIT_DELAY) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - (now - lastRequestTime)));
    }
    lastRequestTime = Date.now();

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Analyze this resume and provide career guidance:\n\n${resumeText}\n\n` +
      `Provide structured suggestions for:\n` +
      `1. Suitable career paths\n` +
      `2. Skills to improve\n` +
      `3. Potential job roles\n` +
      `4. Education recommendations`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    if (!response) throw new Error('No response from Gemini API');
    
    const text = response.text();
    if (!text) throw new Error('Empty response from Gemini API');
    
    return {
      text,
      isSuccess: true
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      text: '',
      isSuccess: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
