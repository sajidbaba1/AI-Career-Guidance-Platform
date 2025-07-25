import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InterviewState {
    jobRole: string;
    domain: string;
    resume: string;
    favoriteLanguage: string;
    interviewMode: 'panel' | 'one-to-one';
    currentRound: 'aptitude' | 'technical' | 'coding_hr' | null;
    responses: { [key: string]: string };
    report: { selected: boolean; feedback: string } | null;
    loading: boolean;
    error: string | null;
    theme: 'dark' | 'light';
}

const initialState: InterviewState = {
    jobRole: '',
    domain: '',
    resume: '',
    favoriteLanguage: '',
    interviewMode: 'one-to-one',
    currentRound: null,
    responses: {},
    report: null,
    loading: false,
    error: null,
    theme: 'dark',
};

const interviewSlice = createSlice({
    name: 'interview',
    initialState,
    reducers: {
        setJobRole(state, action: PayloadAction<string>) {
            state.jobRole = action.payload;
        },
        setDomain(state, action: PayloadAction<string>) {
            state.domain = action.payload;
        },
        setResume(state, action: PayloadAction<string>) {
            state.resume = action.payload;
        },
        setFavoriteLanguage(state, action: PayloadAction<string>) {
            state.favoriteLanguage = action.payload;
        },
        setInterviewMode(state, action: PayloadAction<'panel' | 'one-to-one'>) {
            state.interviewMode = action.payload;
        },
        setCurrentRound(state, action: PayloadAction<'aptitude' | 'technical' | 'coding_hr' | null>) {
            state.currentRound = action.payload;
        },
        setResponse(state, action: PayloadAction<{ question: string; answer: string }>) {
            state.responses[action.payload.question] = action.payload.answer;
        },
        setReport(state, action: PayloadAction<{ selected: boolean; feedback: string }>) {
            state.report = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        toggleTheme(state) {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
        },
    },
});

export const {
    setJobRole,
    setDomain,
    setResume,
    setFavoriteLanguage,
    setInterviewMode,
    setCurrentRound,
    setResponse,
    setReport,
    setLoading,
    setError,
    toggleTheme,
} = interviewSlice.actions;
export default interviewSlice.reducer;