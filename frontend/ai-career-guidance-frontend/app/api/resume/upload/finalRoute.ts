import { analyzeResumeWithGemini } from '@lib/geminiService';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    const fileText = await file.text();
    const analysis = await analyzeResumeWithGemini(fileText);
    
    if (!analysis.isSuccess) {
      throw new Error('Failed to analyze resume');
    }
    
    return NextResponse.json({
      message: 'Resume analyzed successfully',
      analysis: analysis.text
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Backend upload failed' },
      { status: 500 }
    );
  }
}
