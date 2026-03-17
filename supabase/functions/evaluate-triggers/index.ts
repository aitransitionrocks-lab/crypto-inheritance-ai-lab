import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch all active and warning plans
  const { data: plans, error: plansError } = await supabase
    .from("inheritance_plans")
    .select("id, user_id, plan_name, trigger_interval_days, max_missed_checkins, safety_period_days, status, created_at")
    .in("status", ["active", "warning"]);

  if (plansError || !plans || plans.length === 0) {
    return new Response(JSON.stringify({ message: "No plans to evaluate", error: plansError }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const results: { triggered: string[]; warned: string[]; ok: string[] } = {
    triggered: [],
    warned: [],
    ok: [],
  };

  const now = new Date();

  for (const plan of plans) {
    // Get latest check-in for this plan
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
    const intervalMs = plan.trigger_interval_days * 86400000;
    const dueDate = new Date(refDate.getTime() + intervalMs);
    const overdueDays = Math.floor((now.getTime() - dueDate.getTime()) / 86400000);

    if (overdueDays <= 0) {
      // Not overdue yet
      results.ok.push(plan.plan_name);
      continue;
    }

    // Calculate how many check-in intervals have been missed
    const missedIntervals = Math.floor((now.getTime() - refDate.getTime()) / intervalMs);

    if (missedIntervals >= plan.max_missed_checkins) {
      // Threshold exceeded: trigger the plan
      if (plan.status !== "triggered") {
        // Update plan status to triggered
        await supabase
          .from("inheritance_plans")
          .update({ status: "triggered" })
          .eq("id", plan.id);

        // Create trigger event record
        const safetyPeriodEnds = new Date(now.getTime() + plan.safety_period_days * 86400000);
        await supabase
          .from("trigger_events")
          .insert({
            plan_id: plan.id,
            reason: `Missed ${missedIntervals} check-in intervals (threshold: ${plan.max_missed_checkins})`,
            safety_period_ends: safetyPeriodEnds.toISOString(),
          });

        // Notify all heirs for this plan
        const { data: heirs } = await supabase
          .from("heirs")
          .select("id, name, email")
          .eq("plan_id", plan.id);

        if (heirs) {
          for (const heir of heirs) {
            try {
              await fetch(`${supabaseUrl}/functions/v1/send-email`, {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${supabaseKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  to: heir.email,
                  subject: `LegacyGuard: Inheritance Plan Triggered`,
                  html: buildTriggerNotificationHtml(heir.name, plan.plan_name, plan.safety_period_days),
                }),
              });
            } catch (emailError) {
              console.error(`Failed to notify heir ${heir.email}:`, emailError);
            }
          }
        }

        results.triggered.push(plan.plan_name);
      }
    } else {
      // Overdue but not yet at threshold: set warning and remind owner
      if (plan.status !== "warning") {
        await supabase
          .from("inheritance_plans")
          .update({ status: "warning" })
          .eq("id", plan.id);
      }

      // Send reminder to owner
      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", plan.user_id)
        .single();

      if (profile) {
        try {
          await fetch(`${supabaseUrl}/functions/v1/send-email`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: profile.email,
              subject: `Urgent: "${plan.plan_name}" check-in is overdue`,
              html: buildOverdueReminderHtml(plan.plan_name, overdueDays, plan.max_missed_checkins - missedIntervals),
            }),
          });
        } catch (emailError) {
          console.error(`Failed to send overdue reminder to ${profile.email}:`, emailError);
        }
      }

      results.warned.push(plan.plan_name);
    }
  }

  return new Response(JSON.stringify({
    evaluated: plans.length,
    results,
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

function buildTriggerNotificationHtml(heirName: string, planName: string, safetyDays: number): string {
  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #1a2332; padding: 20px; text-align: center;">
    <h1 style="color: #c9a84c; margin: 0;">&#x1f6e1;&#xfe0f; LegacyGuard</h1>
  </div>
  <div style="padding: 30px; background: #f8fafc;">
    <h2 style="color: #1a2332;">Inheritance Plan Triggered</h2>
    <p>Hi ${heirName},</p>
    <p>The inheritance plan "<strong>${planName}</strong>" has been triggered due to missed check-ins by the plan owner.</p>
    <p>A <strong>${safetyDays}-day safety period</strong> is now in effect. If the owner does not cancel the trigger during this period, you will receive further instructions for accessing the digital assets.</p>
    <p>No action is needed from you at this time.</p>
    <a href="https://frontend-sage-nine-13.vercel.app"
       style="display: inline-block; padding: 12px 24px; background: #1a2332; color: white; text-decoration: none; border-radius: 8px; margin-top: 10px;">
      Visit LegacyGuard
    </a>
    <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">
      LegacyGuard never has access to your private keys or crypto assets.
    </p>
  </div>
</div>`;
}

function buildOverdueReminderHtml(planName: string, overdueDays: number, intervalsRemaining: number): string {
  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #1a2332; padding: 20px; text-align: center;">
    <h1 style="color: #c9a84c; margin: 0;">&#x1f6e1;&#xfe0f; LegacyGuard</h1>
  </div>
  <div style="padding: 30px; background: #f8fafc;">
    <h2 style="color: #b91c1c;">Urgent: Check-in Overdue</h2>
    <p>Your plan "<strong>${planName}</strong>" check-in is <strong>${overdueDays} days overdue</strong>.</p>
    <p>If you do not check in soon, your inheritance plan will be triggered automatically.</p>
    <p style="color: #b91c1c; font-weight: bold;">Remaining intervals before trigger: ${intervalsRemaining}</p>
    <a href="https://frontend-sage-nine-13.vercel.app/checkin"
       style="display: inline-block; padding: 12px 24px; background: #b91c1c; color: white; text-decoration: none; border-radius: 8px; margin-top: 10px;">
      Check In Now
    </a>
    <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">
      LegacyGuard never has access to your private keys or crypto assets.
    </p>
  </div>
</div>`;
}
