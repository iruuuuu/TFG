import { Button } from "@/components/ui/button"
import { ChefHat, ArrowRight, Utensils, Calendar } from "lucide-react"
import { Link } from "react-router-dom"

export function LandingHero({ 
  primaryHref = "/iniciarSesion", 
  primaryLabel = "Acceder al Panel" 
}: { 
  primaryHref?: string, 
  primaryLabel?: string 
}) {
  return (
    <div className="relative overflow-hidden flex-1 flex items-center bg-[var(--gm-page-bg)]">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted={true}
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-30"
      >
        <source src="/video_landing.mp4" type="video/mp4" />
      </video>

      {/* Background decoration overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#FAF7F0]/75 via-[#FAF7F0]/90 to-[#FAF7F0]" />
      <div className="absolute top-0 right-0 z-10 -mr-20 -mt-20 h-96 w-96 rounded-full bg-[#FAD85D]/10 blur-3xl" />

      <div className="container relative z-20 mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--gm-accent)] shadow-lg shadow-[var(--gm-accent)]/20 animate-in fade-in zoom-in duration-700">
            <ChefHat className="h-10 w-10 text-[var(--gm-heading)]" />
          </div>

          <h1 className="max-w-5xl text-5xl font-extrabold tracking-tight text-[var(--md-heading)] sm:text-7xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            Mendos <br />
            <span className="text-[var(--md-coral)]">IES Antonio de Mendoza</span>
          </h1>
          
          <p className="mt-4 max-w-2xl text-lg leading-7 text-[var(--gm-body)] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            La plataforma inteligente para la gestión integral de cocina escolar. 
            Reservas, menús y eventos en un solo lugar.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <Button asChild size="lg" className="h-14 px-8 bg-[var(--gm-accent)] text-[var(--gm-heading)] hover:bg-[var(--gm-accent-hover)] text-lg font-bold shadow-md transition-all hover:scale-105">
              <Link to={primaryHref} className="flex items-center gap-2">
                {primaryLabel} <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="h-14 px-8 border-2 border-[var(--gm-accent)] text-[var(--gm-heading)] hover:bg-[var(--gm-accent)]/20 text-lg font-semibold transition-all">
              <Link to="/menu" className="flex items-center gap-2">
                Consultar Menú <Utensils className="h-5 w-5 text-[var(--gm-coral)]" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
            {[
              { icon: Calendar, title: "Reservas", desc: "Gestión ágil de pedidos diarios" },
              { icon: Utensils, title: "Menús", desc: "Planificación semanal completa" },
              { icon: ChefHat, title: "Eventos", desc: "Coordinación de eventos gastronómicos" },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center p-4 bg-[var(--gm-surface)]/60 backdrop-blur-sm rounded-2xl border border-[var(--gm-accent)]/30 shadow-sm">
                <feature.icon className="h-8 w-8 text-[var(--gm-coral)] mb-3" />
                <h3 className="font-bold text-[var(--gm-heading)]">{feature.title}</h3>
                <p className="text-sm text-[var(--gm-body)] mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
