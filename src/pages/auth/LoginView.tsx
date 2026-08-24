import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (authError) {
                throw authError
            }

            onLoginSuccess()
        } catch (err: any) {
            setError(err.message || "Credenciales inválidas")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-sm p-4">
            <form onSubmit={handleLogin}>
                <Card className="shadow-sm border-border">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl font-bold">Slancio</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
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
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 text-xs font-medium rounded bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-400">
                                {error}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter>
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> ...
                                </>
                            ) : (
                                <>
                                    <LogIn className="mr-2 h-4 w-4" /> Log In
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}