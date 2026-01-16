import { API_CONFIG } from "@/utils/config";

interface Question {
  id: number;
  surveyId: number;
  questionText: string;
  questionType: string;
  isRequired: boolean;
  orderPosition: number;
}

interface CreateQuestionDto {
  surveyId: number;
  questionText: string;
  questionType: string;
  isRequired: boolean;
  orderPosition: number;
}

// Obtener todas las preguntas de una encuesta
export const getQuestionsBySurvey = async (surveyId: number): Promise<Question[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoints.questions}?survey_id=${surveyId}`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};

// Crear una nueva pregunta
export const createQuestion = async (question: CreateQuestionDto): Promise<Question> => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.questions}`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(question),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Created question:', data);
    return data;
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
};