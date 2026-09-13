import { Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuthSession } from "@/hooks/useAuthSession"
import { AppRoutes } from "@/routes/AppRoutes"

export default function App() {
  const { session, loading, signOut } = useAuthSession()
  const navigate = useNavigate()

  const handleLoginSuccess = () => {
    navigate("/dashboard", { replace: true })
  }

  const handleLogout = async () => {
    try {
      await signOut()
    } finally {
      navigate("/login", { replace: true })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#ece8df] text-[#1f2a28]">
        <Loader2 className="h-6 w-6 animate-spin text-[#4b6a62]" />
      </div>
    )
  }

  return <AppRoutes session={session} onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />
}
