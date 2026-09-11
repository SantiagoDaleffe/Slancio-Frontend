import { useEffect, useMemo, useState } from "react"
import { ArrowUpRight as ArrowUpRightIcon, Mail, TrendingUp, Percent, PackageCheck, Sparkles } from "lucide-react"
import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import { API_BASE_URL } from "@/config/api"
import { supabase } from "@/lib/supabase"

interface Totals {
    total_emails_sent: number
    potential_value: number
    recovered_value: number
    avg_discount_pct: number
    currency: string
}

interface ChartDataPoint {
    name: string
    emails: number
    potencial: number
    recuperado: number
    descuento_promedio: number
}

interface MetricsResponse {
    tenant_id?: string
    totals?: Partial<Totals>
    chart_data?: ChartDataPoint[]
}

const defaultTotals: Totals = {
    total_emails_sent: 0,
    potential_value: 0,
    recovered_value: 0,
    avg_discount_pct: 0,
    currency: "ARS",
}

const toNumber = (value: number | string | null | undefined) => {
    if (typeof value === "number" && Number.isFinite(value)) return value
    if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value)
        if (Number.isFinite(parsed)) return parsed
    }

    return 0
}

const formatCurrency = (value: number, currency: string) =>
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: currency || "ARS",
        maximumFractionDigits: 0,
    }).format(value)

const formatCompactCurrency = (value: number, currency: string) => {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1).replace(".0", "")}M`
    }

    if (value >= 1000) {
        return `${(value / 1000).toFixed(1).replace(".0", "")}K`
    }

    return formatCurrency(value, currency)
}

const DashboardView = () => {
    const [metrics, setMetrics] = useState<MetricsResponse | null>(null)

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

            setMetrics((await response.json()) as MetricsResponse)
        }

        fetchMetrics().catch(() => undefined)
    }, [])

    const totals = useMemo(() => {
        const totalsFromServer = metrics?.totals ?? {}

        return {
            ...defaultTotals,
            ...totalsFromServer,
            total_emails_sent: toNumber(totalsFromServer.total_emails_sent),
            potential_value: toNumber(totalsFromServer.potential_value),
            recovered_value: toNumber(totalsFromServer.recovered_value),
            avg_discount_pct: toNumber(totalsFromServer.avg_discount_pct),
            currency: totalsFromServer.currency ?? defaultTotals.currency,
        }
    }, [metrics])

    const chartData = metrics?.chart_data ?? []

    const stats = [
        {
            label: "Emails enviados",
            value: totals.total_emails_sent.toLocaleString("es-AR"),
            accent: "bg-[#edf5ef] text-[#1f2a28] border border-[#d7d0c4]",
            badgeClass: "bg-[#dfeae3] text-[#1f4d43]",
            icon: <Mail className="h-4 w-4" />,
            metric: "12,5%",
        },
        {
            label: "Valor potencial",
            value: formatCurrency(totals.potential_value, totals.currency),
            accent: "bg-[#edf5ef] text-[#1f2a28] border border-[#d7d0c4]",
            badgeClass: "bg-[#dfeae3] text-[#1f4d43]",
            icon: <TrendingUp className="h-4 w-4" />,
            metric: "8,2%",
        },
        {
            label: "Valor recuperado",
            value: formatCurrency(totals.recovered_value, totals.currency),
            accent: "bg-[#1f4d43] text-[#edf5f1] border border-[#1f4d43] shadow-[0_18px_32px_rgba(31,77,67,0.14)]",
            badgeClass: "bg-[#dfeae3] text-[#1f4d43]",
            icon: <PackageCheck className="h-4 w-4" />,
            metric: "18,4%",
        },
        {
            label: "Descuento promedio",
            value: `${totals.avg_discount_pct.toLocaleString("es-AR", { maximumFractionDigits: 1 })}%`,
            accent: "bg-[#edf5ef] text-[#1f2a28] border border-[#d7d0c4]",
            badgeClass: "bg-[#dfeae3] text-[#1f4d43]",
            icon: <Percent className="h-4 w-4" />,
            metric: "7,1%",
        },
    ]

    const miniCharts = [
        {
            title: "Emails enviados",
            dataKey: "emails",
            color: "#1f4d43",
            formatter: (value: number) => value.toLocaleString("es-AR"),
        },
        {
            title: "Potencial",
            dataKey: "potencial",
            color: "#f59e0b",
            formatter: (value: number) => formatCurrency(value, totals.currency),
        },
        {
            title: "Descuento promedio",
            dataKey: "descuento_promedio",
            color: "#8b5cf6",
            formatter: (value: number) => `${value.toLocaleString("es-AR", { maximumFractionDigits: 1 })}%`,
        },
    ] as const

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#5d6c66]">{new Date().toLocaleDateString("es-AR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                    <h1 className="mt-3 text-[2.4rem] font-black tracking-[-0.07em] text-[#1f2a28] md:text-[4rem]">Bienvenido a Slancio</h1>
                </div>

                <button
                    type="button"
                    className="hidden items-center gap-2 rounded-[18px] bg-[#1f4d43] px-5 py-3 text-sm font-semibold text-[#edf5f1] shadow-[0_14px_20px_rgba(31,77,67,0.16)] transition hover:bg-[#163f37] md:inline-flex"
                >
                    <Sparkles className="h-4 w-4" />
                    Configurar bot
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat, index) => (
                    <div
                        key={stat.label}
                        className={`rounded-[24px] p-4 ${stat.accent}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.badgeClass}`}>
                                {stat.icon}
                            </div>
                            <div className="flex items-center gap-1 rounded-full bg-[#e5f0e7] px-2 py-1 text-xs font-semibold text-[#1f4d43]">
                                <ArrowUpRightIcon className="h-3.5 w-3.5" />
                                {stat.metric}
                            </div>
                        </div>

                        <div className="mt-5 text-sm text-[#5d6c66]">{stat.label}</div>
                        <div className={`mt-2 text-[1.9rem] font-black tracking-[-0.06em] ${index === 2 ? "text-[#edf5f1]" : "text-[#1f2a28]"}`}>
                            {stat.value}
                        </div>
                    </div>
                ))}
            </div>

            {chartData.length > 0 ? (
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                    <div className="rounded-[28px] border border-[#d7d0c4] bg-[#f6f3ee] p-5">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#5d6c66]">Evolución</p>
                                <h2 className="mt-1 text-2xl font-black tracking-[-0.06em] text-[#1f2a28]">Plata recuperada</h2>
                            </div>
                            <span className="rounded-full bg-[#edf3ef] px-2.5 py-1 text-xs font-semibold text-[#1f4d43]">Últimos 6 meses</span>
                        </div>

                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid stroke="#d9d3ca" strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#5d6c66", fontSize: 12 }} />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: "#5d6c66", fontSize: 12 }}
                                        tickFormatter={(value: string | number) => formatCompactCurrency(Number(value), totals.currency)}
                                    />
                                    <Tooltip
                                        formatter={(value, name) => {
                                            const numericValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0)

                                            if (name === "potencial" || name === "recuperado") {
                                                return [formatCurrency(numericValue, totals.currency), name === "potencial" ? "Potencial" : "Recuperado"]
                                            }

                                            return [numericValue.toLocaleString("es-AR"), name]
                                        }}
                                        labelStyle={{ color: "#1f2a28", fontWeight: 700 }}
                                        contentStyle={{ borderRadius: 16, border: "1px solid #d7d0c4", backgroundColor: "#f8f5f0" }}
                                    />
                                    <Bar dataKey="potencial" fill="#e5e7eb" barSize={26} radius={[6, 6, 0, 0]} />
                                    <Line dataKey="recuperado" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {miniCharts.map((chart) => (
                            <div key={chart.title} className="rounded-[24px] border border-[#d7d0c4] bg-[#f6f3ee] p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-sm font-semibold text-[#1f2a28]">{chart.title}</p>
                                </div>
                                <div className="h-24 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={chartData} margin={{ top: 10, right: 4, left: 0, bottom: 0 }}>
                                            <Bar dataKey={chart.dataKey} fill={chart.color} radius={[6, 6, 0, 0]} />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-2 text-xs text-[#5d6c66]">
                                    {chart.formatter(chartData[chartData.length - 1]?.[chart.dataKey as keyof ChartDataPoint] as number ?? 0)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="rounded-[28px] border border-[#d7d0c4] bg-[#f6f3ee] p-6 text-sm text-[#5d6c66]">
                    Todavía no hay datos de métricas para mostrar.
                </div>
            )}
        </div>
    )
}

export default DashboardView