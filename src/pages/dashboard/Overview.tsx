import { FileSpreadsheet, TrendingUp, Users, BarChart3, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getAllSurveys, getAllAnswers, getAllFiles, type Survey } from '@/services/overview.service'

function Overview() {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [totalAnswers, setTotalAnswers] = useState(0)
  const [totalFiles, setTotalFiles] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [surveysData, answersData, filesData] = await Promise.all([
          getAllSurveys(),
          getAllAnswers(),
          getAllFiles()
        ])
        
        setSurveys(surveysData)
        setTotalAnswers(answersData.total)
        setTotalFiles(filesData.total)
      } catch (err) {
        console.error('Error fetching overview data:', err)
        setError('Error al cargar los datos')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calcular estadísticas
  const totalSurveys = surveys.length
  const activeSurveys = surveys.filter(s => s.isActive).length
  
  // Obtener las 4 encuestas más recientes
  const recentSurveys = [...surveys]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  // Función para formatear fecha relativa
  const getRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Hoy'
    if (diffDays === 1) return 'Ayer'
    if (diffDays < 7) return `Hace ${diffDays} días`
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  const stats = [
    {
      title: "Total Encuestas",
      value: totalSurveys.toString(),
      icon: BarChart3,
      change: activeSurveys > 0 ? `${activeSurveys} activas` : "Sin cambios",
      changeType: activeSurveys > 0 ? "positive" : "neutral",
      color: "blue"
    },
    {
      title: "Respuestas",
      value: totalAnswers.toString(),
      icon: Users,
      change: totalAnswers > 0 ? `${Math.round(totalAnswers / Math.max(totalSurveys, 1))} promedio` : "+0%",
      changeType: totalAnswers > 0 ? "positive" : "neutral",
      color: "green"
    },
    {
      title: "Archivos",
      value: totalFiles.toString(),
      icon: FileSpreadsheet,
      change: totalFiles > 0 ? `${totalFiles} total` : "+0",
      changeType: totalFiles > 0 ? "positive" : "neutral",
      color: "purple"
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600"
    }
    return colors[color as keyof typeof colors]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Resumen</h1>
        <p className="text-gray-600 mt-1">Vista general de tu actividad</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <div className={`p-2 rounded-lg ${getColorClasses(stat.color)}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-bold text-gray-800">{stat.value}</p>
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Encuestas Recientes */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Encuestas Recientes</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentSurveys.length > 0 ? (
              recentSurveys.map((survey) => (
                <div key={survey.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{survey.nameSurvey}</p>
                    <p className="text-xs text-gray-500 mt-1">{getRelativeDate(survey.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">0</p>
                    <p className="text-xs text-gray-500">respuestas</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No hay encuestas recientes</p>
            )}
          </div>
        </div>

        {/* Actividad Semanal */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Actividad Semanal</h2>
          <div className="space-y-4">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => {
              const height = Math.random() * 100 + 20
              return (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 w-8">{day}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all"
                      style={{ width: `${height}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{Math.round(height)}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview