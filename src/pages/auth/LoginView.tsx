import { useState } from "react"
import { ArrowRight, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

interface LoginViewProps {
    onLoginSuccess: () => void
    onOpenTerms: () => void
    onOpenPrivacy: () => void
}

export function LoginView({ onLoginSuccess, onOpenTerms, onOpenPrivacy }: LoginViewProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (!email.includes('@') || !email.includes('.')) {
            setError("Por favor, ingresá un correo electrónico válido.")
            setLoading(false)
            return
        }

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (authError) throw authError

            onLoginSuccess()
        } catch (err: any) {
            setError("Credenciales incorrectas. Verificá tu correo y contraseña.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full bg-[#0f4d3a] text-[#edf4f1]">
            <div className="mx-auto max-w-[1500px] px-5 py-5 sm:px-8 lg:px-10">
                <header className="flex items-center gap-3 pl-2 pt-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dff3e8] text-[#0f4d3a] shadow-sm">
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="text-[2.1rem] font-black leading-none tracking-[-0.08em] text-[#f0f5f2]">slancio</div>
                </header>

                <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
                    <div className="pl-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#dff3e8]/35 bg-[#0a3d32]/40 px-4 py-2 text-sm font-medium text-[#edf4f1]">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#dff3e8]" />
                            Recuperación inteligente para ecommerce
                        </div>

                        <h1 className="mt-8 max-w-[620px] text-[3.4rem] font-black leading-[0.86] tracking-[-0.07em] text-[#edf7ef] sm:text-[4.8rem] lg:text-[7rem]">
                            Convierte carritos olvidados en <span className="text-[#90d5b3]">ventas.</span>
                        </h1>

                        <p className="mt-6 max-w-[520px] text-xl leading-relaxed text-[#dfeae3]">
                            Slancio trabaja en silencio para que tu tienda venda más, sin perseguir a tus clientes.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dff3e8] text-xs font-black text-[#0f4d3a]">
                                    MG
                                </div>
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dff3e8] text-xs font-black text-[#0f4d3a]">
                                    TR
                                </div>
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dff3e8] text-xs font-black text-[#0f4d3a]">
                                    CS
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-base font-semibold text-[#edf4f1]">
                                <span className="text-[#a6dfc1]">+2.500</span>
                                <span className="text-[#dfeae3]">tiendas</span>
                            </div>

                            <div className="text-base text-[#dfeae3]">
                                ya recuperan ventas con Slancio
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center lg:justify-end">
                        <div className="w-full max-w-[520px] rounded-[30px] bg-[#f2f0ec] p-6 text-[#1f2a28] shadow-[0_28px_60px_rgba(10,20,18,0.28)] sm:p-8">
                            <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#5d6c66]">
                                BIENVENIDO DE VUELTA
                            </p>

                            <h2 className="mt-5 text-4xl font-black tracking-[-0.06em] text-[#1f2a28]">
                                Inicia sesión
                            </h2>

                            <p className="mt-2 text-base text-[#5d6c66]">
                                Ingresa a tu cuenta para continuar.
                            </p>

                            <form onSubmit={handleLogin} noValidate className="mt-7 space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-base font-medium text-[#1f2a28]">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="hola@tuempresa.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12 rounded-xl border-[#ccd4cf] bg-[#f9f8f5] text-base text-[#1f2a28] placeholder:text-[#8f9d95]"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-4">
                                        <Label htmlFor="password" className="text-base font-medium text-[#1f2a28]">
                                            Contraseña
                                        </Label>
                                        <button
                                            type="button"
                                            className="text-sm font-semibold text-[#1f4d43] transition hover:text-[#163d35]"
                                        >
                                            ¿La olvidaste?
                                        </button>
                                    </div>

                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="********"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 rounded-xl border-[#ccd4cf] bg-[#f9f8f5] text-base text-[#1f2a28] placeholder:text-[#8f9d95]"
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-2 h-14 w-full rounded-[18px] bg-[#1f4d43] text-base font-semibold text-[#edf5f1] shadow-[0_14px_20px_rgba(31,77,67,0.16)] transition hover:bg-[#163f37]"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Conectando...
                                        </>
                                    ) : (
                                        <>
                                            Ingresar
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            <div className="mt-6 text-center text-sm text-[#5d6c66]">
                                Al continuar, aceptas nuestros
                                <button
                                    type="button"
                                    onClick={onOpenTerms}
                                    className="mx-1 font-semibold text-[#1f4d43] underline underline-offset-2"
                                >
                                    Términos de uso
                                </button>
                                y
                                <button
                                    type="button"
                                    onClick={onOpenPrivacy}
                                    className="mx-1 font-semibold text-[#1f4d43] underline underline-offset-2"
                                >
                                    Política de privacidad
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}