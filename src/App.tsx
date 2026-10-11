import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PublicPortfolio } from './pages/PublicPortfolio'
import { AdminLogin } from './pages/AdminLogin'
import { AdminDashboard } from './pages/AdminDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicPortfolio />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<PublicPortfolio />} />
      </Routes>
    </BrowserRouter>
  )
}
