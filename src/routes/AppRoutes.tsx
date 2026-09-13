import { lazy, Suspense } from "react"
import { Loader2 } from "lucide-react"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import type { Session } from "@supabase/supabase-js"
import { AppShell } from "@/components/AppShell"
import { ProtectedRoute } from "@/components/ProtectedRoute"

const LazyLoginView = lazy(() =>
  import("@/pages/auth/LoginView").then((module) => ({ default: module.LoginView }))
)
const LazyTermsView = lazy(() =>
  import("@/pages/legal/TermsView").then((module) => ({ default: module.TermsView }))
)
const LazyPrivacyView = lazy(() =>
  import("@/pages/legal/PrivacyView").then((module) => ({ default: module.PrivacyView }))
)
const LazySettingsView = lazy(() =>
  import("@/pages/settings/SettingsView").then((module) => ({ default: module.SettingsView }))
)
const LazyDashboardView = lazy(() => import("@/pages/dashboard/DashboardView"))

interface AppRoutesProps {
  session: Session | null
  onLoginSuccess: () => void
  onLogout: () => Promise<void>
}

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#ece8df] text-[#1f2a28]">
      <Loader2 className="h-6 w-6 animate-spin text-[#4b6a62]" />
    </div>
  )
}

export function AppRoutes({ session, onLoginSuccess, onLogout }: AppRoutesProps) {
  const navigate = useNavigate()

  const routes = [
    {
      path: "/",
      element: <Navigate to={session ? "/dashboard" : "/login"} replace />,
    },
    {
      path: "/login",
      element: session ? (
        <Navigate to="/dashboard" replace />
      ) : (
        <main className="min-h-screen bg-[#ece8df]">
          <LazyLoginView
            onLoginSuccess={onLoginSuccess}
            onOpenTerms={() => navigate("/terms")}
            onOpenPrivacy={() => navigate("/privacy")}
          />
        </main>
      ),
    },
    {
      path: "/terms",
      element: (
        <LazyTermsView
          onBack={() => {
            if (session) {
              navigate(-1)
              return
            }

            navigate("/login")
          }}
        />
      ),
    },
    {
      path: "/privacy",
      element: (
        <LazyPrivacyView
          onBack={() => {
            if (session) {
              navigate(-1)
              return
            }

            navigate("/login")
          }}
        />
      ),
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute session={session}>
          <AppShell currentPath="/dashboard" onLogout={onLogout}>
            <div className="px-4 py-6 md:px-8 md:py-8">
              <div className="mx-auto max-w-300">
                <LazyDashboardView />
              </div>
            </div>
          </AppShell>
        </ProtectedRoute>
      ),
    },
    {
      path: "/settings",
      element: (
        <ProtectedRoute session={session}>
          <AppShell currentPath="/settings" onLogout={onLogout}>
            <LazySettingsView onLogout={onLogout} />
          </AppShell>
        </ProtectedRoute>
      ),
    },
    {
      path: "*",
      element: <Navigate to={session ? "/dashboard" : "/login"} replace />,
    },
  ]

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Suspense>
  )
}
