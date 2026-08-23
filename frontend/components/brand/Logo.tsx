import Link from "next/link";
import Image from "next/image";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link href={to} className="flex min-w-0 items-center gap-2.5">
      <Image
        src="/logo.png"
        alt="SaúdeMemora"
        width={36}
        height={36}
        className="shrink-0 rounded-xl"
        priority
      />
      <span className="truncate text-base font-semibold tracking-tight">
        Saúde<span className="text-primary">Memora</span>
      </span>
    </Link>
  );
}
