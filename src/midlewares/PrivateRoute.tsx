import { Navigate, Outlet } from "react-router-dom"

export default function PrivateRoute() {
  const token = localStorage.getItem("token") // revisa si hay token

  if (!token) {
    // si no hay token, redirige al login
    return <Navigate to="/login" replace />
  }

  // si hay token, muestra las rutas hijas
  return <Outlet />
}
