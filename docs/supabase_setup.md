# LegacyGuard Supabase Setup Guide

## 1. Disable Email Confirmation (for testing)
1. Go to https://supabase.com/dashboard/project/rgrfhjtpwrxemfuscfwm/auth/providers
2. Click on "Email" provider
3. Toggle OFF "Confirm email"
4. Click "Save"

This allows test users to sign up without verifying their email.

## 2. Deploy Edge Functions

### Prerequisites
1. Install the Supabase CLI: `brew install supabase/tap/supabase`
2. Log in to Supabase: `supabase login` (this opens a browser for authentication)
3. Link the project: `supabase link --project-ref rgrfhjtpwrxemfuscfwm`

### Deploy
Run from the project root:
```
supabase functions deploy checkin-reminder --no-verify-jwt
supabase functions deploy notify-heir --no-verify-jwt
```

### Alternative: Deploy via Dashboard
If CLI authentication is not available:
1. Go to https://supabase.com/dashboard/project/rgrfhjtpwrxemfuscfwm/functions
2. Click "Create a new function"
3. Name it `checkin-reminder`, paste the code from `supabase/functions/checkin-reminder/index.ts`
4. Repeat for `notify-heir` with code from `supabase/functions/notify-heir/index.ts`
5. For both functions, disable JWT verification in the function settings

## 3. Set up Cron Job for Check-in Reminders
In the SQL Editor, run:
```sql
SELECT cron.schedule(
  'checkin-reminder-daily',
  '0 9 * * *',
  $$SELECT net.http_post(
    url := 'https://rgrfhjtpwrxemfuscfwm.supabase.co/functions/v1/checkin-reminder',
    headers := '{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  )$$
);
```

## 4. Email Provider (Future)
For production email sending, integrate:
- Resend.com (recommended, free tier: 3000 emails/month)
- Set RESEND_API_KEY in Supabase Edge Function secrets
