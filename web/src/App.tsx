import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { CatalogPage } from './pages/CatalogPage'
import { PlatePage } from './pages/PlatePage'

export function App() {
  return (
    <HashRouter>
      <div className="shell">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/plate/:slug" element={<PlatePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  )
}
