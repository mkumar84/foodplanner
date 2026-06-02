import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Lazy client — only instantiated when Supabase is configured
let _client: SupabaseClient | null = null
function getClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase not configured — add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env')
  }
  if (!_client) _client = createClient(supabaseUrl, supabaseAnonKey)
  return _client
}

// Exported for components that need it (auth state listener etc.)
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return getClient()[prop as keyof SupabaseClient]
  },
})

export async function signInWithMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/planner`,
    },
  })
  if (error) throw error
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function loadProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error && error.code !== 'PGRST116') throw error // PGRST116 = row not found
  return data as {
    family: unknown
    meal_plan: unknown
    grocery_list: unknown
    agent_notes: unknown
    onboarding_complete: boolean
  } | null
}

export async function saveProfile(userId: string, payload: {
  family?: unknown
  meal_plan?: unknown
  grocery_list?: unknown
  agent_notes?: unknown
  onboarding_complete?: boolean
}) {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...payload, updated_at: new Date().toISOString() })
  if (error) throw error
}
