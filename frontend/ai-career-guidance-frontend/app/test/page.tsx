'use client';

import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { setJobRole, toggleTheme } from '@/lib/features/interviewSlice';

export default function TestPage() {
  const { jobRole } = useAppSelector((state) => state.interview);
  const dispatch = useAppDispatch();

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Test Page</h1>
      
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Redux Store Test</h2>
        <div className="mb-4">
          <label className="block mb-2">Job Role:</label>
          <input
            type="text"
            value={jobRole}
            onChange={(e) => dispatch(setJobRole(e.target.value))}
            className="w-full p-2 border rounded"
            placeholder="Enter job role"
          />
        </div>
        <p className="mt-2">Current Job Role: <span className="font-semibold">{jobRole || 'Not set'}</span></p>
      </div>

      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Theme Test</h2>
        <button
          onClick={() => dispatch(toggleTheme())}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Toggle Theme
        </button>
      </div>
    </div>
  );
}
