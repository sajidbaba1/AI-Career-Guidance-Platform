'use client';

import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { setInterviewMode } from '../../lib/features/interviewSlice';
import { useRouter } from 'next/navigation';

export default function InterviewMode() {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleModeSelect = (mode: 'panel' | 'one-to-one') => {
        dispatch(setInterviewMode(mode));
        router.push('/interview/aptitude');
    };

    return (
        <div className="dark:bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
            <motion.div
                className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl font-bold mb-4">Select Interview Mode</h1>
                <div className="space-y-4">
                    <button
                        onClick={() => handleModeSelect('one-to-one')}
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    >
                        One-to-One Interview
                    </button>
                    <button
                        onClick={() => handleModeSelect('panel')}
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    >
                        Panel Interview
                    </button>
                </div>
            </motion.div>
        </div>
    );
}