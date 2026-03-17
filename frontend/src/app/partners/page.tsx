import React from "react";
import Link from "next/link";
import { Handshake, ExternalLink } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function PartnersPage() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Partner Integration
        </h1>
        <p className="text-text-secondary mb-8">
          Integrate LegacyGuard into your platform to offer crypto inheritance
          services to your users.
        </p>

        <Card padding="lg" className="mb-8 text-center">
          <Handshake className="w-16 h-16 text-gold mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            Become a Partner
          </h2>
          <p className="text-text-secondary max-w-md mx-auto mb-6">
            Exchanges, wallets, and custodians can integrate our API to provide
            inheritance planning as a built-in feature for their users.
          </p>
          <Button size="lg">Contact Us</Button>
        </Card>

        <Card padding="lg">
          <h3 className="font-semibold text-text-primary mb-4">
            Partner Benefits
          </h3>
          <ul className="flex flex-col gap-3 text-sm text-text-secondary">
            <li>White-label inheritance planning for your platform</li>
            <li>RESTful API with comprehensive documentation</li>
            <li>Revenue sharing model</li>
            <li>Dedicated integration support</li>
          </ul>
          <div className="mt-6">
            <Link
              href="/developers"
              className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:underline"
            >
              View Developer Documentation <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
