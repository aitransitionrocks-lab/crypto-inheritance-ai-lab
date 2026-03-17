-- Enable pg_cron and pg_net extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Daily check-in reminder at 9:00 AM UTC
SELECT cron.schedule(
  'daily-checkin-reminder',
  '0 9 * * *',
  $$SELECT net.http_post(
    url := 'https://rgrfhjtpwrxemfuscfwm.supabase.co/functions/v1/checkin-reminder',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true))
  )$$
);

-- Daily trigger evaluation at 10:00 AM UTC
SELECT cron.schedule(
  'daily-trigger-evaluation',
  '0 10 * * *',
  $$SELECT net.http_post(
    url := 'https://rgrfhjtpwrxemfuscfwm.supabase.co/functions/v1/evaluate-triggers',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true))
  )$$
);
