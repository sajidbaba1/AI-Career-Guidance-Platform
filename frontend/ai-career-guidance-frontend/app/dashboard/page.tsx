'use client';

import { Card, Text, Spacer } from '@geist-ui/core';
import CareerRecommendations from '../../components/CareerRecommendations';

export default function Dashboard() {
  // Placeholder data - will be replaced with real API calls
  const skills = ['Java', 'Spring Boot', 'React', 'Next.js'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Career Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Your Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Career Recommendations</h2>
          <CareerRecommendations />
        </Card>
      </div>

      <Spacer h={2} />
      
      <Card>
        <h2 className="text-xl font-semibold mb-4">Suggested Learning Path</h2>
        <p className="text-gray-600">
          Based on your skills, we recommend focusing on advanced React patterns and
          microservices architecture to progress towards Senior Full Stack roles.
        </p>
      </Card>
    </div>
  );
}
