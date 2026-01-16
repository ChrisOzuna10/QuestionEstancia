import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileCheck, X } from "lucide-react";
import { getSurveys, createSurvey } from "@/services/surveys.service";
import { slugify } from "@/utils/slugify";
import SurveyCard from "@/components/ui/SurveyCard";

interface Survey {
  id: number;
  title: string;
  description: string;
}

function Surveys() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Campos de formulario de encuesta
  const [nameSurvey, setNameSurvey] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchSurveys = async () => {
      setLoading(true);
      const data = await getSurveys();
      setSurveys(data);
      setLoading(false);
    };
    fetchSurveys();
  }, []);

  // ======= Funciones modales =======
  const handleOpenSurveyModal = () => {
    setIsSurveyModalOpen(true);
  };

  const handleCloseSurveyModal = () => {
    setIsSurveyModalOpen(false);
    setNameSurvey("");
    setDescription("");
  };

  // ======= Funciones de navegación =======
  const handleSurveyClick = (survey: Survey) => {
    const slug = slugify(survey.title);
    navigate(`/dashboard/surveys/${survey.id}/${slug}/questions`);
  };

  // ======= Funciones CRUD =======
  const handleCreateSurvey = async () => {
    if (!nameSurvey.trim()) {
      alert("El nombre de la encuesta es obligatorio");
      return;
    }

    try {
      setLoading(true);
      const newSurvey = {
        nameSurvey,
        description,
        createdBy: 1,
      };
      const created = await createSurvey(newSurvey);
      setSurveys((prev) => [...prev, created]);
      handleCloseSurveyModal();
    } catch (error) {
      console.error("Error al crear encuesta:", error);
      alert("Error al crear la encuesta. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Encuestas</h1>
        <button
          onClick={handleOpenSurveyModal}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          disabled={loading}
        >
          <FileCheck className="w-5 h-5" />
          Agregar Encuesta
        </button>
      </div>

      {/* Loading State */}
      {loading && surveys.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
          <p className="text-gray-600 mt-4">Cargando encuestas...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && surveys.length === 0 && (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FileCheck className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay encuestas disponibles
          </h3>
          <p className="text-gray-500 mb-6">
            Crea tu primera encuesta para comenzar
          </p>
          <button
            onClick={handleOpenSurveyModal}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            <FileCheck className="w-5 h-5" />
            Crear Encuesta
          </button>
        </div>
      )}

      {/* Listado de encuestas con flex wrap */}
      {!loading && surveys.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {surveys.map((survey, index) => (
            <SurveyCard
              key={survey.id}
              id={survey.id}
              number={index + 1}
              title={survey.title}
              description={survey.description}
              onClick={() => handleSurveyClick(survey)}
            />
          ))}
        </div>
      )}

      {/* Modal de crear encuesta */}
      {isSurveyModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative">
            <button
              onClick={handleCloseSurveyModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Nueva Encuesta</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la encuesta *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Encuesta de satisfacción"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  value={nameSurvey}
                  onChange={(e) => setNameSurvey(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  placeholder="Describe el objetivo de esta encuesta..."
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none transition-all"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleCreateSurvey}
                className="w-full bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Creando..." : "Crear Encuesta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Surveys;