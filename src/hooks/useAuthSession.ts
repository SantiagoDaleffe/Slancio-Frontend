import { useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

export function useAuthSession() {
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        supabase.auth
            .getSession()
            .then(({ data: { session } }) => {
                if (isMounted) {
                    setSession(session)
                    setLoading(false)
                }
            })
            .catch(() => {
                if (isMounted) {
                    setSession(null)
                    setLoading(false)
                }
            })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            if (isMounted) {
                setSession(nextSession)
                setLoading(false)
            }
        })

        return () => {
            isMounted = false
            subscription.unsubscribe()
        }
    }, [])

    const signOut = async (): Promise<void> => {
        await supabase.auth.signOut()
    }

    return { session, loading, signOut }
}
