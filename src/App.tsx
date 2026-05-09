import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'
import { Toaster } from 'sonner'

import HomePage from '@/src/pages/HomePage'
import LoginPage from '@/src/pages/LoginPage'
import DashboardPage from '@/src/pages/DashboardPage'
import PatientsPage from '@/src/pages/PatientsPage'
import PatientDetailsPage from '@/src/pages/PatientDetailsPage'
import AnalyticsPage from '@/src/pages/AnalyticsPage'

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <BrowserRouter>
          <ServiceWorkerRegister />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/:id" element={<PatientDetailsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
