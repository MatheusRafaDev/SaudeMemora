import type { ReactNode } from "react";
import { ShieldCheck, Sparkles, Lock } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-5 py-8 sm:px-10">
        <Logo />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="font-display text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-surface bg-aurora lg:block">
        <div className="absolute inset-0 grid-clinical opacity-40" />
        <div className="relative flex h-full flex-col justify-center gap-6 px-14">
          <p className="font-display text-3xl leading-tight">
            Seu histórico médico, <span className="text-gradient-brand">sempre à mão.</span>
          </p>
          <ul className="space-y-4">
            {[
              { icon: Sparkles, title: "OCR com IA", text: "Dados extraídos automaticamente de cada documento." },
              { icon: ShieldCheck, title: "Criptografia ponta a ponta", text: "Seus exames protegidos conforme a LGPD." },
              { icon: Lock, title: "Compartilhamento seguro", text: "Links temporários para o seu médico." },
            ].map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4 rounded-2xl glass p-4 shadow-soft">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
