export interface User {
  id: string;
  email: string;
  role: 'teacher' | 'student';
}

export interface Question {
  id: string;
  content: string;
  type: 'multiple_choice' | 'true_false' | 'open_ended';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  questions: Question[];
  timeLimit?: number;
  isPublished: boolean;
}