"use client";

import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/client";
import { USER_ROLES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";

interface ProductCTAProps {
  productName: string;
}

export function ProductCTA({ productName }: ProductCTAProps) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="h-10 w-full animate-pulse rounded-md bg-muted" />;
  }

  if (!session) {
    return (
      <Link href="/auth/register" className={buttonVariants({ size: "lg", className: "w-full" })}>
        Registrovat se
      </Link>
    );
  }

  if (session.user.role === USER_ROLES.USER) {
    return (
      <p className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
        Váš účet čeká na schválení administrátorem.
      </p>
    );
  }

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={() => toast.success(`„${productName}" přidán do košíku`)}
    >
      Přidat do košíku
    </Button>
  );
}
