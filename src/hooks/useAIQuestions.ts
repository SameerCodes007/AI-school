import { useState } from 'react';
import { QuizSettings, Question } from '../types/quiz';
import { generateQuestions } from '../services/api';

export const useAIQuestions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAIQuestions = async (
    settings: QuizSettings,
    excludedQuestions: string[] = []
  ): Promise<Question[]> => {
    try {
      setLoading(true);
      setError(null);

      const questions = await generateQuestions(settings, excludedQuestions);
      return questions;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate questions');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    generateQuestions: generateAIQuestions,
    loading,
    error,
  };
};