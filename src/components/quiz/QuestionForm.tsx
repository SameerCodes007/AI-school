import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Question } from '../../types';
import { Plus, Wand2 } from 'lucide-react';

interface QuestionFormProps {
  onAdd: (question: Question) => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ onAdd }) => {
  const [content, setContent] = useState('');
  const [type, setType] = useState<Question['type']>('multiple_choice');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [points, setPoints] = useState(1);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const question: Question = {
      id: crypto.randomUUID(),
      content,
      type,
      options: type === 'multiple_choice' ? options : undefined,
      correctAnswer: type === 'multiple_choice' ? [correctAnswer] : correctAnswer,
      points,
    };
    onAdd(question);
    
    // Reset form
    setContent('');
    setType('multiple_choice');
    setOptions(['', '']);
    setCorrectAnswer('');
    setPoints(1);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#1A2B3C]">Add Question</h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
          >
            <Wand2 className="h-4 w-4" />
            Generate with AI
          </Button>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Question Text
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent outline-none border-gray-300"
            rows={2}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Question Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Question['type'])}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent outline-none border-gray-300"
            >
              <option value="multiple_choice">Multiple Choice</option>
              <option value="true_false">True/False</option>
              <option value="open_ended">Open Ended</option>
            </select>
          </div>

          <Input
            label="Points"
            type="number"
            min={1}
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            required
          />
        </div>

        {type === 'multiple_choice' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Options
            </label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  label={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddOption}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Option
            </Button>
          </div>
        )}

        {type === 'multiple_choice' && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Correct Answer
            </label>
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent outline-none border-gray-300"
              required
            >
              <option value="">Select correct answer</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {type === 'true_false' && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Correct Answer
            </label>
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent outline-none border-gray-300"
              required
            >
              <option value="">Select correct answer</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        )}

        {type === 'open_ended' && (
          <Input
            label="Correct Answer"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            required
          />
        )}

        <div className="flex justify-end">
          <Button type="submit">Add Question</Button>
        </div>
      </form>
    </Card>
  );
};