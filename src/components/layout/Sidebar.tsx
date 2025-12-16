import { NavLink } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { 
  BarChart2, 
  Home, 
  Settings, 
  Upload,
  FileCheck
} from "lucide-react"

function Sidebar() {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([])
  const headerRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard/overview', label: 'Resumen', icon: BarChart2 },
    { path: '/dashboard/surveys', label: 'Encuestas', icon: FileCheck },
    { path: '/dashboard/upload', label: 'Subir Archivos', icon: Upload },
    { path: '/dashboard/settings', label: 'Configuración', icon: Settings },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sidebarRef.current, {
        x: -100,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      })

      gsap.from(headerRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.5,
        delay: 0.2,
        ease: "power2.out"
      })

      gsap.from(navItemsRef.current, {
        x: -30,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        delay: 0.4,
        ease: "power2.out"
      })

      gsap.from(footerRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        delay: 0.8,
        ease: "power2.out"
      })
    })

    return () => ctx.revert()
  }, [])

  const handleMouseEnter = (index: number) => {
    gsap.to(navItemsRef.current[index], {
      x: 5,
      duration: 0.3,
      ease: "power2.out"
    })
  }

  const handleMouseLeave = (index: number) => {
    gsap.to(navItemsRef.current[index], {
      x: 0,
      duration: 0.3,
      ease: "power2.out"
    })
  }

  return (
    <aside 
      ref={sidebarRef}
      className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col h-full"
    >
      <div 
        ref={headerRef}
        className="p-6 border-b border-gray-200"
      >
        <h1 className="text-xl font-semibold text-gray-900">Sistema Encuestas</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        {navItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            ref={(el) => {
              navItemsRef.current[index] = el
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors mb-1 ${
                isActive ? 'bg-blue-50 text-blue-600 font-medium' : ''
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div 
        ref={footerRef}
        className="p-4 border-t border-gray-200"
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Admin</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar