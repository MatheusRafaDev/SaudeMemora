import {
  AlertTriangle,
  Droplet,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  Pill,
  Pencil,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

const allergies = ["Penicilina", "Dipirona", "Frutos do mar"];
const chronic = ["Hipertensão arterial", "Hipovitaminose D"];
const meds = [
  { name: "Losartana Potássica", dosage: "50 mg", schedule: "1x ao dia — 08:00" },
  { name: "Hidroclorotiazida", dosage: "25 mg", schedule: "1x ao dia — 08:00" },
  { name: "Colecalciferol", dosage: "7.000 UI", schedule: "1x por semana — domingo" },
];

export default function PerfilPage() {
  return (
    <AppShell
      title="Perfil médico"
      subtitle="Informações essenciais para atendimentos de urgência e consultas."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-primary text-xl font-semibold text-primary-foreground">
              MR
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold">Matheus Rafael Oliveira</h2>
              <p className="text-sm text-muted-foreground">38 anos · Masculino</p>
            </div>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            {[
              { icon: Mail, label: "matheus.oliveira@email.com" },
              { icon: Phone, label: "+55 11 98877-6655" },
              { icon: MapPin, label: "São Paulo, SP — Brasil" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex min-w-0 items-center gap-3">
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{label}</span>
              </div>
            ))}
          </dl>

          <Button variant="outline" className="mt-6 w-full rounded-xl">
            <Pencil className="mr-1 h-4 w-4" /> Editar dados pessoais
          </Button>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-destructive-soft p-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive">
                <Droplet className="h-3.5 w-3.5" /> Tipo sanguíneo
              </span>
              <p className="mt-1 text-2xl font-semibold text-destructive">O+</p>
            </div>
            <div className="rounded-2xl bg-success-soft p-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                <HeartPulse className="h-3.5 w-3.5" /> Doador de órgãos
              </span>
              <p className="mt-1 text-2xl font-semibold text-success">Sim</p>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-warning/40 bg-warning-soft p-6 shadow-soft">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-warning text-warning-foreground">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h2 className="font-semibold text-warning-foreground">Alergias conhecidas</h2>
                <p className="text-sm text-warning-foreground/80">
                  Informe sempre a equipe médica antes de qualquer medicação.
                </p>
              </div>
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
              {allergies.map((a) => (
                <li
                  key={a}
                  className="rounded-full bg-card px-3 py-1.5 text-sm font-medium text-warning-foreground shadow-soft"
                >
                  {a}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-semibold">Doenças crônicas pré-existentes</h2>
            <ul className="mt-4 space-y-3">
              {chronic.map((c) => (
                <li
                  key={c}
                  className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3 text-sm"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span className="min-w-0 truncate">{c}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <h2 className="truncate font-semibold">Medicamentos de uso contínuo</h2>
              <Button variant="ghost" size="sm" className="shrink-0 rounded-lg">
                Adicionar
              </Button>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {meds.map((m) => (
                <li
                  key={m.name}
                  className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-success-soft text-success">
                    <Pill className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{m.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{m.schedule}</p>
                  </div>
                  <span className="col-span-2 shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-medium sm:col-span-1">
                    {m.dosage}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
