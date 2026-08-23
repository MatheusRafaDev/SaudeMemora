import Link from "next/link";
import { HeartPulse } from "lucide-react";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link href={to} className="flex min-w-0 items-center gap-2.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
        <HeartPulse className="h-5 w-5" />
      </span>
      <span className="truncate text-base font-semibold tracking-tight">
        Saúde<span className="text-primary">Memora</span>
      </span>
    </Link>
  );
}
