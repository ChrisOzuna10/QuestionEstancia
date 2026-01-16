import { API_CONFIG } from "@/utils/config";

// Interfaz para las encuestas (Survey)
export interface Survey {
  id: number;
  nameSurvey: string;
  description: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// Respuesta del backend para surveys (snake_case)
interface SurveyResponseBackend {
  id: number;
  name_survey: string;
  description: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

interface GetSurveysResponse {
  surveys: SurveyResponseBackend[];
  total?: number;
}

// Interfaz para las respuestas (Answer)
export interface Answer {
  id: number;
  surveyId: number;
  userId: number;
  createdAt: string;
  // Agrega más campos según la estructura real de tu respuesta
}

// Respuesta del backend para answers (snake_case)
interface AnswerResponseBackend {
  id: number;
  survey_id: number;
  user_id: number;
  created_at: string;
  // Agrega más campos según la estructura real
}

interface GetAnswersResponse {
  answers: AnswerResponseBackend[];
  total: number;
}

// Interfaz para los archivos (File)
export interface FileData {
  id: number;
  fileName: string;
  fileUrl: string;
  uploadedBy: number;
  uploadedAt: string;
  // Agrega más campos según la estructura real de tu archivo
}

// Respuesta del backend para files (snake_case)
interface FileResponseBackend {
  id: number;
  file_name: string;
  file_url: string;
  uploaded_by: number;
  uploaded_at: string;
  // Agrega más campos según la estructura real
}

interface GetFilesResponse {
  files: FileResponseBackend[];
  total: number;
}

// Transformar survey del backend al frontend
const transformSurvey = (surveyResponse: SurveyResponseBackend): Survey => {
  return {
    id: surveyResponse.id,
    nameSurvey: surveyResponse.name_survey,
    description: surveyResponse.description,
    createdBy: surveyResponse.created_by,
    createdAt: surveyResponse.created_at,
    updatedAt: surveyResponse.updated_at,
    isActive: surveyResponse.is_active,
  };
};

// Transformar answer del backend al frontend
const transformAnswer = (answerResponse: AnswerResponseBackend): Answer => {
  return {
    id: answerResponse.id,
    surveyId: answerResponse.survey_id,
    userId: answerResponse.user_id,
    createdAt: answerResponse.created_at,
  };
};

// Transformar file del backend al frontend
const transformFile = (fileResponse: FileResponseBackend): FileData => {
  return {
    id: fileResponse.id,
    fileName: fileResponse.file_name,
    fileUrl: fileResponse.file_url,
    uploadedBy: fileResponse.uploaded_by,
    uploadedAt: fileResponse.uploaded_at,
  };
};

// Obtener todas las encuestas
export const getAllSurveys = async (): Promise<Survey[]> => {
  try {
    const url = `${API_CONFIG.baseURL}/surveys`;
    console.log('Fetching surveys from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: GetSurveysResponse = await response.json();
    console.log('Surveys data from backend:', data);
    
    const transformedData = data.surveys.map(transformSurvey);
    console.log('Transformed surveys:', transformedData);
    
    return transformedData;
  } catch (error) {
    console.error("Error fetching surveys:", error);
    throw error;
  }
};

// Obtener todas las respuestas
export const getAllAnswers = async (): Promise<{ answers: Answer[]; total: number }> => {
  try {
    const url = `${API_CONFIG.baseURL}/answers`;
    console.log('Fetching answers from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: GetAnswersResponse = await response.json();
    console.log('Answers data from backend:', data);
    
    const transformedAnswers = data.answers.map(transformAnswer);
    console.log('Transformed answers:', transformedAnswers);
    
    return {
      answers: transformedAnswers,
      total: data.total,
    };
  } catch (error) {
    console.error("Error fetching answers:", error);
    throw error;
  }
};

// Obtener todos los archivos
export const getAllFiles = async (): Promise<{ files: FileData[]; total: number }> => {
  try {
    const url = `${API_CONFIG.baseURL}/files`;
    console.log('Fetching files from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: GetFilesResponse = await response.json();
    console.log('Files data from backend:', data);
    
    const transformedFiles = data.files.map(transformFile);
    console.log('Transformed files:', transformedFiles);
    
    return {
      files: transformedFiles,
      total: data.total,
    };
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
};