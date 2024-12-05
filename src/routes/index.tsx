import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Lazy load pages
const Home = React.lazy(() => import('../pages/Home'));
const Login = React.lazy(() => import('../pages/Login'));
const Register = React.lazy(() => import('../pages/Register'));
const CreateQuiz = React.lazy(() => import('../pages/CreateQuiz'));

export const AppRoutes: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <Register />}
        />
        <Route
          path="/create-quiz"
          element={
            user?.role === 'teacher' ? (
              <CreateQuiz />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
      </Routes>
    </React.Suspense>
  );
};