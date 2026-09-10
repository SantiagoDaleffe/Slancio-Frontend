import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { LoginView } from "@/pages/auth/LoginView"
import { PrivacyView } from "@/pages/legal/PrivacyView"
import { TermsView } from "@/pages/legal/TermsView"
import { SettingsView } from "@/pages/settings/SettingsView"
import { Loader2 } from "lucide-react"

type View = "login" | "settings" | "terms" | "privacy"

export default function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>("login")

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setView(session ? "settings" : "login")
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setView(session ? "settings" : "login")
    })

    return () => subscription.unsubscribe()
  }, [])

  const goBack = () => {
    setView(session ? "settings" : "login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (view === "terms") {
    return <TermsView onBack={goBack} />
  }

  if (view === "privacy") {
    return <PrivacyView onBack={goBack} />
  }

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        {!session ? (
          <LoginView onLoginSuccess={() => setView("settings")} />
        ) : (
          <SettingsView onLogout={() => {
            setSession(null)
            setView("login")
          }} />
        )}
      </div>

      <footer className="border-t border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-2 px-4 py-3 text-[11px] text-muted-foreground">
          <button
            type="button"
            onClick={() => setView("terms")}
            className="transition hover:text-foreground underline-offset-4 hover:underline"
          >
            Términos y condiciones
          </button>
          <span aria-hidden="true">•</span>
          <button
            type="button"
            onClick={() => setView("privacy")}
            className="transition hover:text-foreground underline-offset-4 hover:underline"
          >
            Privacidad
          </button>
        </div>
      </footer>
    </main>
  )
}