'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
    setCurrentRound,
    setResponse,
    setFavoriteLanguage,
    setReport,
    setLoading,
    setError,
} from '../lib/features/interviewSlice';
import { RootState } from '../lib/store';
import { useRouter } from 'next/navigation';

interface InterviewRoundProps {
    round: 'aptitude' | 'technical' | 'coding_hr';
}

export default function InterviewRound({ round }: InterviewRoundProps) {
    const dispatch = useDispatch();
    const router = useRouter();
    const { jobRole, domain, resume, favoriteLanguage, interviewMode, responses } = useSelector(
        (state: RootState) => state.interview
    );
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLanguageAsked, setIsLanguageAsked] = useState(false);

    useEffect(() => {
        dispatch(setCurrentRound(round));
        fetchQuestion();
    }, [round, dispatch, fetchQuestion]);

    const fetchQuestion = async () => {
        dispatch(setLoading(true));
        try {
            const res = await axios.post('http://localhost:8080/api/ai/interview/question', {
                jobRole,
                domain,
                resume,
                round,
                favoriteLanguage,
                interviewMode,
            });
            setQuestion(res.data.question);
            if (round === 'coding_hr' && !isLanguageAsked) {
                setQuestion('What is your favorite programming language?');
                setIsLanguageAsked(true);
            }
        } catch (err) {
            dispatch(setError('Failed to fetch question'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setResponse({ question, answer }));
        if (round === 'coding_hr' && !favoriteLanguage) {
            dispatch(setFavoriteLanguage(answer));
            fetchQuestion();
            return;
        }
        try {
            if (round === 'coding_hr') {
                const res = await axios.post('http://localhost:8080/api/ai/interview/report', {
                    jobRole,
                    domain,
                    resume,
                    responses: { ...responses, [question]: answer },
                    favoriteLanguage,
                });
                dispatch(setReport(res.data));
                router.push('/report');
            } else {
                router.push(`/interview/${round === 'aptitude' ? 'technical' : 'coding_hr'}`);
            }
        } catch (err) {
            dispatch(setError('Failed to process response'));
        }
    };

    return (
        <div className="dark:bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
            <motion.div
                className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl font-bold mb-4">{round.toUpperCase()} Round</h1>
                <p className="mb-4">{question}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
             <textarea
                 className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                 rows={4}
                 value={answer}
                 onChange={(e) => setAnswer(e.target.value)}
                 placeholder="Your answer..."
             />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    >
                        Submit Answer
                    </button>
                </form>
            </motion.div>
        </div>
    );
}