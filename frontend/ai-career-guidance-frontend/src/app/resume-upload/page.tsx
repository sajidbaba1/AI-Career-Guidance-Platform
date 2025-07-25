'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { setResume } from '../../lib/features/interviewSlice';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ResumeUpload() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Please upload a resume');
            return;
        }
        const formData = new FormData();
        formData.append('resume', file);
        try {
            const res = await axios.post('http://localhost:8080/api/ai/resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            dispatch(setResume(res.data.resumeText));
            router.push('/interview-mode');
        } catch (err) {
            setError('Failed to upload resume');
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
                <h1 className="text-2xl font-bold mb-4">Upload Resume</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="file"
                        accept=".txt,.pdf"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    >
                        Upload and Proceed
                    </button>
                    {error && <p className="text-red-500">{error}</p>}
                </form>
            </motion.div>
        </div>
    );
}