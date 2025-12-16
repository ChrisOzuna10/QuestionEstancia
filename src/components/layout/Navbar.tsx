"use client"
import { useState } from "react"
import { Link } from "react-router-dom"
import { cn } from "@/utils/cn"
import { HoveredLink, Menu, MenuItem } from "@/components/ui/navbar-menu"

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null)
  
  return (
    <div className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}>
      <Menu setActive={setActive}>
        <Link to="/">
          <MenuItem setActive={setActive} active={active} item="Inicio">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/">Home</HoveredLink>
              <HoveredLink href="/#features">Características</HoveredLink>
            </div>
          </MenuItem>
        </Link>

        <MenuItem setActive={setActive} active={active} item="Dashboard">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/dashboard/overview">Resumen</HoveredLink>
            <HoveredLink href="/dashboard/surveys">Encuestas</HoveredLink>
            <HoveredLink href="/dashboard/upload">Subir Archivos</HoveredLink>
            <HoveredLink href="/dashboard/settings">Configuración</HoveredLink>
          </div>
        </MenuItem>

        <Link to="/dashboard">
          <MenuItem setActive={setActive} active={active} item="Ir al Dashboard">
          </MenuItem>
        </Link>
      </Menu>
    </div>
  )
}

export default Navbar