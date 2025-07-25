'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { setJobRole, setDomain, toggleTheme } from '../lib/features/interviewSlice';
import { RootState } from '../lib/store';
import { useRouter } from 'next/navigation';

export default function Home() {
    const dispatch = useDispatch();
    const { theme } = useSelector((state: RootState) => state.interview);
    const [jobRole, setJobRoleInput] = useState('');
    const [domain, setDomainInput] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setJobRole(jobRole));
        dispatch(setDomain(domain));
        router.push('/resume-upload');
    };

    return (
        <div className={`${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-black'} min-h-screen flex flex-col items-center justify-center p-4`}>
            <motion.div
                className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl font-bold mb-4">AI Career Guidance Platform</h1>
                <button
                    onClick={() => dispatch(toggleTheme())}
                    className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
                </button>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Job Role</label>
                        <input
                            type="text"
                            value={jobRole}
                            onChange={(e) => setJobRoleInput(e.target.value)}
                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                            placeholder="e.g., Software Engineer"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Domain</label>
                        <input
                            type="text"
                            value={domain}
                            onChange={(e) => setDomainInput(e.target.value)}
                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                            placeholder="e.g., Web Development"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    >
                        Proceed to Resume Upload
                    </button>
                </form>
            </motion.div>
        </div>
    );
}