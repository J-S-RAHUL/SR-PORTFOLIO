import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PublicPortfolio } from './pages/PublicPortfolio'

const AdminLogin = lazy(() =>
  import('./pages/AdminLogin').then((m) => ({ default: m.AdminLogin }))
)
const AdminDashboard = lazy(() =>
  import('./pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
)

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<PublicPortfolio />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<PublicPortfolio />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
