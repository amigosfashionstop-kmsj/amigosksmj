import { createClient } from '@supabase/supabase-js';

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase is not configured.');
  }
  return { supabaseUrl, supabaseAnonKey };
}

let publicClient: ReturnType<typeof createClient> |  undefined;
function getPublicClient() {
  if (!publicClient) {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
    publicClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return publicClient;
}

export const supabase = new Prox({} as ReturnType<typeof createClient>, {
  get(_target, property) {
    const client = getPublicClient();
    const value = Reflect.get(client, property, client);
    return typeof value === 'function' ? value.bind(client) : value;
  }
});

// Create an admin client with service role for backend operations (bypasses RLS)
export const getAdminSupabase = () => {
  const { supabaseUrl } = getSupabaseConfig();
  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!adminKey) throw new Error('Supabase service role key is not configured.');
  return createClient(supabaseUrl, adminKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};