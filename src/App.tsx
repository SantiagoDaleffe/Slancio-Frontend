import { useEffect, useState } from "react"
import { LayoutGrid, Settings2, Sparkles, Loader2, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { LoginView } from "@/pages/auth/LoginView"
import { PrivacyView } from "@/pages/legal/PrivacyView"
import { TermsView } from "@/pages/legal/TermsView"
import { SettingsView } from "@/pages/settings/SettingsView"
import DashboardView from "@/pages/dashboard/DashboardView"

type View = "login" | "summary" | "settings" | "terms" | "privacy"

export default function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>("login")

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setView(session ? "summary" : "login")
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setView(session ? "summary" : "login")
    })

    return () => subscription.unsubscribe()
  }, [])

  const goBack = () => {
    setView(session ? "summary" : "login")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#ece8df] text-[#1f2a28]">
        <Loader2 className="h-6 w-6 animate-spin text-[#4b6a62]" />
      </div>
    )
  }

  if (view === "terms") {
    return <TermsView onBack={goBack} />
  }

  if (view === "privacy") {
    return <PrivacyView onBack={goBack} />
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-[#ece8df]">
        <LoginView
          onLoginSuccess={() => setView("summary")}
          onOpenTerms={() => setView("terms")}
          onOpenPrivacy={() => setView("privacy")}
        />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#ece8df] text-[#1f2a28]">
      <div className="flex w-full items-stretch">
        <aside className="hidden w-70 flex-col border-r border-[#d8d1c6] bg-[#f4f1eb] p-4 lg:flex lg:min-h-screen">
          <div className="flex items-center justify-between px-2 pb-5 pt-1">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1f4d43] text-[#edf4f1] shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="text-[2rem] font-black leading-none tracking-[-0.08em] text-[#1f2a28]">slancio</div>
            </div>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d8d1c6] bg-[#f9f7f3] text-[#56756d] transition hover:bg-[#edf3ef]"
              aria-label="Ayuda"
            >
              <ArrowRight className="h-4 w-4 -rotate-45" />
            </button>
          </div>

          <nav className="mt-5 space-y-2">
            <button
              type="button"
              onClick={() => setView("summary")}
              className={`flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left text-[#1f2a28] transition hover:bg-[#edf3ef] ${view === "summary" ? "bg-[#dcece4] shadow-[inset_0_0_0_1px_rgba(31,77,67,0.05)]" : ""}`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${view === "summary" ? "bg-[#d0e3d8] text-[#1f4d43]" : "bg-[#f0efe9] text-[#1f2a28]"}`}>
                <LayoutGrid className="h-4 w-4" />
              </div>
              <span className="text-base font-medium">Resumen</span>
            </button>

            <button
              type="button"
              onClick={() => setView("settings")}
              className={`flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left text-[#1f2a28] transition hover:bg-[#edf3ef] ${view === "settings" ? "bg-[#dcece4] shadow-[inset_0_0_0_1px_rgba(31,77,67,0.05)]" : ""}`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${view === "settings" ? "bg-[#d0e3d8] text-[#1f4d43]" : "bg-[#f0efe9] text-[#1f2a28]"}`}>
                <Settings2 className="h-4 w-4" />
              </div>
              <span className="text-base font-medium">Configuración</span>
            </button>
          </nav>

          <div className="mt-auto pb-2">
            <button
              type="button"
              onClick={() => {
                setSession(null)
                setView("login")
              }}
              className="flex items-center gap-2 rounded-[18px] px-2 py-2 text-base text-[#1f2a28] transition hover:bg-[#edf3ef]"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              <span>Cerrar sesión</span>
            </button>

            <div className="mt-4 space-y-1 px-2 text-sm text-[#6c7d77]">
              <button
                type="button"
                onClick={() => setView("terms")}
                className="block w-full text-left transition hover:text-[#1f4d43]"
              >
                Términos y condiciones
              </button>
              <button
                type="button"
                onClick={() => setView("privacy")}
                className="block w-full text-left transition hover:text-[#1f4d43]"
              >
                Privacidad
              </button>
            </div>

            <div className="mt-4 px-2 text-sm text-[#6c7d77]">Slancio v0.2.0</div>
          </div>
        </aside>

        <div className="flex-1">
          {view === "summary" ? (
            <div className="px-4 py-6 md:px-8 md:py-8">
              <div className="mx-auto max-w-300">
                <DashboardView />
              </div>
            </div>
          ) : (
            <SettingsView onLogout={() => {
              setSession(null)
              setView("login")
            }} />
          )}
        </div>
      </div>
    </main>
  )
}