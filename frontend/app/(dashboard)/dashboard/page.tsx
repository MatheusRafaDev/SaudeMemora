import Link from "next/link";
import { ArrowRight, BellRing, CloudUpload, FileStack, Pill, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { DocTypeIcon, StatusBadge } from "@/components/documents/DocumentBits";
import { documents } from "@/lib/mock-data";

const metrics = [
  {
    label: "Documentos totais",
    value: "48",
    delta: "+6 este mês",
    icon: FileStack,
    tone: "bg-primary-soft text-primary",
  },
  {
    label: "Receitas ativas",
    value: "3",
    delta: "1 vence em 12 dias",
    icon: Pill,
    tone: "bg-success-soft text-success",
  },
  {
    label: "Lembretes pendentes",
    value: "2",
    delta: "Retorno cardiológico",
    icon: BellRing,
    tone: "bg-warning-soft text-warning-foreground",
  },
];

export default function Dashboard() {
  return (
    <AppShell
      title="Olá, Matheus 👋"
      subtitle="Aqui está o resumo do seu histórico de saúde hoje."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map(({ label, value, delta, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm text-muted-foreground">{label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
              </div>
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tone}`}>
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{delta}</p>
          </div>
        ))}
      </div>

      <section className="mt-6">
        <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-primary/40 bg-primary-soft/50 bg-aurora p-10 text-center shadow-soft">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lift">
            <CloudUpload className="h-8 w-8" />
          </span>
          <h2 className="mt-5 font-display text-2xl">Enviar novo documento</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Arraste um PDF ou foto do seu exame, receita ou laudo. A IA extrai os dados
            automaticamente em segundos.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" className="rounded-xl">
              Selecionar arquivos
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl">
              Tirar foto
            </Button>
          </div>
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-ai" /> PDF, JPG e PNG até 20 MB
          </p>
        </div>
      </section>

      <section className="mt-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <h2 className="truncate text-lg font-semibold">Documentos recentes</h2>
          <Button asChild variant="ghost" size="sm" className="shrink-0 rounded-lg">
            <Link href="/documents">
              Ver todos <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ul className="mt-4 space-y-3">
          {documents.slice(0, 4).map((doc) => (
            <li key={doc.id}>
              <Link
                href={`/documents/${doc.id}`}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft transition-shadow hover:shadow-lift sm:grid-cols-[auto_minmax(0,1fr)_auto]"
              >
                <DocTypeIcon type={doc.type} />
                <div className="min-w-0">
                  <p className="truncate font-medium">{doc.title}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {doc.doctor} · {doc.date}
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <StatusBadge status={doc.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
