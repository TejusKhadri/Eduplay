import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") as string;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { email, password, display_name } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Try creating the user as confirmed
    const createRes = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: { display_name: display_name || null },
    });

    if (createRes.error) {
      // If the user already exists, update password and mark confirmed
      if ((createRes.error as any).code === 'email_exists') {
        // Find user by email via pagination
        let foundUser: any = null;
        let page = 1;
        const perPage = 1000;
        while (!foundUser) {
          const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
          if (error) break;
          const users = data?.users || [];
          foundUser = users.find((u: any) => (u.email || '').toLowerCase() === normalizedEmail);
          if (!foundUser) {
            if (users.length < perPage) break; // no more pages
            page += 1;
          }
        }

        if (!foundUser) {
          return new Response(JSON.stringify({ error: "User exists but could not be retrieved" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        const updateRes = await supabase.auth.admin.updateUserById(foundUser.id, {
          password,
          email_confirm: true,
          user_metadata: { display_name: display_name || foundUser.user_metadata?.display_name || null },
        });

        if (updateRes.error) {
          console.error("create-user update error:", updateRes.error);
          return new Response(JSON.stringify({ error: updateRes.error.message }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        return new Response(JSON.stringify({ user: updateRes.data.user, action: 'updated' }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      console.error("create-user create error:", createRes.error);
      return new Response(JSON.stringify({ error: createRes.error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ user: createRes.data.user, action: 'created' }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err: any) {
    console.error("create-user exception:", err);
    return new Response(JSON.stringify({ error: err?.message || "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});