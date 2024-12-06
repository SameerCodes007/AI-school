import axios from 'axios';
import { QuizSettings, Question } from '../types/quiz';

const API_URL = 'http://localhost:5000/api';

export async function generateQuestions(
  settings: QuizSettings,
  excludedQuestions: string[] = []
): Promise<Question[]> {
  const response = await axios.post(`${API_URL}/generate-questions`, {
    settings,
    excludedQuestions,
  });
  return response.data.questions;
}

export async function publishQuiz(data: {
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number;
  createdBy: string;
}) {
  const response = await axios.post(`${API_URL}/quizzes`, data);
  return response.data;
}