import { createClient, SupabaseClient } from '@supabase/supabase-js'

// This client uses the Service Role key and should ONLY be used in Server Components or Server Actions.
// NEVER expose this to the client.

const globalForSupabase = global as unknown as { adminSupabase: SupabaseClient }

export const getAdminSupabase = () => {
    if (globalForSupabase.adminSupabase) {
        return globalForSupabase.adminSupabase
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_Service_Role_KEY!

    if (!supabaseServiceKey) {
        throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable")
    }

    const client = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    })

    if (process.env.NODE_ENV !== 'production') {
        globalForSupabase.adminSupabase = client
    }

    return client
}
