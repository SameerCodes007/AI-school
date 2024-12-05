import { useState } from 'react';
import axios from 'axios';
import { QuizSettings, Question } from '../types/quiz';

export const useAIQuestions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestions = async (
    settings: QuizSettings,
    excludedQuestions: string[] = []
  ): Promise<Question[]> => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      if (settings.file) {
        formData.append('file', settings.file);
      }
      
      formData.append('settings', JSON.stringify({
        ...settings,
        excludedQuestions,
      }));

      const response = await axios.post('/api/generate-questions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.questions;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate questions');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    generateQuestions,
    loading,
    error,
  };
};