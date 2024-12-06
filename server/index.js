import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateQuestions } from './services/openai.js';
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Configure CORS and increase payload limit
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Generate questions endpoint
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { settings, excludedQuestions = [] } = req.body;
    
    // Validate file content size
    if (settings.file?.content) {
      const contentSize = Buffer.byteLength(settings.file.content, 'utf8');
      if (contentSize > 10 * 1024 * 1024) { // 10MB limit
        return res.status(413).json({
          error: 'File content too large. Please use a file smaller than 10MB.'
        });
      }
    }

    const questions = await generateQuestions(settings, excludedQuestions);
    res.json({ questions });
  } catch (error) {
    console.error('Error generating questions:', error);
    const statusCode = error.type === 'payload_too_large' ? 413 : 500;
    res.status(statusCode).json({ 
      error: error.type === 'payload_too_large' 
        ? 'File size too large. Please use a smaller file.'
        : 'Failed to generate questions' 
    });
  }
});

// Publish quiz endpoint
app.post('/api/quizzes', async (req, res) => {
  try {
    const { title, description, questions, timeLimit, createdBy } = req.body;
    const uniqueId = nanoid(10);

    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        id: uniqueId,
        title,
        description,
        created_by: createdBy,
        time_limit: timeLimit,
        is_published: true,
      })
      .select()
      .single();

    if (quizError) throw quizError;

    const questionsData = questions.map(q => ({
      quiz_id: quiz.id,
      content: q.content,
      type: q.type,
      options: q.options,
      correct_answer: q.correctAnswer,
      points: q.points || 1,
    }));

    const { error: questionsError } = await supabase
      .from('questions')
      .insert(questionsData);

    if (questionsError) throw questionsError;

    res.json({
      quizId: quiz.id,
      shareableUrl: `/quiz/${quiz.id}`,
    });
  } catch (error) {
    console.error('Error publishing quiz:', error);
    res.status(500).json({ error: 'Failed to publish quiz' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});