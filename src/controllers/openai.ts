import { Request, Response } from 'express';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

interface GenerateQuestionsRequest {
  topic: string;
  count: number;
}

export const generateMusicTheoryQuestions = async (
  req: Request<{}, {}, GenerateQuestionsRequest>,
  res: Response
): Promise<void> => {
  const { topic, count } = req.body;

  if (!topic || !count || count < 1 || count > 10) {
    res.status(400).json({ 
      message: 'Invalid input. Topic is required and count must be between 1 and 10.' 
    });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({ 
      message: 'OpenAI API key not configured' 
    });
    return;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a music theory expert. Generate ${count} multiple choice questions about ${topic} in Portuguese.
          Each question should:
          - Be clear and concise
          - Have 4 options (A, B, C, D)
          - Have one correct answer
          - Focus specifically on ${topic}
          - Be appropriate for beginners
          - Be text-based only (no references to images, diagrams, or visual elements)
          - Use descriptive language instead of visual references
          - For topics that typically use visual elements (like clefs, notes on staff, etc.), use descriptive questions instead
          
          Examples of good questions:
          - "Qual é a função da clave de sol na pauta musical?"
          - "Em qual linha da pauta musical a clave de sol indica a posição da nota sol?"
          - "Qual é a nota que fica na primeira linha da pauta quando usamos a clave de fá?"
          
          Examples of questions to avoid:
          - "Qual clave é esta?" (requires image)
          - "Identifique a nota na partitura" (requires image)
          - "Qual é o símbolo mostrado?" (requires image)
          
          Format the response as a JSON object with a 'questions' array containing objects with:
          - 'question': string
          - 'options': array of 4 strings
          - 'correctIndex': number (0-3)`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const parsedContent = JSON.parse(content);
    if (!parsedContent.questions || !Array.isArray(parsedContent.questions)) {
      throw new Error('Invalid response format from OpenAI');
    }

    res.json({
      message: 'Questions generated successfully',
      questions: parsedContent.questions
    });
  } catch (error) {
    console.error('Error generating questions:', error);

    const fallbackQuestions: Question[] = [
      {
        question: "1. Quais são as sete notas musicais naturais usadas na música ocidental?",
        options: ["A) Lá, Si, Dó, Ré, Mi, Fá, Fá#", "B) Dó, Ré, Mi, Fá, Sol, Lá, Si", "C) Sol, Lá, Si, Dó, Ré, Mi, Fá#", "D) Dó, Ré, Mi, Fá, Sol, Lá, Dó"],
        correctIndex: 1,
      },
      {
        question: "2. Qual é a função da clave de sol na pauta musical?",
        options: ["A) Indicar o ritmo da música", "B) Mostrar onde ficam os silêncios", "C) Determinar que as notas serão lidas na região aguda", "D) Marcar o final da música"],
        correctIndex: 2,
      },
      {
        question: "3. O que é uma escala musical?",
        options: ["A) Um conjunto de acordes tocados aleatoriamente", "B) Um tipo de instrumento de percussão", "C) Um padrão rítmico usado em compassos compostos", "D) Uma sequência organizada de notas em ordem de altura"],
        correctIndex: 3,
      },
      {
        question: "4. Quais notas formam o acorde de Dó maior (tríade)?",
        options: ["A) Dó, Fá, Lá", "B) Dó, Ré, Mi", "C) Dó, Mi, Sol", "D) Dó, Sol, Si"],
        correctIndex: 2,
      }
    ];

    res.json({
      message: 'Using fallback questions due to API error',
      questions: fallbackQuestions.slice(0, count)
    });
  }
}; 
