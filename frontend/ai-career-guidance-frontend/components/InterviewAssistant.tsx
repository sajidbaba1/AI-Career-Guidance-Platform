'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

declare global {
  interface Window {
    Vapi: any;
  }
}

interface InterviewAssistantProps {
  resumeAnalysis: {
    skills?: string[];
    experience?: string;
    education?: string;
  } | null;
}

export default function InterviewAssistant({ resumeAnalysis }: InterviewAssistantProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const vapiRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize Vapi client
    const initVapi = async () => {
      try {
        const Vapi = (await import('@vapi-ai/web')).default;
        vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY || '');
        
        vapiRef.current.on('call-start', () => {
          setIsCallActive(true);
          setTranscript('');
        });
        
        vapiRef.current.on('call-end', () => {
          setIsCallActive(false);
        });
        
        vapiRef.current.on('transcript', (t: any) => {
          if (t.transcript) {
            setTranscript(prev => prev + '\n' + t.transcript);
          }
        });
        
        vapiRef.current.on('error', (error: any) => {
          console.error('Vapi error:', error);
          toast({
            title: 'Error',
            description: error.message || 'An error occurred with the interview assistant',
            variant: 'destructive',
          });
          setIsCallActive(false);
        });
      } catch (error) {
        console.error('Failed to initialize Vapi:', error);
        toast({
          title: 'Error',
          description: 'Failed to initialize the interview assistant',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    initVapi();

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, [toast]);

  const toggleCall = async () => {
    if (!resumeAnalysis) {
      toast({
        title: 'Error',
        description: 'Please analyze your resume first',
        variant: 'destructive',
      });
      return;
    }

    if (isCallActive) {
      try {
        await vapiRef.current.stop();
      } catch (error) {
        console.error('Error stopping call:', error);
      }
      setIsCallActive(false);
    } else {
      setIsLoading(true);
      try {
        const skills = resumeAnalysis.skills?.join(', ') || 'various technical and professional';
        const experience = resumeAnalysis.experience || 'your professional background';
        
        await vapiRef.current.start({
          model: {
            provider: 'openai',
            model: 'gpt-4',
            systemPrompt: `You are a professional technical interviewer. The candidate's resume indicates they have experience with: ${skills}.
            Their experience includes: ${experience}.
            
            Please conduct a technical interview focusing on their skills and experience.
            Ask one question at a time and wait for the response before moving to the next question.
            Provide feedback and ask follow-up questions based on their answers.`,
          },
          voice: {
            provider: '11labs',
            voiceId: '21m00Tcm4TlvDq8ikWAM', // Professional voice
          },
        });
      } catch (error: any) {
        console.error('Error starting call:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to start the interview',
          variant: 'destructive',
        });
        setIsCallActive(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !vapiRef.current) return;
    
    try {
      await vapiRef.current.send({
        type: 'user-message',
        message: inputMessage,
      });
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold tracking-tight">AI-Powered Interview</h3>
        <p className="text-muted-foreground">
          Practice your interview skills with our AI interviewer
        </p>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className={`h-24 w-24 rounded-full flex items-center justify-center ${
                isCallActive 
                  ? 'bg-green-100 dark:bg-green-900/30' 
                  : 'bg-muted'
              }`}>
                {isLoading ? (
                  <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                ) : (
                  <div className="relative">
                    <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                      isCallActive 
                        ? 'bg-green-500 text-white' 
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      {isCallActive ? (
                        <MicOff className="h-6 w-6" />
                      ) : (
                        <Mic className="h-6 w-6" />
                      )}
                    </div>
                    {isCallActive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {isCallActive && (
                <div className="absolute -bottom-2 -right-2 h-5 w-5 rounded-full bg-green-500 border-2 border-background"></div>
              )}
            </div>
            
            <Button
              onClick={toggleCall}
              disabled={isLoading}
              className={`w-full max-w-xs ${
                isCallActive 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isCallActive ? 'Ending...' : 'Starting...'}
                </>
              ) : isCallActive ? (
                'End Interview'
              ) : (
                'Start Interview'
              )}
            </Button>
            
            <p className="text-sm text-muted-foreground text-center">
              {isCallActive 
                ? 'Interview in progress...' 
                : 'Click start to begin your practice interview'}
            </p>
          </div>
          
          {(isCallActive || transcript) && (
            <div className="mt-8 space-y-4">
              <h4 className="font-semibold">Conversation</h4>
              <div className="h-48 overflow-y-auto p-4 bg-muted/20 rounded-lg">
                {transcript ? (
                  <p className="whitespace-pre-wrap text-sm">{transcript}</p>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    The conversation will appear here...
                  </p>
                )}
              </div>
              
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-1 px-4 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!isCallActive}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!isCallActive || !inputMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
