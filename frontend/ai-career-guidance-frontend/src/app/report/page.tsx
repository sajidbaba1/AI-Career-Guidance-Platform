'use client';

import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../../lib/store';

export default function Report() {
    const { report } = useSelector((state: RootState) => state.interview);

    return (
        <div className="dark:bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
            <motion.div
                className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl font-bold mb-4">Interview Report</h1>
                {report ? (
                    <>
                        <p className="mb-4">
                            <strong>Status:</strong> {report.selected ? 'Selected' : 'Not Selected'}
                        </p>
                        <p className="mb-4">
                            <strong>Feedback:</strong> {report.feedback}
                        </p>
                    </>
                ) : (
                    <p>No report available</p>
                )}
            </motion.div>
        </div>
    );
}