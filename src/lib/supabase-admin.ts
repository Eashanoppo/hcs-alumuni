import { createClient } from '@supabase/supabase-js'

// This client uses the Service Role key and should ONLY be used in Server Components or Server Actions.
// NEVER expose this to the client (omit NEXT_PUBLIC_ prefix in a real scenario, but I'll use the user's provided var).

export const getAdminSupabase = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_Service_Role_KEY!

    if (!supabaseServiceKey) {
        throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable")
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    })
}
