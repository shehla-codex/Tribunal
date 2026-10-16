import React from "react";
import AppShell from "@/components/AppShell";
import HeroBanner from "@/components/HeroBanner";
import DemoCaseCards from "@/components/DemoCaseCards";

export default function HomePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <HeroBanner />
        <DemoCaseCards />
      </div>
    </AppShell>
  );
}
