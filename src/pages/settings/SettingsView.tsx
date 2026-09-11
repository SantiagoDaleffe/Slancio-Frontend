import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
    ArrowUpRight,
    CheckCircle2,
    CircleHelp,
    Loader2,
    Save,
    Sparkles,
    Store,
} from "lucide-react"
import { API_BASE_URL } from "@/config/api"
import { supabase } from "@/lib/supabase"

interface FormValues {
    tenant_id: string
    is_active: boolean
    max_discount_pct: number
    new_customer_discount: number
    whale_discount_pct: number
    low_margin_action: "free_shipping" | "ignore" | "fixed_amount"
    low_margin_fixed_amount: number
    whale_threshold: number
    grace_period_hours: number
    cooldown_days: number
}

interface SettingsViewProps {
    onLogout?: () => void
}

const SETTINGS_STORAGE_KEY = "slancio-settings-v1"

const getDefaultValues = (): FormValues => ({
    tenant_id: "",
    is_active: true,
    max_discount_pct: 15,
    new_customer_discount: 20,
    whale_discount_pct: 25,
    low_margin_action: "free_shipping",
    low_margin_fixed_amount: 0,
    whale_threshold: 50000,
    grace_period_hours: 2,
    cooldown_days: 15,
})

const parsePercentValue = (value: unknown, fallback: number) => {
    const parsed = Number(value)

    if (!Number.isFinite(parsed)) {
        return fallback
    }

    return parsed > 1 ? parsed : parsed * 100
}

const normalizeSavedSettings = (settings: Partial<Record<string, unknown>> | null | undefined): FormValues => {
    const defaults = getDefaultValues()

    if (!settings || typeof settings !== "object") {
        return defaults
    }

    const rules = settings.rules && typeof settings.rules === "object" ? settings.rules as Record<string, unknown> : settings

    const lowMarginAction = settings.low_margin_action ?? rules.low_margin_action
    const normalizedLowMarginAction =
        lowMarginAction === "free_shipping" || lowMarginAction === "ignore" || lowMarginAction === "fixed_amount"
            ? lowMarginAction
            : defaults.low_margin_action

    return {
        tenant_id: typeof settings.tenant_id === "string" ? settings.tenant_id : defaults.tenant_id,
        is_active: typeof settings.is_active === "boolean" ? settings.is_active : defaults.is_active,
        max_discount_pct: parsePercentValue(rules.max_discount_pct ?? settings.max_discount_pct, defaults.max_discount_pct),
        new_customer_discount: parsePercentValue(rules.new_customer_discount ?? settings.new_customer_discount, defaults.new_customer_discount),
        whale_discount_pct: parsePercentValue(rules.whale_discount_pct ?? settings.whale_discount_pct, defaults.whale_discount_pct),
        low_margin_action: normalizedLowMarginAction,
        low_margin_fixed_amount: Number.isFinite(Number(rules.low_margin_fixed_amount ?? settings.low_margin_fixed_amount))
            ? Number(rules.low_margin_fixed_amount ?? settings.low_margin_fixed_amount)
            : defaults.low_margin_fixed_amount,
        whale_threshold: Number.isFinite(Number(rules.whale_threshold ?? settings.whale_threshold))
            ? Number(rules.whale_threshold ?? settings.whale_threshold)
            : defaults.whale_threshold,
        grace_period_hours: Number.isFinite(Number(rules.grace_period_hours ?? settings.grace_period_hours))
            ? Number(rules.grace_period_hours ?? settings.grace_period_hours)
            : defaults.grace_period_hours,
        cooldown_days: Number.isFinite(Number(rules.cooldown_days ?? settings.cooldown_days))
            ? Number(rules.cooldown_days ?? settings.cooldown_days)
            : defaults.cooldown_days,
    }
}

const readStoredSettings = (): FormValues | null => {
    if (typeof window === "undefined") {
        return null
    }

    try {
        const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY)

        if (!raw) {
            return null
        }

        const parsed = JSON.parse(raw) as Partial<Record<string, unknown>>
        return normalizeSavedSettings(parsed)
    } catch {
        return null
    }
}

const persistSettings = (settings: FormValues) => {
    if (typeof window === "undefined") {
        return
    }

    try {
        window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    } catch {
        // Storage can fail in private browsing or quota-limited situations.
    }
}

export function SettingsView({ onLogout }: SettingsViewProps) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

    const lowMarginActionLabels: Record<FormValues["low_margin_action"], string> = {
        free_shipping: "Envío Gratis",
        ignore: "Sin Descuento (Ignorar)",
        fixed_amount: "Descuento Fijo",
    }

    const { register, handleSubmit, control, watch, reset } = useForm<FormValues>({
        defaultValues: getDefaultValues(),
    })

    const maxDiscountVal = watch("max_discount_pct")
    const newCustomerDiscountVal = watch("new_customer_discount")
    const whaleDiscountVal = watch("whale_discount_pct")
    const lowMarginActionVal = watch("low_margin_action")

    useEffect(() => {
        const loadSavedSettings = async () => {
            const storedSettings = readStoredSettings()

            if (storedSettings) {
                reset(storedSettings)
            }

            try {
                const { data: sessionData } = await supabase.auth.getSession()
                const token = sessionData.session?.access_token

                if (!token) {
                    return
                }

                const response = await fetch(`${API_BASE_URL}/config/rules`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    return
                }

                const payload = (await response.json()) as Partial<Record<string, unknown>>
                const normalizedSettings = normalizeSavedSettings(payload)

                reset(normalizedSettings)
                persistSettings(normalizedSettings)
            } catch {
                // Ignore fetch failures and keep whatever is already stored locally.
            }
        }

        void loadSavedSettings()
    }, [reset])

    const onSubmit = async (data: FormValues) => {
        setLoading(true)
        setMessage(null)

        try {
            const { data: sessionData } = await supabase.auth.getSession()
            const token = sessionData.session?.access_token

            if (!token) {
                throw new Error("Tu sesión expiró. Volvé a iniciar sesión.")
            }

            const tenantId = data.tenant_id.trim()
            const whaleThreshold = Number(data.whale_threshold)
            const gracePeriodHours = Number(data.grace_period_hours)
            const cooldownDays = Number(data.cooldown_days)
            const fixedAmount = Number(data.low_margin_fixed_amount)

            if (!tenantId) {
                throw new Error("Ingresá el dominio o ID de la tienda.")
            }
            if (!Number.isFinite(whaleThreshold) || !Number.isFinite(gracePeriodHours) || !Number.isFinite(cooldownDays)) {
                throw new Error("Completá los valores numéricos de la configuración.")
            }

            const payload = {
                tenant_id: tenantId,
                is_active: data.is_active,
                rules: {
                    max_discount_pct: data.max_discount_pct / 100,
                    new_customer_discount: data.new_customer_discount / 100,
                    whale_discount_pct: data.whale_discount_pct / 100,
                    low_margin_action: data.low_margin_action,
                    low_margin_fixed_amount: fixedAmount,
                    whale_threshold: whaleThreshold,
                    grace_period_hours: gracePeriodHours,
                    cooldown_days: cooldownDays,
                },
            }

            const response = await fetch(`${API_BASE_URL}/config/rules`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const responseBody = await response.text()
                let errorBody: { detail?: string; message?: string } | null = null

                try {
                    errorBody = JSON.parse(responseBody) as { detail?: string; message?: string }
                } catch {
                    // The backend may return plain text for internal errors.
                }

                console.error("Respuesta fallida al guardar la configuración", {
                    status: response.status,
                    responseBody,
                    payload,
                })

                if (response.status === 403) {
                    throw new Error("Acceso denegado: Este dominio ya está registrado por otra cuenta.")
                }
                if (response.status === 401) {
                    throw new Error("Tu sesión expiró. Volvé a iniciar sesión.")
                }
                throw new Error(errorBody?.detail || errorBody?.message || responseBody || `No se pudo guardar la configuración (${response.status}).`)
            }

            console.log("Configuración guardada correctamente", payload)
            persistSettings(data)
            setMessage({ type: "success", text: "¡Reglas guardadas con éxito!" })
        } catch (err: unknown) {
            const error = err instanceof Error ? err : new Error("Ocurrió un error inesperado al guardar.")
            console.error("Error al guardar la configuración", {
                error,
                endpoint: `${API_BASE_URL}/config/rules`,
                message: error.message,
            })

            if (error.message === "Failed to fetch" || error.message.includes("NetworkError")) {
                setMessage({ type: "error", text: "Error de red: El servidor de Slancio no responde." })
            } else if (error.message.includes("JWT") || error.message.includes("sesión expiró")) {
                setMessage({ type: "error", text: error.message })
            } else {
                setMessage({ type: "error", text: error.message })
            }
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        window.localStorage.removeItem(SETTINGS_STORAGE_KEY)
        await supabase.auth.signOut()
        if (onLogout) onLogout()
    }

    const sectionClass = "rounded-[28px] border border-[#d7d0c4] bg-[#f6f3ee] p-5 shadow-[0_1px_0_rgba(31,77,67,0.04)]"
    const labelClass = "text-sm font-medium text-[#1f2a28]"

    return (
        <div className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto max-w-300">
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5d6c66]">Optimiza tu recuperación</p>
                        <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] text-[#1f2a28] md:text-6xl">Configuración</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="button" className="rounded-[18px] bg-[#1f4d43] px-5 text-sm font-semibold text-[#edf5f1] hover:bg-[#163f37]">
                            Configurar bot
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_320px]">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <section className={sectionClass}>
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-[1.65rem] font-bold tracking-[-0.04em] text-[#1f2a28]">Bot de recuperación</h2>
                                    <p className="mt-1 text-sm text-[#5d6c66]">Controla cuándo y cómo se contacta a tus clientes.</p>
                                </div>

                                <Controller
                                    name="is_active"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex items-center gap-3 rounded-full border border-[#d7d0c4] bg-[#f4efe7] px-3 py-2">
                                            <Label htmlFor="is_active" className="text-sm font-semibold text-[#1f2a28]">
                                                {field.value ? "Bot activo" : "Bot inactivo"}
                                            </Label>
                                            <Switch id="is_active" checked={field.value} onCheckedChange={field.onChange} />
                                        </div>
                                    )}
                                />
                            </div>

                            <div className="mt-5 rounded-[22px] border border-[#d7d0c4] bg-[#edf4ef] p-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d9eae2] text-[#1f4d43]">
                                            <Store className="h-5 w-5" />
                                        </div>

                                        <div className="flex-1">
                                            <Label htmlFor="tenant_id" className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#5d6c66]">
                                                Dominio de Shopify o ID de Tiendanube
                                            </Label>
                                            <Input
                                                id="tenant_id"
                                                type="text"
                                                placeholder="ej: remeraspepito.myshopify.com"
                                                className="h-12 rounded-[16px] border-[#d7d0c4] bg-[#f8f5f0] text-base"
                                                {...register("tenant_id", { required: true })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 rounded-full bg-[#dff1e5] px-3 py-1.5 text-sm font-semibold text-[#1a6a4e]">
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#29b06b]" />
                                        Conectada
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className={sectionClass}>
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-[1.65rem] font-bold tracking-[-0.04em] text-[#1f2a28]">Oferta personalizada</h2>
                                    <p className="mt-1 text-sm text-[#5d6c66]">Define el descuento y el comportamiento del cupón.</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className={labelClass}>Descuento máximo</Label>
                                        <span className="rounded-full bg-[#edf3ef] px-2.5 py-1 text-sm font-semibold text-[#1f2a28]">{maxDiscountVal}%</span>
                                    </div>
                                    <Controller
                                        name="max_discount_pct"
                                        control={control}
                                        render={({ field }) => (
                                            <Slider
                                                min={0}
                                                max={50}
                                                step={1}
                                                value={[field.value]}
                                                onValueChange={(val) => field.onChange(Array.isArray(val) ? val[0] : val)}
                                            />
                                        )}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className={labelClass}>Descuento a nuevo cliente</Label>
                                        <span className="rounded-full bg-[#edf3ef] px-2.5 py-1 text-sm font-semibold text-[#1f2a28]">{newCustomerDiscountVal}%</span>
                                    </div>
                                    <Controller
                                        name="new_customer_discount"
                                        control={control}
                                        render={({ field }) => (
                                            <Slider
                                                min={0}
                                                max={50}
                                                step={1}
                                                value={[field.value]}
                                                onValueChange={(val) => field.onChange(Array.isArray(val) ? val[0] : val)}
                                            />
                                        )}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className={labelClass}>Descuento VIP</Label>
                                        <span className="rounded-full bg-[#edf3ef] px-2.5 py-1 text-sm font-semibold text-[#1f2a28]">{whaleDiscountVal}%</span>
                                    </div>
                                    <Controller
                                        name="whale_discount_pct"
                                        control={control}
                                        render={({ field }) => (
                                            <Slider
                                                min={0}
                                                max={50}
                                                step={1}
                                                value={[field.value]}
                                                onValueChange={(val) => field.onChange(Array.isArray(val) ? val[0] : val)}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className={sectionClass}>
                            <div className="mb-5">
                                <h2 className="text-[1.65rem] font-bold tracking-[-0.04em] text-[#1f2a28]">Límites y timing</h2>
                                <p className="mt-1 text-sm text-[#5d6c66]">Ajustá el comportamiento y el timing de tus campañas.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="low_margin_action" className={labelClass}>Acción para liquidaciones / bajo margen</Label>
                                <Controller
                                    name="low_margin_action"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <SelectTrigger className="h-12 w-full rounded-[16px] border-[#d7d0c4] bg-[#f8f5f0] text-[#1f2a28]">
                                                <span>{lowMarginActionLabels[field.value] || "Seleccioná una acción"}</span>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="free_shipping">Envío Gratis</SelectItem>
                                                <SelectItem value="ignore">Sin Descuento (Ignorar)</SelectItem>
                                                <SelectItem value="fixed_amount">Descuento Fijo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            {lowMarginActionVal === "fixed_amount" && (
                                <div className="mt-4 space-y-2">
                                    <Label htmlFor="low_margin_fixed_amount" className={labelClass}>Monto de descuento fijo ($)</Label>
                                    <Input
                                        id="low_margin_fixed_amount"
                                        type="number"
                                        step="0.01"
                                        placeholder="ej: 5000"
                                        className="h-12 rounded-[16px] border-[#d7d0c4] bg-[#f8f5f0]"
                                        {...register("low_margin_fixed_amount", { valueAsNumber: true })}
                                    />
                                </div>
                            )}

                            <div className="mt-5 grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="whale_threshold" className={labelClass}>Umbral VIP ($)</Label>
                                    <Input
                                        id="whale_threshold"
                                        type="number"
                                        step="0.01"
                                        placeholder="50000"
                                        className="h-12 rounded-[16px] border-[#d7d0c4] bg-[#f8f5f0]"
                                        {...register("whale_threshold", { valueAsNumber: true })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="grace_period_hours" className={labelClass}>Espera (horas)</Label>
                                    <Input
                                        id="grace_period_hours"
                                        type="number"
                                        placeholder="2"
                                        className="h-12 rounded-[16px] border-[#d7d0c4] bg-[#f8f5f0]"
                                        {...register("grace_period_hours", { valueAsNumber: true })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cooldown_days" className={labelClass}>Días anti spam</Label>
                                    <Input
                                        id="cooldown_days"
                                        type="number"
                                        placeholder="15"
                                        className="h-12 rounded-[16px] border-[#d7d0c4] bg-[#f8f5f0]"
                                        {...register("cooldown_days", { valueAsNumber: true })}
                                    />
                                </div>
                            </div>
                        </section>

                        {message && (
                            <div
                                className={`rounded-[18px] border px-4 py-3 text-sm font-medium ${message.type === "success"
                                    ? "border-[#bfdccf] bg-[#eaf5ee] text-[#1b6a4d]"
                                    : "border-[#e7b9b5] bg-[#fdf0ee] text-[#9d3b34]"
                                    }`}
                            >
                                {message.text}
                            </div>
                        )}

                        <div className="rounded-[22px] border border-[#d7d0c4] bg-[#f6f3ee] p-3">
                            <Button type="submit" disabled={loading} className="w-full rounded-[16px] bg-[#1f4d43] px-5 py-3 text-base font-semibold text-[#edf5f1] hover:bg-[#163f37]">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Guardando cambios...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Guardar configuración
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>

                    <aside className="space-y-6">
                        <div className="rounded-[28px] bg-[#1f4d43] p-5 text-[#edf5f1] shadow-[0_20px_35px_rgba(31,77,67,0.25)]">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[18px] bg-white/10 text-[#edf5f1]">
                                <Sparkles className="h-6 w-6" />
                            </div>

                            <h3 className="text-[2rem] font-bold tracking-[-0.06em] text-[#f4faf6]">Más ventas, menos esfuerzo</h3>
                            <p className="mt-3 text-sm leading-relaxed text-[#d8eae3]">
                                Slancio encuentra el momento perfecto para recuperar cada carrito con una oferta que convierte.
                            </p>
                        </div>

                        <div className="rounded-[28px] border border-[#d7d0c4] bg-[#f6f3ee] p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dfece6] text-[#1f4d43]">
                                    <CircleHelp className="h-4 w-4" />
                                </div>

                                <div>
                                    <h4 className="text-xl font-bold tracking-[-0.04em] text-[#1f2a28]">¿Necesitas ayuda?</h4>
                                    <p className="mt-1 text-sm text-[#5d6c66]">Estamos para acompañarte.</p>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="mt-5 w-full justify-between rounded-[16px] border-[#d7d0c4] bg-[#f8f5f0] px-4 py-3 text-base font-semibold text-[#1f2a28] hover:bg-[#edf3ef]"
                            >
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Hablar con soporte
                                </span>
                                <ArrowUpRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </aside>
                </div>
            </div>

            <div className="mx-auto mt-6 flex max-w-300 items-center justify-end gap-2 px-2 text-sm text-[#6c7d77] md:px-0">
                <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full px-2 py-1 transition hover:bg-[#edf3ef]">
                    <ArrowUpRight className="h-4 w-4 rotate-180" />
                    Cerrar sesión
                </button>
            </div>
        </div>
    )
}

