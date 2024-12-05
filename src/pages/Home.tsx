import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, BookOpen, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';

const Home: React.FC = () => {
  return (
    <div className="space-y-16">
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-[#1A2B3C]">
          Transform Your Teaching with AI-Powered Quizzes
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Create engaging assessments, track student progress, and leverage AI to generate
          intelligent questions - all in one platform.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Brain className="h-12 w-12 text-[#2ECC71] mb-4" />
          <h3 className="text-xl font-semibold mb-2">AI-Powered Generation</h3>
          <p className="text-gray-600">
            Let AI help you create diverse and challenging questions while maintaining
            complete control over the final content.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <BookOpen className="h-12 w-12 text-[#2ECC71] mb-4" />
          <h3 className="text-xl font-semibold mb-2">Flexible Question Types</h3>
          <p className="text-gray-600">
            Support for multiple choice, true/false, and open-ended questions to assess
            different types of knowledge.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Users className="h-12 w-12 text-[#2ECC71] mb-4" />
          <h3 className="text-xl font-semibold mb-2">Comprehensive Analytics</h3>
          <p className="text-gray-600">
            Track student performance, identify knowledge gaps, and adjust your teaching
            strategy with detailed insights.
          </p>
        </div>
      </section>

      <section className="bg-[#1A2B3C] text-white p-12 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to revolutionize your assessments?</h2>
          <p className="text-lg mb-8">
            Join thousands of educators who are already using QuizAI to create smarter,
            more effective assessments.
          </p>
          <Link to="/register">
            <Button size="lg">Start Creating Quizzes</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;