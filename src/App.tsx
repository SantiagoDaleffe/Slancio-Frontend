import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { LoginView } from "@/pages/auth/LoginView"
import { SettingsView } from "@/pages/settings/SettingsView"
import { Loader2 } from "lucide-react"

export default function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Escuchar el estado de autenticación al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
      {!session ? (
        <LoginView onLoginSuccess={() => setLoading(false)} />
      ) : (
        <SettingsView onLogout={() => setSession(null)} />
      )}
    </main>
  )
}