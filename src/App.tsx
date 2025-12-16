import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import DashboardLayout from './components/layout/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Surveys from './pages/dashboard/Surveys'
import UploadFiles from './pages/dashboard/UploadFiles'
import Settings from './pages/dashboard/Settings'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard/overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="surveys" element={<Surveys />} />
        <Route path="upload" element={<UploadFiles />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App