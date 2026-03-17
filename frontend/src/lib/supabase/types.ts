export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Vault {
  id: string;
  user_id: string;
  name: string;
  wallet_addresses: string[];
  created_at: string;
  updated_at: string;
}

export interface InheritancePlan {
  id: string;
  user_id: string;
  vault_id: string | null;
  name: string;
  status: 'active' | 'warning' | 'triggered' | 'inactive';
  trigger_days: number;
  check_in_method: string;
  created_at: string;
  updated_at: string;
}

export interface Heir {
  id: string;
  plan_id: string;
  name: string;
  email: string;
  relationship: string;
  created_at: string;
}

export interface CheckIn {
  id: string;
  user_id: string;
  plan_id: string | null;
  checked_in_at: string;
  created_at: string;
}

export interface TriggerEvent {
  id: string;
  plan_id: string;
  triggered_at: string;
  resolved_at: string | null;
  status: 'pending' | 'resolved' | 'executed';
  created_at: string;
}
