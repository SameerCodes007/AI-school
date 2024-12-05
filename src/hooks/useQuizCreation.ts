import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Question } from '../types';

interface CreateQuizData {
  title: string;
  description: string;
  timeLimit?: number;
  questions: Question[];
}

export const useQuizCreation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  const createQuiz = async (data: CreateQuizData) => {
    if (!user) {
      setError('You must be logged in to create a quiz');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Insert quiz
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .insert({
          title: data.title,
          description: data.description,
          time_limit: data.timeLimit,
          created_by: user.id,
        })
        .select()
        .single();

      if (quizError) throw quizError;

      // Insert questions
      const questionsData = data.questions.map((q) => ({
        quiz_id: quiz.id,
        content: q.content,
        type: q.type,
        options: q.type === 'multiple_choice' ? q.options : null,
        correct_answer: Array.isArray(q.correctAnswer)
          ? q.correctAnswer[0]
          : q.correctAnswer,
        points: q.points,
      }));

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsData);

      if (questionsError) throw questionsError;

      // Redirect to dashboard or quiz view
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return {
    createQuiz,
    loading,
    error,
  };
};