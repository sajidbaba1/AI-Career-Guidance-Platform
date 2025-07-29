import { Button } from '@geist-ui/core';
import ResumeUpload from '../components/ResumeUpload';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          AI-Powered Career Guidance
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Get personalized career recommendations based on your skills and experience
        </p>
        <ResumeUpload />
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Upload Resume',
              description: 'Upload your resume in any format'
            },
            {
              title: 'Skills Analysis',
              description: 'Get detailed analysis of your skills'
            },
            {
              title: 'Career Matches',
              description: 'Discover ideal career paths for you'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
