-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  primary_wallet_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vaults
CREATE TABLE IF NOT EXISTS public.vaults (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  wallet_addresses JSONB DEFAULT '[]',
  encrypted_instructions BYTEA,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inheritance Plans
CREATE TABLE IF NOT EXISTS public.inheritance_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vault_id UUID REFERENCES public.vaults(id) ON DELETE SET NULL,
  plan_name TEXT NOT NULL,
  threshold INTEGER DEFAULT 2,
  total_shares INTEGER DEFAULT 3,
  trigger_interval_days INTEGER DEFAULT 90,
  max_missed_checkins INTEGER DEFAULT 2,
  safety_period_days INTEGER DEFAULT 7,
  checkin_method TEXT DEFAULT 'email' CHECK (checkin_method IN ('email', 'sms', 'app_push')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'triggered', 'executed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Heirs
CREATE TABLE IF NOT EXISTS public.heirs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES public.inheritance_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  relationship TEXT NOT NULL,
  shard_index INTEGER,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'revoked')),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Check-ins
CREATE TABLE IF NOT EXISTS public.checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES public.inheritance_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  method TEXT DEFAULT 'app',
  device_info TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger Events
CREATE TABLE IF NOT EXISTS public.trigger_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES public.inheritance_plans(id) ON DELETE CASCADE,
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  reason TEXT,
  safety_period_ends TIMESTAMPTZ,
  cancelled BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMPTZ,
  executed BOOLEAN DEFAULT FALSE,
  executed_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inheritance_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heirs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trigger_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own vaults" ON public.vaults FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vaults" ON public.vaults FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vaults" ON public.vaults FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own vaults" ON public.vaults FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own plans" ON public.inheritance_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plans" ON public.inheritance_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plans" ON public.inheritance_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own plans" ON public.inheritance_plans FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own heirs" ON public.heirs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own heirs" ON public.heirs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own heirs" ON public.heirs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own heirs" ON public.heirs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own checkins" ON public.checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own checkins" ON public.checkins FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own triggers" ON public.trigger_events FOR SELECT USING (
  plan_id IN (SELECT id FROM public.inheritance_plans WHERE user_id = auth.uid())
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_vaults_updated_at BEFORE UPDATE ON public.vaults FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.inheritance_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
