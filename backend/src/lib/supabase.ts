import { createClient } from "@supabase/supabase-js";

// Service-role client — server-side only, never expose this key to the app
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
