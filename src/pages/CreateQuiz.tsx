import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { QuestionList } from '../components/quiz/QuestionList';
import { useAIQuestions } from '../hooks/useAIQuestions';
import { QuizSettings, Question } from '../types/quiz';
import { AlertCircle, Upload, Loader2 } from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const CreateQuiz: React.FC = () => {
  const [settings, setSettings] = useState<QuizSettings>({
    title: '',
    numQuestions: 5,
    difficulty: 'medium',
    questionType: 'mixed',
    format: 'multiple_choice',
    timeLimit: 30,
  });

  const [fileContent, setFileContent] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [excludedQuestions, setExcludedQuestions] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const { generateQuestions, loading, error } = useAIQuestions();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFileError('File size too large. Please use a file smaller than 10MB.');
        return;
      }

      setFileError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileContent(content);
        setSettings(prev => ({ 
          ...prev, 
          file: { 
            name: file.name,
            content 
          }
        }));
      };
      reader.onerror = () => {
        setFileError('Error reading file. Please try again.');
      };
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  const handleGenerateQuestions = async () => {
    try {
      const settingsWithContent = {
        ...settings,
        file: settings.file ? {
          name: settings.file.name,
          content: fileContent
        } : undefined
      };
      const newQuestions = await generateQuestions(settingsWithContent, excludedQuestions);
      setQuestions([...questions, ...newQuestions]);
    } catch (err) {
      // Error handling is managed by the useAIQuestions hook
    }
  };

  const handleRemoveQuestion = (index: number) => {
    const removedQuestion = questions[index];
    setExcludedQuestions([...excludedQuestions, removedQuestion.content]);
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleAddQuestion = (question: Question) => {
    setQuestions([...questions, question]);
  };

  const handlePublish = async () => {
    // TODO: Implement publishing logic
    setIsPublished(true);
  };

  if (isPublished) {
    return (
      <Card className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Quiz Published Successfully!</h2>
        <p className="text-gray-600 mb-4">Share this URL with your students:</p>
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <code className="text-[#1A2B3C]">
            https://quizai.app/quiz/{/* TODO: Add quiz ID */}
          </code>
        </div>
        <Button onClick={() => window.location.href = '/dashboard'}>
          Return to Dashboard
        </Button>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-[#1A2B3C]">Create New Quiz</h1>

      {(error || fileError) && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error || fileError}</span>
        </div>
      )}

      <Card>
        <div className="space-y-6">
          <Input
            label="Quiz Title"
            value={settings.title}
            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
            required
          />

          <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-[#2ECC71] bg-green-50' : 'border-gray-300 hover:border-[#2ECC71]'
          }`}>
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            {settings.file ? (
              <p className="text-gray-600">Selected file: {settings.file.name}</p>
            ) : (
              <p className="text-gray-600">
                Drag & drop a file here, or click to select
                <br />
                <span className="text-sm">(PDF, DOC, DOCX, TXT)</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Number of Questions"
              value={settings.numQuestions}
              onChange={(e) => setSettings({ ...settings, numQuestions: Number(e.target.value) })}
              min={1}
              required
            />

            <Select
              label="Time Limit (minutes)"
              value={settings.timeLimit}
              onChange={(e) => setSettings({ ...settings, timeLimit: Number(e.target.value) })}
              options={[
                { value: 15, label: '15 minutes' },
                { value: 30, label: '30 minutes' },
                { value: 45, label: '45 minutes' },
                { value: 60, label: '1 hour' },
                { value: 90, label: '1.5 hours' },
                { value: 120, label: '2 hours' },
              ]}
            />

            <Select
              label="Difficulty Level"
              value={settings.difficulty}
              onChange={(e) => setSettings({ ...settings, difficulty: e.target.value as QuizSettings['difficulty'] })}
              options={[
                { value: 'easy', label: 'Easy' },
                { value: 'medium', label: 'Medium' },
                { value: 'hard', label: 'Hard' },
              ]}
            />

            <Select
              label="Question Type"
              value={settings.questionType}
              onChange={(e) => setSettings({ ...settings, questionType: e.target.value as QuizSettings['questionType'] })}
              options={[
                { value: 'theory', label: 'Theory Based' },
                { value: 'application', label: 'Application Based' },
                { value: 'mixed', label: 'Mixed' },
              ]}
            />

            <Select
              label="Question Format"
              value={settings.format}
              onChange={(e) => setSettings({ ...settings, format: e.target.value as QuizSettings['format'] })}
              options={[
                { value: 'multiple_choice', label: 'Multiple Choice' },
                { value: 'true_false', label: 'True/False' },
              ]}
            />
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#1A2B3C]">Questions</h2>
          <Button
            onClick={handleGenerateQuestions}
            disabled={loading || !settings.title}
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Generate Questions'
            )}
          </Button>
        </div>

        <QuestionList
          questions={questions}
          onRemove={handleRemoveQuestion}
          onAdd={handleAddQuestion}
        />

        {questions.length > 0 && (
          <div className="flex justify-end gap-4">
            <Button
              variant="secondary"
              onClick={handleGenerateQuestions}
              disabled={loading}
            >
              Generate More Questions
            </Button>
            <Button
              onClick={handlePublish}
              disabled={loading || questions.length === 0}
            >
              Publish Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateQuiz;