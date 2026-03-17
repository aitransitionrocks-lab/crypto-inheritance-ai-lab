import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function buildHeirNotificationHtml(heirName: string, ownerName: string): string {
  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #1a2332; padding: 20px; text-align: center;">
    <h1 style="color: #c9a84c; margin: 0;">&#x1f6e1;&#xfe0f; LegacyGuard</h1>
  </div>
  <div style="padding: 30px; background: #f8fafc;">
    <h2 style="color: #1a2332;">You've Been Designated as an Heir</h2>
    <p>Hi ${heirName},</p>
    <p><strong>${ownerName}</strong> has designated you as an heir for their crypto inheritance plan on LegacyGuard.</p>
    <p>This means that if ${ownerName} becomes unable to manage their digital assets, you will receive instructions to access them securely.</p>
    <p><strong>No action is needed from you right now.</strong></p>
    <p>If you have questions, you can learn more about LegacyGuard at our website.</p>
    <a href="https://frontend-sage-nine-13.vercel.app"
       style="display: inline-block; padding: 12px 24px; background: #1a2332; color: white; text-decoration: none; border-radius: 8px; margin-top: 10px;">
      Learn More
    </a>
  </div>
</div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const supabase = createClient(supabaseUrl, supabaseKey);

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

  const ownerName = heir.inheritance_plans?.profiles?.display_name || "The plan owner";
  const heirName = heir.name;
  const emailHtml = buildHeirNotificationHtml(heirName, ownerName);

  // Send email via send-email Edge Function
  try {
    await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: heir.email,
        subject: `You've been designated as an heir on LegacyGuard`,
        html: emailHtml,
      }),
    });
  } catch (emailError) {
    console.error(`Failed to send heir notification to ${heir.email}:`, emailError);
  }

  return new Response(JSON.stringify({
    success: true,
    heir_name: heir.name,
    heir_email: heir.email,
    message: `Notification sent to ${heir.name}.`
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
