import { createClient } from '@supabase/supabase-js';

// Use the correct Supabase URL and anon key from the integrations file
import { supabase as integrationsSupabase } from '@/integrations/supabase/client';

// Re-export the supabase client from integrations
export const supabase = integrationsSupabase;