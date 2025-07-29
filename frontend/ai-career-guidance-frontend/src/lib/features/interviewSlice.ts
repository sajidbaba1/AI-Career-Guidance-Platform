import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InterviewState {
  jobRole: string;
  domain: string;
  resume: string;
  favoriteLanguage: string;
  interviewMode: string;
  responses: any[];
  currentQuestion: number;
  isInterviewComplete: boolean;
  currentRound: string;
  report: any;
  loading: boolean;
  error: string | null;
}

const initialState: InterviewState = {
  jobRole: '',
  domain: '',
  resume: '',
  favoriteLanguage: '',
  interviewMode: '',
  responses: [],
  currentQuestion: 0,
  isInterviewComplete: false,
  currentRound: '',
  report: null,
  loading: false,
  error: null,
};

export const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setInterviewData: (state, action: PayloadAction<Partial<InterviewState>>) => {
      return { ...state, ...action.payload };
    },
    setCurrentRound: (state, action: PayloadAction<string>) => {
      state.currentRound = action.payload;
    },
    setResponse: (state, action: PayloadAction<{question: string; answer: string}>) => {
      state.responses.push({
        question: action.payload.question,
        answer: action.payload.answer,
        round: state.currentRound,
        timestamp: new Date().toISOString(),
      });
    },
    setFavoriteLanguage: (state, action: PayloadAction<string>) => {
      state.favoriteLanguage = action.payload;
    },
    setReport: (state, action: PayloadAction<any>) => {
      state.report = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetInterview: () => initialState,
  },
});

export const {
  setInterviewData,
  setCurrentRound,
  setResponse,
  setFavoriteLanguage,
  setReport,
  setLoading,
  setError,
  resetInterview,
} = interviewSlice.actions;
export default interviewSlice.reducer;
