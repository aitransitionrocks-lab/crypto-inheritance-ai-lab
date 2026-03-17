"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Shield, ArrowLeft, Loader2, Trash2, Plus, Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

interface HeirData { id?: string; name: string; email: string; relationship: string; }

export default function EditPlanPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [planName, setPlanName] = useState("");
  const [triggerDays, setTriggerDays] = useState(90);
  const [checkinMethod, setCheckinMethod] = useState("email");
  const [heirs, setHeirs] = useState<HeirData[]>([]);
  const [newHeir, setNewHeir] = useState<HeirData>({ name: "", email: "", relationship: "spouse" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    loadPlan();
  }, [authLoading, user]);

  async function loadPlan() {
    const supabase = createClient();
    const { data: plan } = await supabase
      .from("inheritance_plans").select("*").eq("id", planId).single();
    if (plan) {
      setPlanName(plan.plan_name);
      setTriggerDays(plan.trigger_interval_days);
      setCheckinMethod(plan.checkin_method);
    }
    const { data: heirData } = await supabase
      .from("heirs").select("*").eq("plan_id", planId);
    if (heirData) setHeirs(heirData.map((h: any) => ({ id: h.id, name: h.name, email: h.email, relationship: h.relationship })));
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true); setError(""); setSuccess(false);
    try {
      const supabase = createClient();
      const { error: planErr } = await supabase.from("inheritance_plans")
        .update({ plan_name: planName, trigger_interval_days: triggerDays, checkin_method: checkinMethod })
        .eq("id", planId);
      if (planErr) throw planErr;
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) { setError(err.message || "Save failed"); }
    finally { setSaving(false); }
  }

  async function addHeir() {
    if (!newHeir.name || !newHeir.email) return;
    const supabase = createClient();
    const { data, error: err } = await supabase.from("heirs")
      .insert({ plan_id: planId, user_id: user!.id, name: newHeir.name, email: newHeir.email, relationship: newHeir.relationship })
      .select().single();
    if (!err && data) {
      setHeirs([...heirs, { id: data.id, name: data.name, email: data.email, relationship: data.relationship }]);
      setNewHeir({ name: "", email: "", relationship: "spouse" });
    }
  }

  async function removeHeir(heirId: string) {
    const supabase = createClient();
    await supabase.from("heirs").delete().eq("id", heirId);
    setHeirs(heirs.filter(h => h.id !== heirId));
  }

  if (authLoading || loading) return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#1a2332]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#e2e8f0]">
        <div className="flex items-center gap-2">
          <Shield className="w-7 h-7 text-[#c9a84c]" />
          <span className="text-xl font-bold text-[#1a2332]">LegacyGuard</span>
        </div>
        <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2 text-[#64748b] hover:text-[#1a2332]">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-[#1a2332] mb-8">Edit Plan</h1>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">{error}</div>}
        {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">Plan updated! Redirecting...</div>}

        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 mb-8">
          <h2 className="text-xl font-bold text-[#1a2332] mb-6">Plan Settings</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#1a2332] mb-2">Plan Name</label>
              <input value={planName} onChange={e => setPlanName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-[#0f172a] focus:ring-2 focus:ring-[#c9a84c] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1a2332] mb-2">
                Inactivity Trigger: {triggerDays} days
              </label>
              <input type="range" min={30} max={365} value={triggerDays} onChange={e => setTriggerDays(Number(e.target.value))}
                className="w-full accent-[#c9a84c]" />
              <div className="flex justify-between text-xs text-[#94a3b8] mt-1"><span>30 days</span><span>365 days</span></div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1a2332] mb-2">Check-in Method</label>
              <div className="flex gap-3">
                {["email", "sms", "app_push"].map(m => (
                  <button key={m} onClick={() => setCheckinMethod(m)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      checkinMethod === m ? "bg-[#1a2332] text-white border-[#1a2332]" : "bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#1a2332]"
                    }`}>{m === "app_push" ? "App Push" : m.toUpperCase()}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 mb-8">
          <h2 className="text-xl font-bold text-[#1a2332] mb-6">Heirs ({heirs.length})</h2>
          {heirs.map(h => (
            <div key={h.id || h.email} className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-xl mb-3">
              <div>
                <p className="font-semibold text-[#1a2332]">{h.name}</p>
                <p className="text-sm text-[#64748b]">{h.email} · {h.relationship}</p>
              </div>
              {h.id && <button onClick={() => removeHeir(h.id!)} className="p-2 text-[#ef4444] hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>}
            </div>
          ))}
          <div className="mt-4 p-4 bg-[#f8fafc] rounded-xl">
            <p className="text-sm font-semibold text-[#1a2332] mb-3">Add Heir</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input placeholder="Name" value={newHeir.name} onChange={e => setNewHeir({...newHeir, name: e.target.value})}
                className="px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm" />
              <input placeholder="Email" value={newHeir.email} onChange={e => setNewHeir({...newHeir, email: e.target.value})}
                className="px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm" />
              <select value={newHeir.relationship} onChange={e => setNewHeir({...newHeir, relationship: e.target.value})}
                className="px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm">
                <option value="spouse">Spouse</option><option value="child">Child</option>
                <option value="sibling">Sibling</option><option value="parent">Parent</option>
                <option value="friend">Friend</option><option value="other">Other</option>
              </select>
            </div>
            <button onClick={addHeir} className="mt-3 flex items-center gap-2 px-4 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm font-medium text-[#1a2332] hover:bg-[#e2e8f0]">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full py-4 bg-[#1a2332] text-white rounded-xl font-semibold text-lg hover:bg-[#2a3a4f] disabled:opacity-50 flex items-center justify-center gap-2">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
