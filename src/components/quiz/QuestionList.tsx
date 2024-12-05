import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Question } from '../../types/quiz';
import { Trash2, Plus, Edit2, Check, X } from 'lucide-react';

interface QuestionListProps {
  questions: Question[];
  onRemove: (index: number) => void;
  onAdd: (question: Question) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onRemove,
  onAdd,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<Question | null>(null);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditedQuestion(questions[index]);
  };

  const handleSave = () => {
    if (editedQuestion && editingIndex !== null) {
      const newQuestions = [...questions];
      newQuestions[editingIndex] = editedQuestion;
      onAdd(editedQuestion);
      setEditingIndex(null);
      setEditedQuestion(null);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedQuestion(null);
  };

  if (questions.length === 0) {
    return (
      <Card className="bg-gray-50 border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-500 py-8">
          No questions yet. Click "Generate Questions" to create some!
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <Card key={question.id} className="relative">
          {editingIndex === index ? (
            <div className="space-y-4">
              <Input
                label="Question"
                value={editedQuestion?.content || ''}
                onChange={(e) =>
                  setEditedQuestion(prev =>
                    prev ? { ...prev, content: e.target.value } : null
                  )
                }
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Options
                </label>
                {editedQuestion?.options.map((option, optionIndex) => (
                  <Input
                    key={optionIndex}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...editedQuestion.options];
                      newOptions[optionIndex] = e.target.value;
                      setEditedQuestion(prev =>
                        prev ? { ...prev, options: newOptions } : null
                      );
                    }}
                  />
                ))}
              </div>
              <Input
                label="Correct Answer"
                value={editedQuestion?.correctAnswer || ''}
                onChange={(e) =>
                  setEditedQuestion(prev =>
                    prev ? { ...prev, correctAnswer: e.target.value } : null
                  )
                }
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEdit(index)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onRemove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="pr-24">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    Question {index + 1}
                  </span>
                </div>

                <p className="text-gray-900 mb-4">{question.content}</p>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Options:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {question.options.map((option, i) => (
                      <li
                        key={i}
                        className={
                          option === question.correctAnswer
                            ? 'text-[#2ECC71]'
                            : ''
                        }
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>

                {question.explanation && (
                  <div className="mt-4 text-sm text-gray-600">
                    <span className="font-medium">Explanation: </span>
                    {question.explanation}
                  </div>
                )}
              </div>
            </>
          )}
        </Card>
      ))}

      <Button
        variant="secondary"
        className="w-full flex items-center justify-center gap-2"
        onClick={() =>
          onAdd({
            id: crypto.randomUUID(),
            content: '',
            options: ['', '', '', ''],
            correctAnswer: '',
          })
        }
      >
        <Plus className="h-4 w-4" />
        Add Question Manually
      </Button>
    </div>
  );
};