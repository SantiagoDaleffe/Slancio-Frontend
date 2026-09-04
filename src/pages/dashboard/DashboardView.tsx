import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { API_BASE_URL } from "@/config/api"
import { supabase } from "@/lib/supabase"

interface Metrics {
    total_emails_sent: number
    total_cart_value: number
    avg_discount_pct: number
    currency: string
}

const DashboardView = () => {
    const [metrics, setMetrics] = useState<Metrics | null>(null)

    useEffect(() => {
        const fetchMetrics = async () => {
            const { data: sessionData } = await supabase.auth.getSession()
            const token = sessionData.session?.access_token

            if (!token) return

            const response = await fetch(`${API_BASE_URL}/analytics/metrics`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) return

            setMetrics(await response.json() as Metrics)
        }

        fetchMetrics().catch(() => undefined)
    }, [])

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-sky-100 bg-sky-50/40 shadow-sm dark:border-sky-900/50 dark:bg-sky-950/20">
                <CardHeader>
                    <CardDescription className="text-sky-700 dark:text-sky-300">Mails Enviados</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="font-['Plus_Jakarta_Sans'] text-4xl font-bold leading-none tracking-tight text-sky-950 dark:text-sky-50">
                        {metrics?.total_emails_sent.toLocaleString("es-AR") ?? "-"}
                    </p>
                </CardContent>
            </Card>
            <Card className="border-emerald-100 bg-emerald-50/40 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/20">
                <CardHeader>
                    <CardDescription className="text-emerald-700 dark:text-emerald-300">Valor Recuperado</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="font-['Plus_Jakarta_Sans'] text-4xl font-bold leading-none tracking-tight text-emerald-950 dark:text-emerald-50">
                        {metrics ? `${metrics.currency} ${metrics.total_cart_value.toLocaleString("es-AR")}` : "-"}
                    </p>
                </CardContent>
            </Card>
            <Card className="border-amber-100 bg-amber-50/40 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/20">
                <CardHeader>
                    <CardDescription className="text-amber-700 dark:text-amber-300">Descuento Promedio</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="font-['Plus_Jakarta_Sans'] text-4xl font-bold leading-none tracking-tight text-amber-950 dark:text-amber-50">
                        {metrics ? `${metrics.avg_discount_pct.toLocaleString("es-AR")} %` : "-"}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

export default DashboardView