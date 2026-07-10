import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import './index.css'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import VehicleDetail from './pages/VehicleDetail'
import RentToOwn from './pages/RentToOwn'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vehicles/:slug" element={<VehicleDetail />} />
        <Route path="/rent-to-own" element={<RentToOwn />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </React.StrictMode>,
)
