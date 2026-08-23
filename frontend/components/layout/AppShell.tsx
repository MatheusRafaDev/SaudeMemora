"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Bell, FileStack, LayoutDashboard, LogOut, Search, UserRound } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { to: "/documents", label: "Documentos", icon: FileStack },
  { to: "/perfil", label: "Perfil médico", icon: UserRound },
] as const;

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-sidebar px-4 py-6 lg:flex">
        <div className="px-2">
          <Logo to="/dashboard" />
        </div>
        <nav className="mt-8 flex flex-col gap-1">
          {nav.map(({ to, label, icon: Icon }) => {
            const isActive = pathname.startsWith(to);
            return (
              <Link
                key={to}
                href={to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl bg-primary-soft p-4">
          <p className="text-sm font-semibold text-accent-foreground">Plano Cuidar+</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Documentos ilimitados e leitura por IA prioritária.
          </p>
          <Button size="sm" className="mt-3 w-full">
            Fazer upgrade
          </Button>
        </div>
        <Link
          href="/"
          className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
        >
          <LogOut className="h-4.5 w-4.5" /> Sair
        </Link>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 glass">
          <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3.5 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="lg:hidden">
                <Logo to="/dashboard" />
              </div>
              <div className="relative hidden min-w-0 flex-1 md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por médico, exame ou medicamento…"
                  className="h-10 rounded-xl pl-9"
                />
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-xl" aria-label="Notificações">
                <Bell className="h-4.5 w-4.5" />
              </Button>
              <Link
                href="/perfil"
                className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
              >
                MR
              </Link>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-border px-4 py-2 lg:hidden">
            {nav.map(({ to, label, icon: Icon }) => {
              const isActive = pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  href={to}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            {subtitle ? <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
