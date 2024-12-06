import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateQuestions(settings, excludedQuestions = []) {
  const prompt = createPrompt(settings, excludedQuestions);

  console.log('prmopt', prompt)
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a professional quiz generator. Generate questions based on the provided settings. Return only valid JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });
  console.log('response0', response);
  

  const questions = JSON.parse(response.choices[0].message.content).questions;
  return questions.map(q => ({
    id: crypto.randomUUID(),
    ...q
  }));
}

function createPrompt(settings, excludedQuestions) {
  return `
Generate ${settings.numQuestions} ${settings.difficulty} difficulty ${settings.questionType} questions in JSON format.
Questions should be ${settings.format} type.

${settings.file ? 'Base the questions on the provided content: ' + settings.file.content : ''}

Format each question as:
{
  "content": "question text",
  "type": "${settings.format}",
  "options": ["option1", "option2", "option3", "option4"],
  "correctAnswer": "correct option",
  "points": 1
}

${excludedQuestions.length > 0 ? 'Exclude these questions: ' + JSON.stringify(excludedQuestions) : ''}

Return in format:
{
  "questions": [
    // array of question objects
  ]
}
`;
}