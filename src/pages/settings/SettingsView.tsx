import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save, LogOut } from "lucide-react"
import { API_BASE_URL } from "@/config/api"
import { supabase } from "@/lib/supabase"

interface FormValues {
    tenant_id: string
    is_active: boolean
    max_discount_pct: number // 0 a 50 (se muestra en UI como %)
    new_customer_discount: number // 0 a 50 (se muestra en UI como %)
    low_margin_action: "free_shipping" | "no_discount" | "fixed_amount"
    whale_threshold: number
    grace_period_hours: number
}

interface SettingsViewProps {
    onLogout?: () => void
}

export function SettingsView({ onLogout }: SettingsViewProps) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

    const { register, handleSubmit, control, watch } = useForm<FormValues>({
        defaultValues: {
            tenant_id: "mitienda.myshopify.com",
            is_active: true,
            max_discount_pct: 15,
            new_customer_discount: 20,
            low_margin_action: "free_shipping",
            whale_threshold: 500,
            grace_period_hours: 2,
        },
    })

    // Leemos los valores en tiempo real para mostrarlos junto al Slider
    const maxDiscountVal = watch("max_discount_pct")
    const newCustomerDiscountVal = watch("new_customer_discount")

    const onSubmit = async (data: FormValues) => {
        setLoading(true)
        setMessage(null)

        try {
            const { data: sessionData } = await supabase.auth.getSession()
            const token = sessionData.session?.access_token

            const payload = {
                tenant_id: data.tenant_id,
                is_active: data.is_active,
                rules: {
                    max_discount_pct: data.max_discount_pct / 100, // 15 -> 0.15
                    new_customer_discount: data.new_customer_discount / 100, // 20 -> 0.20
                    low_margin_action: data.low_margin_action,
                    whale_threshold: Number(data.whale_threshold),
                    grace_period_hours: Number(data.grace_period_hours),
                },
            }

            const response = await fetch(`${API_BASE_URL}/config/rules`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                throw new Error(`Error en el servidor: ${response.statusText}`)
            }

            setMessage({ type: "success", text: "Rules saved successfully!" })
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "An error occurred while saving" })
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        if (onLogout) onLogout()
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4 sm:p-6">
            {/* Header superior del Panel */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                    <p className="text-sm text-muted-foreground">Manage bot settings</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="shadow-sm border-border">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-semibold">Rule Configuration</CardTitle>
                                <CardDescription>General settings for abandoned cart rules</CardDescription>
                            </div>

                            {/* Switch is_active */}
                            <Controller
                                name="is_active"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex items-center space-x-2">
                                        <Label htmlFor="is_active" className="text-sm font-medium">
                                            {field.value ? "Bot Active " : "Bot Inactive"}
                                        </Label>
                                        <Switch id="is_active" checked={field.value} onCheckedChange={field.onChange} />
                                    </div>
                                )}
                            />
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Input Tenant ID (Shopify / Tiendanube) */}
                        <div className="space-y-2">
                            <Label htmlFor="tenant_id" className="font-medium">
                                Dominio de Shopify o ID de Tiendanube
                            </Label>
                            <Input
                                id="tenant_id"
                                type="text"
                                placeholder="ej: mitienda.myshopify.com"
                                {...register("tenant_id", { required: true })}
                            />
                            <p className="text-xs text-muted-foreground">
                                Identificador único de la tienda que va a consumir las reglas.
                            </p>
                        </div>

                        {/* Slider 1: max_discount_pct */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="font-medium">Maximum General Discount</Label>
                                <span className="text-sm font-semibold px-2 py-0.5 rounded bg-muted">
                                    {maxDiscountVal}%
                                </span>
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

                        {/* Slider 2: new_customer_discount */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="font-medium">New Customer Discount</Label>
                                <span className="text-sm font-semibold px-2 py-0.5 rounded bg-muted">
                                    {newCustomerDiscountVal}%
                                </span>
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

                        {/* Dropdown: low_margin_action */}
                        <div className="space-y-2">
                            <Label htmlFor="low_margin_action" className="font-medium">Action for Low Margin Items</Label>
                            <Controller
                                name="low_margin_action"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccioná una acción" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="free_shipping">Free Shipping</SelectItem>
                                            <SelectItem value="no_discount">No Discount</SelectItem>
                                            <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        {/* Inputs Numéricos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="whale_threshold" className="font-medium">Whale Customer Threshold ($)</Label>
                                <Input
                                    id="whale_threshold"
                                    type="number"
                                    step="0.01"
                                    placeholder="500.00"
                                    {...register("whale_threshold", { valueAsNumber: true })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="grace_period_hours" className="font-medium">Grace Period (Hours)</Label>
                                <Input
                                    id="grace_period_hours"
                                    type="number"
                                    placeholder="2"
                                    {...register("grace_period_hours", { valueAsNumber: true })}
                                />
                            </div>
                        </div>

                        {/* Banner de Feedback */}
                        {message && (
                            <div
                                className={`p-3 rounded-md text-sm font-medium border ${message.type === "success"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400"
                                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400"
                                    }`}
                            >
                                {message.text}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter>
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving changes...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Save Configuration
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}