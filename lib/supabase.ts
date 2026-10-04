import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) }
});

// Create an admin client with service role for backend operations (bypasses RLS)
export const getAdminSupabase = () => {
  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(supabaseUrl, adminKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) }
  });
};
