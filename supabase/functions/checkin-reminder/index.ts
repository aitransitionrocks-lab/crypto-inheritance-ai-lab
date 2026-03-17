import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function buildReminderEmailHtml(planName: string, days: number): string {
  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #1a2332; padding: 20px; text-align: center;">
    <h1 style="color: #c9a84c; margin: 0;">&#x1f6e1;&#xfe0f; LegacyGuard</h1>
  </div>
  <div style="padding: 30px; background: #f8fafc;">
    <h2 style="color: #1a2332;">Check-in Reminder</h2>
    <p>Your plan "<strong>${planName}</strong>" check-in is due in <strong>${days} days</strong>.</p>
    <p>Please check in to keep your inheritance plan active.</p>
    <a href="https://frontend-sage-nine-13.vercel.app/checkin"
       style="display: inline-block; padding: 12px 24px; background: #1a2332; color: white; text-decoration: none; border-radius: 8px; margin-top: 10px;">
      Check In Now
    </a>
    <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">
      LegacyGuard never has access to your private keys or crypto assets.
    </p>
  </div>
</div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Find plans where last check-in is approaching due date
  const { data: plans } = await supabase
    .from("inheritance_plans")
    .select("id, user_id, plan_name, trigger_interval_days, checkin_method, created_at")
    .eq("status", "active");

  if (!plans || plans.length === 0) {
    return new Response(JSON.stringify({ message: "No active plans" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const reminders = [];

  for (const plan of plans) {
    // Get latest check-in
    const { data: checkins } = await supabase
      .from("checkins")
      .select("created_at")
      .eq("plan_id", plan.id)
      .order("created_at", { ascending: false })
      .limit(1);

    const lastCheckin = checkins?.[0]?.created_at;
    const reference = lastCheckin || plan.created_at;

    if (!reference) continue;

    const refDate = new Date(reference);
    const dueDate = new Date(refDate.getTime() + plan.trigger_interval_days * 86400000);
    const now = new Date();
    const daysUntilDue = Math.floor((dueDate.getTime() - now.getTime()) / 86400000);

    // Send reminder if due within 7 days
    if (daysUntilDue <= 7 && daysUntilDue > 0) {
      // Get user email
      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", plan.user_id)
        .single();

      if (profile) {
        // Send email via send-email Edge Function
        const emailHtml = buildReminderEmailHtml(plan.plan_name, daysUntilDue);

        try {
          await fetch(`${supabaseUrl}/functions/v1/send-email`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: profile.email,
              subject: `Check-in Reminder: "${plan.plan_name}" due in ${daysUntilDue} days`,
              html: emailHtml,
            }),
          });
        } catch (emailError) {
          console.error(`Failed to send email to ${profile.email}:`, emailError);
        }

        reminders.push({
          email: profile.email,
          plan_name: plan.plan_name,
          days_until_due: daysUntilDue,
        });
      }
    }
  }

  return new Response(JSON.stringify({ reminders_sent: reminders.length, reminders }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
