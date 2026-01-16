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

interface BackendQuestion {
  id: number;
  survey_id: number;
  question_text: string;
  question_type: string;
  is_required: boolean;
  order_position: number;
}

interface BackendQuestionsResponse {
  questions: BackendQuestion[];
  total: number;
}

export const getQuestionsBySurvey = async (surveyId: number): Promise<Question[]> => {
  try {
    console.log('Fetching questions for survey ID:', surveyId); 
    
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

    console.log('Response status:', response.status); 

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: BackendQuestionsResponse = await response.json();
    console.log('Questions data from backend:', data); 
    
    // Transformar los datos del backend al formato esperado
    if (data.questions && Array.isArray(data.questions)) {
      // FILTRAR por survey_id en el frontend por si el backend no lo hace
      const filteredQuestions = data.questions.filter((q: BackendQuestion) => q.survey_id === surveyId);
      
      console.log('Filtered questions for survey', surveyId, ':', filteredQuestions);
      
      return filteredQuestions.map((q: BackendQuestion) => ({
        id: q.id,
        surveyId: q.survey_id,
        questionText: q.question_text,
        questionType: q.question_type,
        isRequired: q.is_required,
        orderPosition: q.order_position
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};

export const createQuestion = async (question: CreateQuestionDto): Promise<Question> => {
  try {
    // Transformar de camelCase a snake_case para el backend
    const backendPayload = {
      survey_id: question.surveyId,
      question_text: question.questionText,
      question_type: question.questionType,
      is_required: question.isRequired,
      order_position: question.orderPosition
    };

    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.questions}`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendPayload),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: BackendQuestion = await response.json();
    console.log('Created question:', data);
    
    // Transformar la respuesta del backend
    return {
      id: data.id,
      surveyId: data.survey_id,
      questionText: data.question_text,
      questionType: data.question_type,
      isRequired: data.is_required,
      orderPosition: data.order_position
    };
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
};

export const updateQuestion = async (
  questionId: number,
  updates: Partial<CreateQuestionDto>
): Promise<Question> => {
  try {
    // Transformar de camelCase a snake_case para el backend
    const backendPayload: any = {};
    if (updates.surveyId !== undefined) backendPayload.survey_id = updates.surveyId;
    if (updates.questionText !== undefined) backendPayload.question_text = updates.questionText;
    if (updates.questionType !== undefined) backendPayload.question_type = updates.questionType;
    if (updates.isRequired !== undefined) backendPayload.is_required = updates.isRequired;
    if (updates.orderPosition !== undefined) backendPayload.order_position = updates.orderPosition;

    const response = await fetch(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoints.questions}/${questionId}`,
      {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendPayload),
      }
    );

    console.log('Update response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: BackendQuestion = await response.json();
    console.log('Updated question:', data);
    
    // Transformar la respuesta del backend
    return {
      id: data.id,
      surveyId: data.survey_id,
      questionText: data.question_text,
      questionType: data.question_type,
      isRequired: data.is_required,
      orderPosition: data.order_position
    };
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
};

export const deleteQuestion = async (questionId: number): Promise<void> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoints.questions}/${questionId}`,
      {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
        },
      }
    );

    console.log('Delete response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    console.log('Question deleted successfully');
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
};