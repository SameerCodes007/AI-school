export interface QuizSettings {
  title: string;
  numQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questionType: 'theory' | 'application' | 'mixed';
  format: 'multiple_choice' | 'true_false';
  timeLimit: number;
  file?: File;
}

export interface Question {
  id: string;
  content: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface Quiz {
  id: string;
  settings: QuizSettings;
  questions: Question[];
  isPublished: boolean;
  shareableUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}