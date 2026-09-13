import { ArrowRight, LayoutGrid, Settings2, ShoppingCart } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface AppNavigationProps {
    currentPath: "/dashboard" | "/settings"
    onLogout: () => Promise<void>
}

export function AppNavigation({ currentPath, onLogout }: AppNavigationProps) {
    const navigate = useNavigate()

    return (
        <aside className="hidden w-70 flex-col border-r border-[#d8d1c6] bg-[#f4f1eb] p-4 lg:flex lg:min-h-screen">
            <div className="flex items-center justify-between px-2 pb-5 pt-1">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1f4d43] text-[#edf4f1] shadow-sm">
                        <ShoppingCart className="h-4 w-4" />
                    </div>
                    <div className="text-[2rem] font-black leading-none tracking-[-0.08em] text-[#1f2a28]">Slancio</div>
                </div>

            </div>

            <nav className="mt-5 space-y-2">
                <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className={`flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left text-[#1f2a28] transition hover:bg-[#edf3ef] ${currentPath === "/dashboard" ? "bg-[#dcece4] shadow-[inset_0_0_0_1px_rgba(31,77,67,0.05)]" : ""}`}
                >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${currentPath === "/dashboard" ? "bg-[#d0e3d8] text-[#1f4d43]" : "bg-[#f0efe9] text-[#1f2a28]"}`}>
                        <LayoutGrid className="h-4 w-4" />
                    </div>
                    <span className="text-base font-medium">Resumen</span>
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/settings")}
                    className={`flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left text-[#1f2a28] transition hover:bg-[#edf3ef] ${currentPath === "/settings" ? "bg-[#dcece4] shadow-[inset_0_0_0_1px_rgba(31,77,67,0.05)]" : ""}`}
                >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${currentPath === "/settings" ? "bg-[#d0e3d8] text-[#1f4d43]" : "bg-[#f0efe9] text-[#1f2a28]"}`}>
                        <Settings2 className="h-4 w-4" />
                    </div>
                    <span className="text-base font-medium">Configuración</span>
                </button>
            </nav>

            <div className="mt-auto pb-2">
                <button
                    type="button"
                    onClick={onLogout}
                    className="flex items-center gap-2 rounded-[18px] px-2 py-2 text-base text-[#1f2a28] transition hover:bg-[#edf3ef]"
                >
                    <ArrowRight className="h-4 w-4 rotate-180" />
                    <span>Cerrar sesión</span>
                </button>

                <div className="mt-4 space-y-1 px-2 text-sm text-[#6c7d77]">
                    <button
                        type="button"
                        onClick={() => navigate("/terms")}
                        className="block w-full text-left transition hover:text-[#1f4d43]"
                    >
                        Términos y condiciones
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/privacy")}
                        className="block w-full text-left transition hover:text-[#1f4d43]"
                    >
                        Privacidad
                    </button>
                </div>

                <div className="mt-4 px-2 text-sm text-[#6c7d77]">Slancio v0.2.0</div>
            </div>
        </aside>
    )
}
