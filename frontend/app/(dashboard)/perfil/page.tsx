"use client";

import {
  AlertTriangle,
  Droplet,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  Pill,
  Pencil,
  Loader2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

type MedicamentoContinuo = {
  name: string;
  dosage: string;
  schedule: string;
};

type PerfilMedico = {
  id: string;
  nome: string;
  email: string;
  sexo: string;
  idade: number;
  telefone?: string;
  endereco?: string;
  tipoSanguineo?: string;
  doadorOrgaos: boolean;
  alergias: string[];
  doencasCronicas: string[];
  medicamentosContinuos: MedicamentoContinuo[];
};

function getInitials(nome: string) {
  const parts = nome.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
}

export default function PerfilPage() {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState<PerfilMedico | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api
      .get("/pacientes/me")
      .then((res) => setPerfil(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <AppShell title="Perfil médico" subtitle="Carregando seus dados...">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  if (!perfil) {
    return (
      <AppShell title="Perfil médico" subtitle="Não foi possível carregar o perfil.">
        <p className="text-sm text-muted-foreground">Tente recarregar a página.</p>
      </AppShell>
    );
  }

  const sexoLabel =
    perfil.sexo === "masculino"
      ? "Masculino"
      : perfil.sexo === "feminino"
      ? "Feminino"
      : perfil.sexo === "nao-binario"
      ? "Não binário"
      : "Não informado";

  return (
    <AppShell
      title="Perfil médico"
      subtitle="Informações essenciais para atendimentos de urgência e consultas."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        {/* Card de dados pessoais */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-primary text-xl font-semibold text-primary-foreground">
              {getInitials(perfil.nome)}
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold">{perfil.nome}</h2>
              <p className="text-sm text-muted-foreground">
                {perfil.idade} anos · {sexoLabel}
              </p>
            </div>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            {[
              { icon: Mail, label: perfil.email },
              ...(perfil.telefone ? [{ icon: Phone, label: perfil.telefone }] : []),
              ...(perfil.endereco ? [{ icon: MapPin, label: perfil.endereco }] : []),
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
              <p className="mt-1 text-2xl font-semibold text-destructive">
                {perfil.tipoSanguineo || "—"}
              </p>
            </div>
            <div className="rounded-2xl bg-success-soft p-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                <HeartPulse className="h-3.5 w-3.5" /> Doador de órgãos
              </span>
              <p className="mt-1 text-2xl font-semibold text-success">
                {perfil.doadorOrgaos ? "Sim" : "Não"}
              </p>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          {/* Alergias */}
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
            {perfil.alergias.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {perfil.alergias.map((a) => (
                  <li
                    key={a}
                    className="rounded-full bg-card px-3 py-1.5 text-sm font-medium text-warning-foreground shadow-soft"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-warning-foreground/70">Nenhuma alergia cadastrada.</p>
            )}
          </section>

          {/* Doenças crônicas */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-semibold">Doenças crônicas pré-existentes</h2>
            {perfil.doencasCronicas.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {perfil.doencasCronicas.map((c) => (
                  <li
                    key={c}
                    className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3 text-sm"
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span className="min-w-0 truncate">{c}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Nenhuma doença crônica cadastrada.</p>
            )}
          </section>

          {/* Medicamentos contínuos */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <h2 className="truncate font-semibold">Medicamentos de uso contínuo</h2>
              <Button variant="ghost" size="sm" className="shrink-0 rounded-lg">
                Adicionar
              </Button>
            </div>
            {perfil.medicamentosContinuos.length > 0 ? (
              <ul className="mt-4 divide-y divide-border">
                {perfil.medicamentosContinuos.map((m) => (
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
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                Nenhum medicamento contínuo cadastrado.
              </p>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  );
}
