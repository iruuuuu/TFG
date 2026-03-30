import { Routes, Route } from "react-router-dom"
import { HomePage } from "./pages/HomePage"
import { LoginPage } from "./pages/LoginPage"
import { AdminPage } from "./pages/AdminPage"
import { CocinaPage } from "./pages/CocinaPage"
import { MenuPage } from "./pages/MenuPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/cocina" element={<CocinaPage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  )
}
