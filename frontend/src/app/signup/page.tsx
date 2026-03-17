"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Key,
  Heart,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { trackEvent } from "@/lib/analytics";

export default function SignupPage() {
  const router = useRouter();
  const { signUp, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSignIn, setIsSignIn] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState("");

  useEffect(() => {
    trackEvent("signup_start");
  }, []);

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Please enter a valid email address";
    if (!password) errors.password = "Password is required";
    else if (!isSignIn && password.length < 8) errors.password = "Password must be at least 8 characters";
    if (!isSignIn && password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setResetError("");
    if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetError("Please enter a valid email address");
      return;
    }
    setResetLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: window.location.origin + "/signup",
      });
      if (error) throw error;
      setResetSuccess(true);
    } catch (err: unknown) {
      const authErr = err as { message?: string };
      setResetError(authErr.message || "Failed to send reset link. Please try again.");
    } finally {
      setResetLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setLoading(true);
    try {
      if (isSignIn) {
        await signIn(email, password);
        router.push("/dashboard");
      } else {
        await signUp(email, password);
        trackEvent("signup_complete");
        router.push("/setup/vault");
      }
    } catch (err: unknown) {
      const authErr = err as { message?: string };
      setError(authErr.message || (isSignIn ? "Sign in failed. Please try again." : "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Left Side - Trust Messaging */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a2332] relative overflow-hidden flex-col justify-center px-16">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-12">
            <Shield className="w-8 h-8 text-[#c9a84c]" />
            <span className="text-2xl font-bold text-white">LegacyGuard</span>
          </Link>

          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            Your Crypto Legacy,<br />
            <span className="text-[#c9a84c]">Protected Forever</span>
          </h2>
          <p className="text-[#94a3b8] text-lg leading-relaxed mb-12 max-w-md">
            Set up your inheritance plan in 5 minutes. Non-custodial, encrypted, and free to start.
          </p>

          {/* Shard Visual */}
          <div className="space-y-4 mb-12">
            {[
              { icon: Key, label: "Shard 1", location: "Your Device", color: "#22c55e" },
              { icon: Heart, label: "Shard 2", location: "Trusted Contact", color: "#3b82f6" },
              { icon: Shield, label: "Shard 3", location: "LegacyGuard Vault", color: "#c9a84c" },
            ].map((shard) => (
              <div key={shard.label} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${shard.color}20` }}
                >
                  <shard.icon className="w-5 h-5" style={{ color: shard.color }} />
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{shard.label}</div>
                  <div className="text-sm" style={{ color: shard.color }}>{shard.location}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20">
            <p className="text-sm text-[#22c55e] flex items-center gap-2">
              <Lock className="w-4 h-4 flex-shrink-0" />
              Your key is generated on your device. We never see it.
            </p>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a84c]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#c9a84c]/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Shield className="w-10 h-10 text-[#c9a84c]" />
              <span className="text-2xl font-bold text-[#1a2332]">LegacyGuard</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1a2332] mb-2">
              {isSignIn ? "Welcome Back" : "Create Your Account"}
            </h1>
            <p className="text-[#64748b]">
              {isSignIn ? "Sign in to manage your crypto legacy" : "Start protecting your crypto legacy today"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && (
                <div className="p-3 bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-xl text-sm text-[#ef4444]">
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1a2332]">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8]" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#e2e8f0] text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-xs text-[#ef4444]">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1a2332]">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 rounded-xl border border-[#e2e8f0] text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-[#ef4444]">{fieldErrors.password}</p>
                )}
              </div>

              {/* Confirm Password - only for sign up */}
              {!isSignIn && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#1a2332]">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8]" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-3 rounded-xl border border-[#e2e8f0] text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b] cursor-pointer"
                    >
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-xs text-[#ef4444]">{fieldErrors.confirmPassword}</p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#1a2332] text-white rounded-xl font-semibold hover:bg-[#2a3a4f] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isSignIn ? "Signing In..." : "Creating Account..."}
                  </>
                ) : (
                  <>
                    {isSignIn ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Forgot Password Link */}
            {isSignIn && !showForgotPassword && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setShowForgotPassword(true);
                    setResetEmail(email);
                    setResetSuccess(false);
                    setResetError("");
                  }}
                  className="text-sm text-[#c9a84c] hover:text-[#b8973f] font-medium hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Forgot Password Form */}
            {showForgotPassword && (
              <div className="mt-6 p-6 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
                {resetSuccess ? (
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#22c55e]/10 mb-3">
                      <Mail className="w-6 h-6 text-[#22c55e]" />
                    </div>
                    <p className="text-sm font-semibold text-[#22c55e] mb-1">Check your email for the reset link.</p>
                    <p className="text-xs text-[#64748b]">We sent a password reset link to {resetEmail}</p>
                    <button
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetSuccess(false);
                      }}
                      className="mt-3 text-sm text-[#1a2332] font-semibold hover:underline cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="flex flex-col gap-3">
                    <p className="text-sm font-semibold text-[#1a2332]">Reset Your Password</p>
                    <p className="text-xs text-[#64748b]">Enter your email and we&apos;ll send you a reset link.</p>
                    {resetError && (
                      <div className="p-2 bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-lg text-xs text-[#ef4444]">
                        {resetError}
                      </div>
                    )}
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8]" />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#e2e8f0] text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={resetLoading}
                        className="flex-1 py-3 bg-[#1a2332] text-white rounded-xl font-semibold hover:bg-[#2a3a4f] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                      >
                        {resetLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Send Reset Link"
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(false)}
                        className="px-4 py-3 border border-[#e2e8f0] rounded-xl text-sm font-medium text-[#64748b] hover:bg-[#f1f5f9] transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-6 text-xs text-[#94a3b8]">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Non-custodial
            </span>
            <span className="text-[#e2e8f0]">|</span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Encrypted
            </span>
            <span className="text-[#e2e8f0]">|</span>
            <span>Free forever</span>
          </div>

          <p className="text-center text-sm text-[#64748b] mt-6">
            {isSignIn ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsSignIn(!isSignIn);
                setError("");
                setFieldErrors({});
              }}
              className="text-[#1a2332] font-semibold hover:underline cursor-pointer"
            >
              {isSignIn ? "Create Account" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
