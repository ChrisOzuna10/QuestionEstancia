import { useState } from "react"
import { useNavigate } from "react-router-dom" // <- importamos useNavigate
import { authService } from "@/services/auth.service"

export default function Login() {
  const navigate = useNavigate() // <- inicializamos el hook
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Correo y contraseña son obligatorios")
      return
    }

    setError(null)
    setLoading(true)

    try {
      const result = await authService.login(email, password)

      // Guardar token y datos de usuario
      localStorage.setItem("token", result.data.token)
      localStorage.setItem("user", JSON.stringify(result.data))

      console.log("Login exitoso:", result)

      // Redirigir al dashboard
      navigate("/dashboard") // <- aquí vamos al dashboard
    } catch (err: any) {
      setError(err.message || "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white text-black p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Iniciar sesión
        </h1>

        {error && (
          <p className="mb-4 text-sm text-red-600 text-center">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm mb-1">Correo</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded transition ${
            loading ? "bg-gray-600" : "bg-black hover:bg-gray-900 text-white"
          }`}
        >
          {loading ? "Cargando..." : "Entrar"}
        </button>
      </form>
    </div>
  )
}
