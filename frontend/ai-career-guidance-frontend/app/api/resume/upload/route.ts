import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    // Forward to backend API
    const backendResponse = await fetch(
      'http://localhost:8080/api/resume/upload', 
      {
        method: 'POST',
        body: formData
      }
    );
    
    if (!backendResponse.ok) {
      throw new Error('Backend upload failed');
    }
    
    const result = await backendResponse.json();
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Resume upload failed' },
      { status: 500 }
    );
  }
}
