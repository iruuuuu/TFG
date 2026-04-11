import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { ProveedorAutenticacion } from "./lib/auth-context"
import { ProveedorDatos } from "./lib/data-context"
import { Toaster } from "./components/ui/toaster"
import App from "./App"
import "./globals.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProveedorAutenticacion>
        <ProveedorDatos>
          <App />
          <Toaster />
        </ProveedorDatos>
      </ProveedorAutenticacion>
    </BrowserRouter>
  </React.StrictMode>,
)
