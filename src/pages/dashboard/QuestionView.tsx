import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FileCheck, Plus, Trash2, Edit } from "lucide-react";

interface QuestionOption {
  option_id: number;
  question_id: number;
  option_text: string;
  order_position: number;
}

interface Question {
  id: number;
  survey_id: number;
  question_text: string;
  question_type: 'text' | 'multiple' | 'checkbox' | 'radio' | 'scale';
  is_required: boolean;
  order_position: number;
  created_at: string;
  options?: QuestionOption[];
}

interface QuestionsResponse {
  questions: Question[];
  total: number;
}

const QuestionView = () => {
  const { surveyId } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const mockData: QuestionsResponse = {
          questions: [
            {
              id: 1,
              survey_id: 5,
              question_text: "¿Cuál es tu nombre completo?",
              question_type: "text",
              is_required: true,
              order_position: 1,
              created_at: "2026-01-14T08:16:58.199136"
            },
            {
              id: 2,
              survey_id: 5,
              question_text: "¿Cuál es tu género?",
              question_type: "radio",
              is_required: true,
              order_position: 2,
              created_at: "2026-01-14T08:44:29.657551",
              options: [
                { option_id: 1, question_id: 2, option_text: "Masculino", order_position: 1 },
                { option_id: 2, question_id: 2, option_text: "Femenino", order_position: 2 },
                { option_id: 3, question_id: 2, option_text: "Otro", order_position: 3 }
              ]
            },
            {
              id: 3,
              survey_id: 5,
              question_text: "¿Qué lenguajes de programación conoces?",
              question_type: "checkbox",
              is_required: false,
              order_position: 3,
              created_at: "2026-01-14T09:00:00.000000",
              options: [
                { option_id: 4, question_id: 3, option_text: "JavaScript", order_position: 1 },
                { option_id: 5, question_id: 3, option_text: "Python", order_position: 2 },
                { option_id: 6, question_id: 3, option_text: "Java", order_position: 3 },
                { option_id: 7, question_id: 3, option_text: "C#", order_position: 4 }
              ]
            },
            {
              id: 4,
              survey_id: 5,
              question_text: "Selecciona tu país de origen",
              question_type: "multiple",
              is_required: true,
              order_position: 4,
              created_at: "2026-01-14T09:15:00.000000",
              options: [
                { option_id: 8, question_id: 4, option_text: "México", order_position: 1 },
                { option_id: 9, question_id: 4, option_text: "España", order_position: 2 },
                { option_id: 10, question_id: 4, option_text: "Argentina", order_position: 3 },
                { option_id: 11, question_id: 4, option_text: "Colombia", order_position: 4 }
              ]
            },
            {
              id: 5,
              survey_id: 5,
              question_text: "¿Qué tan satisfecho estás con nuestro servicio?",
              question_type: "scale",
              is_required: true,
              order_position: 5,
              created_at: "2026-01-14T09:30:00.000000"
            }
          ],
          total: 5
        };
        setQuestions(mockData.questions);
      } catch (error) {
        console.error("Error al cargar preguntas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [surveyId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getQuestionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      text: "Texto libre",
      multiple: "Selección múltiple (dropdown)",
      checkbox: "Casillas de verificación",
      radio: "Opción única",
      scale: "Escala de calificación"
    };
    return types[type] || type;
  };

  const renderQuestionPreview = (question: Question) => {
    switch (question.question_type) {
      case 'text':
        return (
          <div className="mt-3">
            <input
              type="text"
              placeholder="Respuesta de texto..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              disabled
            />
          </div>
        );

      case 'radio':
        return (
          <div className="mt-3 space-y-2">
            {question.options?.map((option) => (
              <label key={option.option_id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  className="w-4 h-4 text-black focus:ring-black"
                  disabled
                />
                <span className="text-gray-700">{option.option_text}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="mt-3 space-y-2">
            {question.options?.map((option) => (
              <label key={option.option_id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-black focus:ring-black rounded"
                  disabled
                />
                <span className="text-gray-700">{option.option_text}</span>
              </label>
            ))}
          </div>
        );

      case 'multiple':
        return (
          <div className="mt-3">
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              disabled
            >
              <option value="">Selecciona una opción...</option>
              {question.options?.map((option) => (
                <option key={option.option_id} value={option.option_id}>
                  {option.option_text}
                </option>
              ))}
            </select>
          </div>
        );

      case 'scale':
        return (
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <label
                  key={value}
                  className="flex-1 flex flex-col items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`scale-${question.id}`}
                    value={value}
                    className="w-5 h-5 text-black focus:ring-black"
                    disabled
                  />
                  <span className="text-sm font-medium text-gray-700">{value}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Muy insatisfecho</span>
              <span>Muy satisfecho</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>        
      {loading && (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
          <p className="text-gray-600 mt-4">Cargando preguntas...</p>
        </div>
      )}

      {!loading && questions.length === 0 && (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FileCheck className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay preguntas disponibles
          </h3>
          <p className="text-gray-500 mb-6">
            Agrega tu primera pregunta a esta encuesta
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
            <Plus className="w-5 h-5" />
            Crear Pregunta
          </button>
        </div>
      )}

      {/* Lista de preguntas */}
      {!loading && questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-black text-white rounded-full text-sm font-semibold">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {question.question_text}
                      {question.is_required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 ml-11">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getQuestionTypeLabel(question.question_type)}
                    </span>
                    
                    {question.is_required && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Obligatoria
                      </span>
                    )}
                    
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      Posición: {question.order_position}
                    </span>
                    
                    <span className="text-xs text-gray-500">
                      {formatDate(question.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar pregunta"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar pregunta"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="ml-11 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                {renderQuestionPreview(question)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionView;