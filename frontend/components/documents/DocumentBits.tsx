import { FileText, Pill, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocStatus, DocType } from "@/lib/mock-data";
import { statusLabels, typeLabels } from "@/lib/mock-data";

export function DocTypeIcon({ type, className }: { type: DocType; className?: string }) {
  const Icon = type === "receita" ? Pill : type === "laudo" ? Stethoscope : FileText;
  const tone =
    type === "receita"
      ? "bg-success-soft text-success"
      : type === "laudo"
        ? "bg-ai-soft text-ai"
        : "bg-primary-soft text-primary";
  return (
    <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", tone, className)}>
      <Icon className="h-5 w-5" />
    </span>
  );
}

export function StatusBadge({ status }: { status: DocStatus }) {
  const tone =
    status === "processed"
      ? "bg-ai-soft text-ai"
      : status === "review"
        ? "bg-warning-soft text-warning-foreground"
        : "bg-muted text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        tone,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabels[status]}
    </span>
  );
}

export function TypeBadge({ type }: { type: DocType }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
      {typeLabels[type]}
    </span>
  );
}
