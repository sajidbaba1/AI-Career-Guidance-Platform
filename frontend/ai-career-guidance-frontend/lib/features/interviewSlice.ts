import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InterviewState {
  jobRole: string;
  isDarkMode: boolean;
  // Add other interview-related state here
}

const initialState: InterviewState = {
  jobRole: '',
  isDarkMode: false,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setJobRole: (state, action: PayloadAction<string>) => {
      state.jobRole = action.payload;
    },
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    // Add other reducers as needed
  },
});

export const { setJobRole, toggleTheme } = interviewSlice.actions;
export default interviewSlice.reducer;
