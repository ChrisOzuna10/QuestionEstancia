import { useState } from "react";
import { createQuestion } from "@/services/question.service";
import { X } from "lucide-react";

interface QuestionModalProps {
  surveyId: number;
  onClose: () => void;
  onCreated: () => void;
}

export default function QuestionModal({ surveyId, onClose, onCreated }: QuestionModalProps) {
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("text");
  const [isRequired, setIsRequired] = useState(false);
  const [orderPosition, setOrderPosition] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!questionText.trim()) {
      alert("El texto de la pregunta es obligatorio");
      return;
    }

    try {
      setLoading(true);
      await createQuestion({
        surveyId,
        questionText,
        questionType,
        isRequired,
        orderPosition,
      });
      onCreated();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error al crear la pregunta. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20">
      {/* Modal */}
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          disabled={loading}
        >
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4">Nueva Pregunta</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Texto de la pregunta *
          </label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Ej: ¿Cómo calificarías nuestro servicio?"
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de pregunta
          </label>
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={loading}
          >
            <option value="text">Texto</option>
            <option value="multiple">Multiple Choice</option>
            <option value="checkbox">Checkbox</option>
            <option value="radio">Radio</option>
            <option value="scale">Escala</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="mr-2 w-4 h-4"
              disabled={loading}
            />
            Pregunta obligatoria
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Posición (orden)
          </label>
          <input
            type="number"
            min={1}
            value={orderPosition}
            onChange={(e) => setOrderPosition(Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={loading}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}