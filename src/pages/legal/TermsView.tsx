import { Button } from "@/components/ui/button"

interface TermsViewProps {
    onBack: () => void
}

export function TermsView({ onBack }: TermsViewProps) {
    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                            Slancio
                        </p>
                        <h1 className="mt-2 text-3xl font-bold">Términos y condiciones</h1>
                    </div>

                    <Button variant="outline" onClick={onBack}>
                        Volver
                    </Button>
                </div>

                <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">1. Aceptación de los términos</h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                            Al acceder y utilizar Slancio, el usuario acepta quedar sujeto a estos Términos y condiciones,
                            así como a las políticas internas aplicables de la plataforma, incluyendo las medidas de
                            seguridad, uso responsable y cumplimiento de las obligaciones contractuales establecidas por
                            la tienda o el proveedor del servicio.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">2. Uso de la plataforma</h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                            El usuario se compromete a utilizar Slancio únicamente para fines legítimos, con buena fe,
                            respetando la normativa vigente, la propiedad intelectual, la confidencialidad de los datos y
                            las reglas de la operación comercial de la tienda.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">3. Responsabilidad y servicios</h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                            Slancio ofrece herramientas de administración y configuración para apoyar la operación de venta,
                            promociones y reglas comerciales. El usuario es responsable de la configuración, los datos
                            ingresados, la verificación de la información y la correcta utilización de las funciones
                            disponibles.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">4. Protección de datos y seguridad</h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                            Los datos gestionados por la plataforma deben utilizarse conforme a las políticas de seguridad,
                            privacidad y almacenamiento aplicables. El usuario debe evitar compartir credenciales,
                            mantener accesos seguros y notificar de inmediato cualquier uso no autorizado.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">5. Modificaciones</h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                            Slancio puede actualizar estos términos, las funcionalidades o las políticas asociadas en
                            cualquier momento. El uso continuado de la plataforma luego de los cambios implica la
                            aceptación de las nuevas condiciones.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold">6. Contacto</h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                            Para consultas sobre estos términos o sobre el uso de la plataforma, el usuario puede
                            comunicarse con el equipo responsable de Slancio a través de los canales oficiales de
                            soporte.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
