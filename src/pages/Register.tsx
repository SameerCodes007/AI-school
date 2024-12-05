import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'teacher' | 'student'>('student');
  const { register, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(email, password, role);
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Join QuizAI today</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              I am a...
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="student"
                  checked={role === 'student'}
                  onChange={(e) => setRole(e.target.value as 'student')}
                  className="mr-2"
                />
                Student
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="teacher"
                  checked={role === 'teacher'}
                  onChange={(e) => setRole(e.target.value as 'teacher')}
                  className="mr-2"
                />
                Teacher
              </label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-[#2ECC71] hover:underline">
            Sign in here
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;