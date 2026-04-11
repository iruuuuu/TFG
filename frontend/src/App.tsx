import { Routes, Route } from "react-router-dom"
import { PaginaInicio } from "./pages/PaginaInicio"
import { PaginaLogin } from "./pages/PaginaLogin"
import { PaginaAdmin } from "./pages/PaginaAdmin"
import { PaginaCocina } from "./pages/PaginaCocina"
import { PaginaMenu } from "./pages/PaginaMenu"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PaginaInicio />} />
      <Route path="/iniciarSesion" element={<PaginaLogin />} />
      <Route path="/admin" element={<PaginaAdmin />} />
      <Route path="/cocina" element={<PaginaCocina />} />
      <Route path="/menu" element={<PaginaMenu />} />
      <Route path="*" element={<PaginaInicio />} />
    </Routes>
  )
}
