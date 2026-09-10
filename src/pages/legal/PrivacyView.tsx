import { Button } from "@/components/ui/button"

interface PrivacyViewProps {
    onBack: () => void
}

export function PrivacyView({ onBack }: PrivacyViewProps) {
    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                            Slancio
                        </p>
                        <h1 className="mt-2 text-3xl font-bold">Política de privacidad</h1>
                    </div>

                    <Button variant="outline" onClick={onBack}>
                        Volver
                    </Button>
                </div>

                <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">1. Información que recopilamos</h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                            Slancio puede recopilar información necesaria para operar la plataforma, como datos de acceso,
                            datos de configuración de la tienda, información de contacto y contenido asociado a la
                            administración de promociones y reglas comerciales.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">2. Uso de la información</h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                            La información recopilada se utiliza para prestar el servicio, mejorar la experiencia de uso,
                            garantizar la seguridad del sistema y cumplir con las obligaciones operativas y legales de la
                            plataforma.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">3. Almacenamiento y seguridad</h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                            Los datos se almacenan con medidas razonables de seguridad para prevenir accesos no autorizados,
                            pérdidas, uso indebido o alteraciones. El usuario es responsable de mantener confidenciales sus
                            credenciales y de utilizar la plataforma con cuidado.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">4. Compartición de datos</h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                            Slancio puede compartir información con proveedores o servicios técnicos necesarios para la
                            operación de la plataforma, siempre en el marco de la normativa vigente y con las medidas de
                            protección adecuadas.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">5. Derechos del usuario</h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                            El usuario puede solicitar información sobre los datos que se almacenan, su finalidad, y, en
                            los casos previstos por la ley, puede pedir correcciones, eliminaciones o restricciones de uso,
                            según corresponda.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">6. Contacto</h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                            Para consultas relacionadas con privacidad, tratamiento de datos o solicitudes del usuario,
                            puede comunicarse con el equipo responsable a través de los canales de soporte oficiales.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
