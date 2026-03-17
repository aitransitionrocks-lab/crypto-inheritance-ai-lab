// Analytics Event Tracking
// Logs to console AND stores in Supabase (events table)
//
// Supabase table setup - Run in Supabase SQL Editor:
// CREATE TABLE IF NOT EXISTS public.analytics_events (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   event TEXT NOT NULL,
//   properties JSONB DEFAULT '{}',
//   timestamp TIMESTAMPTZ NOT NULL,
//   page TEXT,
//   user_agent TEXT,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
// ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Anyone can insert events" ON public.analytics_events FOR INSERT WITH CHECK (true);

import { createClient } from '@/lib/supabase/client';

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  const data = {
    event,
    properties: properties || {},
    timestamp: new Date().toISOString(),
    page: typeof window !== 'undefined' ? window.location.pathname : '',
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  };

  // Log to console (always works)
  console.log('[Analytics]', event, properties);

  // Try to store in Supabase (optional - table may not exist yet)
  try {
    const supabase = createClient();
    supabase.from('analytics_events').insert(data).then(() => {});
  } catch {
    // Graceful fallback - analytics table not yet created
  }
}

// Predefined events from the validation system:
// trackEvent('page_view', { page })
// trackEvent('signup_start')
// trackEvent('signup_complete')
// trackEvent('vault_created', { wallet_count })
// trackEvent('heir_added', { relationship })
// trackEvent('trigger_configured', { interval_days, method })
// trackEvent('checkin_completed', { method })
// trackEvent('setup_abandoned', { last_step })
// trackEvent('pricing_viewed')
// trackEvent('feedback_submitted', { confidence })
