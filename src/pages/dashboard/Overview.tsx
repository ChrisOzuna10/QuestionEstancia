function Overview() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Resumen</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Encuestas</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">24</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Respuestas</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">156</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Archivos</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">12</p>
        </div>
      </div>
    </div>
  )
}

export default Overview