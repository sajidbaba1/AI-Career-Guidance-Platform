'use client';

import { Card, Text, Spacer, Button } from '@geist-ui/core';
import { useState, useEffect } from 'react';

type Recommendation = {
  title: string;
  matchScore: number;
  description: string;
  skills: string[];
};

export default function CareerRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - will be replaced with API call
    setTimeout(() => {
      setRecommendations([
        {
          title: 'Full Stack Developer',
          matchScore: 92,
          description: 'Build complete web applications with both frontend and backend skills',
          skills: ['React', 'Node.js', 'Database']
        },
        {
          title: 'Backend Engineer',
          matchScore: 85,
          description: 'Focus on server-side logic and database management',
          skills: ['Java', 'Spring Boot', 'SQL']
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <Text>Loading recommendations...</Text>;
  }

  return (
    <div className="space-y-4">
      <Text h3>Your Career Matches</Text>
      
      {recommendations.map((job, index) => (
        <Card key={index} hoverable>
          <div className="flex justify-between items-start">
            <div>
              <Text h4>{job.title}</Text>
              <Text small>{job.description}</Text>
              <Spacer h={0.5} />
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
              {job.matchScore}% match
            </div>
          </div>
          <Card.Footer>
            <Button auto scale={0.75}>View Details</Button>
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
}
