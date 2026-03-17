export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  primary_wallet_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Vault {
  id: string;
  user_id: string;
  name: string;
  wallet_addresses: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface InheritancePlan {
  id: string;
  user_id: string;
  vault_id: string | null;
  plan_name: string;
  threshold: number;
  total_shares: number;
  trigger_interval_days: number;
  max_missed_checkins: number;
  safety_period_days: number;
  checkin_method: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Heir {
  id: string;
  plan_id: string;
  user_id: string;
  name: string;
  email: string;
  relationship: string;
  shard_index: number | null;
  verification_status: string;
  verified_at: string | null;
  created_at: string;
}

export interface CheckIn {
  id: string;
  plan_id: string;
  user_id: string;
  method: string;
  device_info: string | null;
  ip_address: string | null;
  created_at: string;
}

export interface TriggerEvent {
  id: string;
  plan_id: string;
  triggered_at: string;
  reason: string | null;
  safety_period_ends: string | null;
  cancelled: boolean;
  cancelled_at: string | null;
  executed: boolean;
  executed_at: string | null;
}
