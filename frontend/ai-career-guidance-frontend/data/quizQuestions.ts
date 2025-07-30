export interface Question {
  question: string;
  options: {
    label: string;
    value: string;
  }[];
}

export const questions: Question[] = [
  {
    question: "How comfortable are you with programming concepts?",
    options: [
      { label: "Beginner", value: "1" },
      { label: "Some experience", value: "2" },
      { label: "Comfortable", value: "3" },
      { label: "Very comfortable", value: "4" },
      { label: "Expert", value: "5" }
    ]
  },
  {
    question: "How would you rate your problem-solving skills?",
    options: [
      { label: "Novice", value: "1" },
      { label: "Developing", value: "2" },
      { label: "Competent", value: "3" },
      { label: "Advanced", value: "4" },
      { label: "Exceptional", value: "5" }
    ]
  },
  {
    question: "How experienced are you with machine learning concepts?",
    options: [
      { label: "No experience", value: "1" },
      { label: "Basic understanding", value: "2" },
      { label: "Some practical experience", value: "3" },
      { label: "Comfortable implementing models", value: "4" },
      { label: "Expert level", value: "5" }
    ]
  }
];
