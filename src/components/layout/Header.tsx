import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';

export const Header: React.FC = () => {
  const { user, signOut } = useAuthStore();

  return (
    <header className="bg-[#1A2B3C] text-white py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-[#2ECC71]" />
          <span className="text-xl font-bold">QuizAI</span>
        </Link>

        <nav className="flex items-center space-x-6">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-[#2ECC71] transition-colors">
                Dashboard
              </Link>
              {user.role === 'teacher' && (
                <Link to="/create-quiz" className="hover:text-[#2ECC71] transition-colors">
                  Create Quiz
                </Link>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={signOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};