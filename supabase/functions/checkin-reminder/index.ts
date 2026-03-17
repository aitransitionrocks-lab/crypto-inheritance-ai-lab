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

  // Find plans where last check-in is approaching due date
  const { data: plans } = await supabase
    .from("inheritance_plans")
    .select("id, user_id, plan_name, trigger_interval_days, checkin_method")
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
    const planCreated = plan.created_at;
    const reference = lastCheckin || planCreated;

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
        reminders.push({
          email: profile.email,
          plan_name: plan.plan_name,
          days_until_due: daysUntilDue,
        });
        // TODO: Integrate with Resend/SendGrid for actual email sending
        console.log(`REMINDER: ${profile.email} — plan "${plan.plan_name}" due in ${daysUntilDue} days`);
      }
    }
  }

  return new Response(JSON.stringify({ reminders_sent: reminders.length, reminders }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
