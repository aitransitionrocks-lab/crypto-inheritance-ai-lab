import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { heir_id } = await req.json();

  const { data: heir } = await supabase
    .from("heirs")
    .select("*, inheritance_plans(plan_name, profiles(display_name, email))")
    .eq("id", heir_id)
    .single();

  if (!heir) {
    return new Response(JSON.stringify({ error: "Heir not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // TODO: Send actual email via Resend/SendGrid
  console.log(`NOTIFY HEIR: ${heir.name} (${heir.email}) — added to plan by ${heir.inheritance_plans?.profiles?.display_name || 'owner'}`);

  return new Response(JSON.stringify({
    success: true,
    heir_name: heir.name,
    heir_email: heir.email,
    message: `Notification logged for ${heir.name}. Email integration pending.`
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
