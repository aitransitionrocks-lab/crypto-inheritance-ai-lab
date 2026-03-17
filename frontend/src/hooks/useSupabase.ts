'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { InheritancePlan, Vault, Heir, CheckIn } from '@/lib/supabase/types'

export function usePlans() {
  const [plans, setPlans] = useState<InheritancePlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPlans = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setPlans([])
        return
      }
      const { data, error: dbError } = await supabase
        .from('inheritance_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (dbError) throw dbError
      setPlans(data ?? [])
    } catch (err: unknown) {
      const e = err as { message?: string }
      setError(e.message || 'Failed to load plans')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  return { plans, loading, error, refetch: fetchPlans }
}

export function useVaults() {
  const [vaults, setVaults] = useState<Vault[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVaults = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setVaults([])
        return
      }
      const { data, error: dbError } = await supabase
        .from('vaults')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (dbError) throw dbError
      setVaults(data ?? [])
    } catch (err: unknown) {
      const e = err as { message?: string }
      setError(e.message || 'Failed to load vaults')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVaults()
  }, [fetchVaults])

  return { vaults, loading, error, refetch: fetchVaults }
}

export function useHeirs(planId: string | null) {
  const [heirs, setHeirs] = useState<Heir[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHeirs = useCallback(async () => {
    if (!planId) {
      setHeirs([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data, error: dbError } = await supabase
        .from('heirs')
        .select('*')
        .eq('plan_id', planId)
        .order('created_at', { ascending: true })
      if (dbError) throw dbError
      setHeirs(data ?? [])
    } catch (err: unknown) {
      const e = err as { message?: string }
      setError(e.message || 'Failed to load heirs')
    } finally {
      setLoading(false)
    }
  }, [planId])

  useEffect(() => {
    fetchHeirs()
  }, [fetchHeirs])

  return { heirs, loading, error, refetch: fetchHeirs }
}

export function useCheckins(planId?: string | null) {
  const [checkins, setCheckins] = useState<CheckIn[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCheckins = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setCheckins([])
        return
      }
      let query = supabase
        .from('check_ins')
        .select('*')
        .eq('user_id', user.id)
        .order('checked_in_at', { ascending: false })
      if (planId) {
        query = query.eq('plan_id', planId)
      }
      const { data, error: dbError } = await query
      if (dbError) throw dbError
      setCheckins(data ?? [])
    } catch (err: unknown) {
      const e = err as { message?: string }
      setError(e.message || 'Failed to load check-ins')
    } finally {
      setLoading(false)
    }
  }, [planId])

  useEffect(() => {
    fetchCheckins()
  }, [fetchCheckins])

  return { checkins, loading, error, refetch: fetchCheckins }
}
