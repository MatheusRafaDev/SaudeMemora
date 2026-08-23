import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FolderTree,
  Share2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import heroImage from "@/assets/hero-scan.png";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: FolderTree,
    title: "Organização automática",
    text: "Cada documento é classificado por tipo, data, médico e especialidade — sem esforço manual.",
    tone: "bg-primary-soft text-primary",
  },
  {
    icon: BrainCircuit,
    title: "OCR com Inteligência Artificial",
    text: "Extraímos diagnósticos, medicamentos e valores de exame direto do papel digitalizado.",
    tone: "bg-ai-soft text-ai",
  },
  {
    icon: Share2,
    title: "Compartilhamento seguro",
    text: "Gere links temporários e criptografados para o seu médico acessar apenas o necessário.",
    tone: "bg-success-soft text-success",
  },
  {
    icon: Stethoscope,
    title: "Perfil clínico de emergência",
    text: "Tipo sanguíneo, alergias e doenças crônicas prontos para qualquer atendimento.",
    tone: "bg-warning-soft text-warning-foreground",
  },
  {
    icon: ShieldCheck,
    title: "Segurança LGPD",
    text: "Criptografia ponta a ponta e controle total de quem acessa cada documento.",
    tone: "bg-primary-soft text-primary",
  },
  {
    icon: Sparkles,
    title: "Lembretes inteligentes",
    text: "Avisos de retorno médico, renovação de receitas e exames periódicos.",
    tone: "bg-ai-soft text-ai",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 glass">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3.5 sm:px-6">
          <Logo />
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="ghost" className="rounded-xl">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild className="rounded-xl">
              <Link href="/cadastro">Criar conta</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-aurora">
        <div className="absolute inset-0 grid-clinical opacity-30" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium text-accent-foreground shadow-soft">
              <Sparkles className="h-3.5 w-3.5" /> OCR clínico com IA
            </span>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              Seu histórico médico,{" "}
              <span className="text-gradient-brand">sempre à mão.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              A SaúdeMemora digitaliza, organiza e extrai dados estruturados dos seus exames,
              receitas e laudos — tudo em um só lugar, seguro e pronto para qualquer consulta.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-xl">
                <Link href="/cadastro">
                  Começar gratuitamente <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl">
                <Link href="/dashboard">Ver demonstração</Link>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["Grátis para começar", "Conforme a LGPD", "Sem cartão de crédito"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute inset-6 rounded-[40px] bg-primary/10 blur-3xl" />
            <Image
              src={heroImage}
              alt="Documento médico"
              width={1200}
              height={1008}
              className="relative w-full drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl">
            Tudo o que sua saúde precisa lembrar
          </h2>
          <p className="mt-3 text-muted-foreground">
            Do papel amassado na gaveta ao histórico clínico estruturado em segundos.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text, tone }) => (
            <article
              key={title}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-lift"
            >
              <span className={`grid h-11 w-11 place-items-center rounded-xl ${tone}`}>
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center shadow-lift">
          <div className="absolute inset-0 grid-clinical opacity-10" />
          <h2 className="relative font-display text-3xl text-primary-foreground sm:text-4xl">
            Comece a memorizar sua saúde hoje
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-sm text-primary-foreground/80">
            Envie seu primeiro documento e veja a IA organizar seu histórico em menos de um minuto.
          </p>
          <Button asChild size="lg" variant="secondary" className="relative mt-7 rounded-xl">
            <Link href="/cadastro">Criar minha conta</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
          <Logo />
          <p className="text-sm text-muted-foreground">
            © 2026 SaúdeMemora. Dados protegidos conforme a LGPD.
          </p>
        </div>
      </footer>
    </div>
  );
}
