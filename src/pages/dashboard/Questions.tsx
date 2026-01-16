import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Plus, Trash2, GripVertical, ArrowLeft, Edit3, X } from 'lucide-react'
import { createQuestion, updateQuestion as updateQuestionService, deleteQuestion as deleteQuestionService, getQuestionsBySurvey } from '@/services/question.service'
import { getSurveys } from '@/services/surveys.service'

type QuestionType = 'text' | 'multiple' | 'checkbox' | 'radio' | 'scale'

interface Option {
  id: string
  text: string
}

interface Question {
  id: string
  type: QuestionType
  text: string
  required: boolean
  options: Option[]
}

function Questions() {
  const { id, slug } = useParams<{ id: string; slug: string }>()
  const navigate = useNavigate()
  
  const [surveyTitle, setSurveyTitle] = useState('')
  const [surveyDescription, setSurveyDescription] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [existingQuestions, setExistingQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const questionTypes = [
    { value: 'text', label: 'Respuesta Abierta' },
    { value: 'multiple', label: 'Opción Múltiple' },
    { value: 'checkbox', label: 'Casillas de Verificación' },
    { value: 'radio', label: 'Selección Única' },
    { value: 'scale', label: 'Escala (1-5)' }
  ]

  // Función para cargar preguntas desde el backend
  const loadQuestions = async () => {
    if (!id) return
    
    try {
      const backendQuestions = await getQuestionsBySurvey(parseInt(id))
      
      if (backendQuestions.length > 0) {
        const formattedQuestions: Question[] = backendQuestions.map(q => ({
          id: q.id.toString(),
          type: q.questionType as QuestionType,
          text: q.questionText,
          required: q.isRequired,
          options: []
        }))
        setExistingQuestions(formattedQuestions)
      } else {
        setExistingQuestions([])
      }
    } catch (error) {
      console.error('Error loading questions:', error)
    }
  }

  useEffect(() => {
    const loadSurveyData = async () => {
      if (!id) return

      try {
        setLoadingQuestions(true)
        
        // Cargar información de la encuesta
        const surveys = await getSurveys()
        const currentSurvey = surveys.find(s => s.id === parseInt(id))
        
        if (currentSurvey) {
          setSurveyTitle(currentSurvey.title)
          setSurveyDescription(currentSurvey.description)
        } else {
          const titleFromSlug = slug?.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')
          setSurveyTitle(titleFromSlug || 'Nueva Encuesta')
        }

        // Cargar preguntas existentes
        await loadQuestions()
        
        // Inicializar con una pregunta vacía para agregar nuevas
        setQuestions([
          {
            id: Date.now().toString(),
            type: 'text',
            text: '',
            required: false,
            options: []
          }
        ])
      } catch (error) {
        console.error('Error loading survey data:', error)
      } finally {
        setLoadingQuestions(false)
      }
    }

    loadSurveyData()
  }, [id, slug])

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'text',
      text: '',
      required: false,
      options: []
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ))
  }

  const deleteQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id))
    }
  }

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: [...q.options, { id: Date.now().toString(), text: '' }]
        }
      }
      return q
    }))
  }

  const updateOption = (questionId: string, optionId: string, text: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options.map(opt => 
            opt.id === optionId ? { ...opt, text } : opt
          )
        }
      }
      return q
    }))
  }

  const deleteOption = (questionId: string, optionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options.filter(opt => opt.id !== optionId)
        }
      }
      return q
    }))
  }

  const needsOptions = (type: QuestionType) => {
    return ['multiple', 'checkbox', 'radio'].includes(type)
  }

  const handleSave = async () => {
    if (!surveyTitle.trim()) {
      alert('Por favor ingresa un título para la encuesta')
      return
    }

    const hasEmptyQuestions = questions.some(q => !q.text.trim())
    if (hasEmptyQuestions) {
      alert('Por favor completa todas las preguntas')
      return
    }

    if (!id) {
      alert('Error: No se encontró el ID de la encuesta')
      return
    }

    try {
      setLoading(true)
      
      for (let index = 0; index < questions.length; index++) {
        const q = questions[index]
        
        await createQuestion({
          surveyId: parseInt(id),
          questionText: q.text,
          questionType: q.type,
          isRequired: q.required,
          orderPosition: existingQuestions.length + index + 1
        })
      }

      alert('Preguntas guardadas exitosamente!')
      await loadQuestions()
      
      // Limpiar formulario
      setQuestions([
        {
          id: Date.now().toString(),
          type: 'text',
          text: '',
          required: false,
          options: []
        }
      ])
    } catch (error) {
      console.error('Error saving questions:', error)
      alert('Error al guardar las preguntas. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/dashboard/surveys')
  }

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion({ ...question })
    setIsEditModalOpen(true)
  }

  const handleUpdateQuestion = async () => {
    if (!editingQuestion || !editingQuestion.text.trim()) {
      alert('Por favor completa el texto de la pregunta')
      return
    }

    try {
      setLoading(true)
      await updateQuestionService(parseInt(editingQuestion.id), {
        questionText: editingQuestion.text,
        questionType: editingQuestion.type,
        isRequired: editingQuestion.required,
      })

      alert('Pregunta actualizada exitosamente!')
      setIsEditModalOpen(false)
      setEditingQuestion(null)
      await loadQuestions()
    } catch (error) {
      console.error('Error updating question:', error)
      alert('Error al actualizar la pregunta. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta pregunta?')) {
      return
    }

    try {
      setLoading(true)
      await deleteQuestionService(parseInt(questionId))
      alert('Pregunta eliminada exitosamente!')
      await loadQuestions()
    } catch (error) {
      console.error('Error deleting question:', error)
      alert('Error al eliminar la pregunta. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const renderQuestionPreview = (question: Question) => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder="Respuesta de texto..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            disabled
          />
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {question.options.length > 0 ? (
              question.options.map((option) => (
                <label key={option.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <input
                    type="radio"
                    name={`preview-${question.id}`}
                    className="w-4 h-4 text-black focus:ring-black"
                    disabled
                  />
                  <span className="text-gray-700">{option.text || 'Opción sin texto'}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic">No hay opciones configuradas</p>
            )}
          </div>
        )

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options.length > 0 ? (
              question.options.map((option) => (
                <label key={option.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-black focus:ring-black rounded"
                    disabled
                  />
                  <span className="text-gray-700">{option.text || 'Opción sin texto'}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic">No hay opciones configuradas</p>
            )}
          </div>
        )

      case 'multiple':
        return (
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            disabled
          >
            <option value="">Selecciona una opción...</option>
            {question.options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.text || 'Opción sin texto'}
              </option>
            ))}
          </select>
        )

      case 'scale':
        return (
          <div>
            <div className="flex items-center justify-between gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <label
                  key={value}
                  className="flex-1 flex flex-col items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`scale-preview-${question.id}`}
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
        )

      default:
        return null
    }
  }

  if (loadingQuestions) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"></div>
        <p className="text-gray-600 mt-4 ml-4">Cargando preguntas...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors"
          disabled={loading}
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex-1">
          <input
            type="text"
            value={surveyTitle}
            onChange={(e) => setSurveyTitle(e.target.value)}
            placeholder="Título de la encuesta"
            className="text-3xl font-bold text-gray-800 border-none outline-none w-full focus:ring-0 bg-transparent"
            disabled
          />
          <input
            type="text"
            value={surveyDescription}
            onChange={(e) => setSurveyDescription(e.target.value)}
            placeholder="Descripción (opcional)"
            className="text-gray-600 mt-1 border-none outline-none w-full focus:ring-0 bg-transparent"
            disabled
          />
        </div>
        <button 
          onClick={handleSave}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Preguntas'}
        </button>
      </div>

      {/* FORMULARIO PARA AGREGAR NUEVAS PREGUNTAS */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Agregar Nuevas Preguntas</h2>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start gap-4">
                <div className="pt-3 cursor-move">
                  <GripVertical className="w-5 h-5 text-gray-400" />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pregunta {index + 1}
                      </label>
                      <input
                        type="text"
                        value={question.text}
                        onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                        placeholder="Escribe tu pregunta aquí..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>

                    <div className="w-48">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo
                      </label>
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(question.id, 'type', e.target.value as QuestionType)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      >
                        {questionTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {needsOptions(question.type) && (
                    <div className="pl-4 border-l-2 border-gray-200 space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Opciones
                      </label>
                      {question.options.map((option, optIndex) => (
                        <div key={option.id} className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm w-6">{optIndex + 1}.</span>
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                            placeholder={`Opción ${optIndex + 1}`}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                          <button
                            onClick={() => deleteOption(question.id, option.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addOption(question.id)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar opción
                      </button>
                    </div>
                  )}

                  {question.type === 'scale' && (
                    <div className="pl-4 border-l-2 border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vista previa
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(num => (
                          <button
                            key={num}
                            type="button"
                            className="w-12 h-12 border-2 border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition-colors font-medium"
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`required-${question.id}`}
                      checked={question.required}
                      onChange={(e) => updateQuestion(question.id, 'required', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
                      Pregunta obligatoria
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => deleteQuestion(question.id)}
                  disabled={questions.length === 1}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addQuestion}
          className="w-full mt-4 py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Agregar pregunta
        </button>
      </div>

      {/* PREGUNTAS GUARDADAS */}
      {existingQuestions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Preguntas Guardadas</h2>
          <div className="space-y-4">
            {existingQuestions.map((question, index) => (
              <div
                key={question.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-black text-white rounded-full text-sm font-semibold">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {question.text}
                        {question.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 ml-11">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {questionTypes.find(t => t.value === question.type)?.label || question.type}
                      </span>
                      
                      {question.required && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Obligatoria
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEditQuestion(question)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar pregunta"
                      disabled={loading}
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar pregunta"
                      disabled={loading}
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
        </div>
      )}

      {/* Modal de edición */}
      {isEditModalOpen && editingQuestion && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsEditModalOpen(false)
                setEditingQuestion(null)
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Editar Pregunta</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto de la pregunta
                </label>
                <input
                  type="text"
                  value={editingQuestion.text}
                  onChange={(e) => setEditingQuestion({...editingQuestion, text: e.target.value})}
                  placeholder="Escribe tu pregunta aquí..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de pregunta
                </label>
                <select
                  value={editingQuestion.type}
                  onChange={(e) => setEditingQuestion({...editingQuestion, type: e.target.value as QuestionType})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  disabled={loading}
                >
                  {questionTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-required"
                  checked={editingQuestion.required}
                  onChange={(e) => setEditingQuestion({...editingQuestion, required: e.target.checked})}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                  disabled={loading}
                />
                <label htmlFor="edit-required" className="text-sm text-gray-700">
                  Pregunta obligatoria
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setIsEditModalOpen(false)
                    setEditingQuestion(null)
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateQuestion}
                  className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Actualizando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Questions