import type { ReactNode } from "react"
import type { Session } from "@supabase/supabase-js"
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
  session: Session | null
  children: ReactNode
}

export function ProtectedRoute({ session, children }: ProtectedRouteProps) {
  return session ? <>{children}</> : <Navigate to="/login" replace />
}
