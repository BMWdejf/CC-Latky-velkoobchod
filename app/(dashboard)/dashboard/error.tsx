"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[dashboard]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <h2 className="text-lg font-semibold">Nastala chyba</h2>
      <p className="text-sm text-muted-foreground">
        {error.message || "Neočekávaná chyba. Zkuste to znovu."}
      </p>
      <Button onClick={reset}>Zkusit znovu</Button>
    </div>
  );
}
