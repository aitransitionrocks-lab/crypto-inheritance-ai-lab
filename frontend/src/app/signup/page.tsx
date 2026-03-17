"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { apiPost } from "@/services/api";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Invalid email address";
    if (!password) errors.password = "Password is required";
    else if (password.length < 8)
      errors.password = "Password must be at least 8 characters";
    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await apiPost("/api/users/register", { email, password });
      router.push("/setup/vault");
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Shield className="w-10 h-10 text-gold" />
            <span className="text-2xl font-bold text-navy">LegacyGuard</span>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">
            Create Your Account
          </h1>
          <p className="text-text-secondary mt-2">
            Start protecting your crypto legacy today
          </p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-error">
                {error}
              </div>
            )}
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
            />
            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={fieldErrors.confirmPassword}
            />
            <Button type="submit" size="lg" loading={loading} className="w-full">
              Create Account
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-text-secondary mt-6">
          Already have an account?{" "}
          <Link href="/signup" className="text-navy font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
