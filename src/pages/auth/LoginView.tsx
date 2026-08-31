import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, LogIn } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface LoginViewProps {
    onLoginSuccess: () => void
}

export function LoginView({ onLoginSuccess }: LoginViewProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Validación manual para esquivar el cartel feo del navegador
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
        <div className="w-full max-w-sm p-4">
            <form onSubmit={handleLogin} noValidate>
                <Card className="shadow-sm border-border">
                    <CardHeader className="text-center flex flex-col items-center justify-center pb-6">
                        <img 
                            src="/logo-slancio.png" 
                            alt="Slancio Logo" 
                            className="w-full h-auto object-contain scale-155"
                        />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-medium">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="cliente@tienda.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="font-medium">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <div className="p-3 text-sm font-medium rounded bg-red-50 text-red-700 border border-red-200">
                                {error}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={loading} className="w-full font-semibold">
                            {loading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Conectando...</>
                            ) : (
                                <><LogIn className="mr-2 h-4 w-4" /> Iniciar Sesión</>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}