import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"

function Header() {
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/") // Redirige a Home
  }

  return (
    <div className="p-4 relative">
      <header className="bg-black shadow-xl rounded-2xl mx-auto border border-gray-800">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Dashboard</h2>

          <div className="relative flex items-center gap-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              🔔
            </button>

            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <span className="text-sm font-medium text-gray-300">
                  {user.name || "Usuario"}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg border border-gray-200 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-[#000000] hover:text-white transition-colors rounded"
                  >
                    <LogOut className="w-4 h-4" />
                    Salir
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header
