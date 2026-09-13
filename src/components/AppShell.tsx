import type { ReactNode } from "react"
import { AppNavigation } from "@/components/AppNavigation"

interface AppShellProps {
  children: ReactNode
  currentPath: "/dashboard" | "/settings"
  onLogout: () => Promise<void>
}

export function AppShell({ children, currentPath, onLogout }: AppShellProps) {
  return (
    <main className="min-h-screen bg-[#ece8df] text-[#1f2a28]">
      <div className="flex w-full items-stretch">
        <AppNavigation currentPath={currentPath} onLogout={onLogout} />
        <div className="flex-1">{children}</div>
      </div>
    </main>
  )
}
