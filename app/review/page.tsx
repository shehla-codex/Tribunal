import React, { Suspense } from "react";
import AppShell from "@/components/AppShell";
import CodeReview from "@/components/CodeReview";

export default function ReviewPage() {
  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="p-12 text-center text-charcoal-muted text-sm">
            Loading Court Docket...
          </div>
        }
      >
        <CodeReview />
      </Suspense>
    </AppShell>
  );
}
