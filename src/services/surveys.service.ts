import { API_CONFIG } from "@/utils/config";

interface Survey {
  id: number;
  title: string;
  description: string;
}

// Respuesta del GET (snake_case)
interface SurveyResponseGet {
  id: number;
  name_survey: string;
  description: string;
  created_by: number;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

// Respuesta del POST (camelCase)
interface SurveyResponsePost {
  surveyId: number;
  nameSurvey: string;
  description: string;
  createdBy: number;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

interface GetSurveysResponse {
  surveys: SurveyResponseGet[];
  total: number;
}

interface CreateSurveyResponse {
  message: string;
  survey: SurveyResponsePost;
}

interface CreateSurveyDto {
  nameSurvey: string;
  description: string;
  createdBy: number;
}

// Transformar respuesta GET (snake_case)
const transformSurveyGet = (surveyResponse: SurveyResponseGet): Survey => {
  return {
    id: surveyResponse.id,
    title: surveyResponse.name_survey,
    description: surveyResponse.description,
  };
};

// Transformar respuesta POST (camelCase)
const transformSurveyPost = (surveyResponse: SurveyResponsePost): Survey => {
  return {
    id: surveyResponse.surveyId,
    title: surveyResponse.nameSurvey,
    description: surveyResponse.description,
  };
};

// Obtener todas las encuestas
export const getSurveys = async (): Promise<Survey[]> => {
  try {
    const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.surveys}`;
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
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: GetSurveysResponse = await response.json();
    console.log('Surveys data from backend:', data);
    
    // Transformar los datos del backend al formato del frontend
    const transformedData = Array.isArray(data.surveys) 
      ? data.surveys.map(transformSurveyGet) 
      : [];
    console.log('Transformed surveys:', transformedData);
    
    return transformedData;
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return [];
  }
};

// Crear una nueva encuesta
export const createSurvey = async (survey: CreateSurveyDto): Promise<Survey> => {
  try {
    const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.surveys}`;
    console.log('Creating survey at:', url);
    console.log('Survey data:', survey);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(survey),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: CreateSurveyResponse = await response.json();
    console.log('Created survey from backend:', data);
    
    // Transformar la respuesta al formato del frontend
    const transformedData = transformSurveyPost(data.survey);
    console.log('Transformed created survey:', transformedData);
    
    return transformedData;
  } catch (error) {
    console.error("Error creating survey:", error);
    throw error;
  }
};