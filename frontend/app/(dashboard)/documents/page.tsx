"use client";

import { useState, useMemo, useEffect } from "react";
import { CalendarDays, Search, SlidersHorizontal, Upload, UserRound, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocTypeIcon, StatusBadge, TypeBadge } from "@/components/documents/DocumentBits";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { DocumentViewer } from "@/components/documents/DocumentViewer";
import { useRouter } from "next/navigation";

const tabs = [
  { value: "todos", label: "Todos" },
  { value: "exame", label: "Exames" },
  { value: "receita", label: "Receitas" },
  { value: "laudo", label: "Laudos clínicos" },
];

export default function DocumentsPage() {
  const [tab, setTab] = useState("todos");
  const [query, setQuery] = useState("");
  const { user } = useAuth();
  const [docs, setDocs] = useState<any[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      api.get("/documents").then(res => setDocs(res.data)).catch(console.error);
    }
  }, [user]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return docs.filter((doc) => {
      const matchesTab = tab === "todos" || doc.type === tab;
      const matchesQuery =
        !q ||
        [doc.title, doc.doctor, doc.clinic, doc.diagnosis, ...(doc.medicines ?? []).map((m: any) => m.name)]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return matchesTab && matchesQuery;
    });
  }, [tab, query, docs]);

  if (selectedDocId) {
    return <DocumentViewer id={selectedDocId} onClose={() => setSelectedDocId(null)} />;
  }

  return (
    <AppShell
      title="Biblioteca médica"
      subtitle="Todo o seu histórico clínico organizado e pesquisável."
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="relative min-w-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por médico, medicamento ou tipo de exame…"
            className="h-12 rounded-2xl pl-9"
          />
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl" aria-label="Filtros">
            <SlidersHorizontal className="h-4.5 w-4.5" />
          </Button>
          <Button onClick={() => router.push("/documents/new")} className="hidden h-12 rounded-2xl sm:inline-flex">
            <Upload className="mr-1 h-4 w-4" /> Enviar
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-6">
        <TabsList className="h-11 w-full justify-start overflow-x-auto rounded-2xl bg-secondary p-1 sm:w-auto">
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="rounded-xl px-4">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <p className="mt-5 text-sm text-muted-foreground">
        {filtered.length} documento{filtered.length === 1 ? "" : "s"} encontrado
        {filtered.length === 1 ? "" : "s"}
      </p>

      <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedDocId(doc.id)}
            onKeyDown={(e) => e.key === "Enter" && setSelectedDocId(doc.id)}
            className="flex flex-col text-left rounded-2xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-lift w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring relative group"
          >
            <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => { /* Edit logic */ }}>
                    <Pencil className="mr-2 h-4 w-4" /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (confirm("Tem certeza que deseja excluir este documento?")) {
                        try {
                          await api.delete(`/documents/${doc.id}`);
                          setDocs((prev) => prev.filter((d) => d.id !== doc.id));
                        } catch (err) {
                          console.error(err);
                          alert("Erro ao excluir o documento.");
                        }
                      }
                    }} 
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 w-full pr-8">
              <DocTypeIcon type={doc.type} />
              <div className="min-w-0 w-full">
                <h2 className="truncate font-semibold">{doc.title}</h2>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <UserRound className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{doc.doctor}</span>
                </div>
              </div>
            </div>
            <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">{doc.summary}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4 w-full">
              <TypeBadge type={doc.type} />
              <StatusBadge status={doc.status} />
              <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" /> {doc.date}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="font-medium">Nenhum documento encontrado</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tente outro termo de busca ou envie um novo documento.
          </p>
        </div>
      ) : null}
    </AppShell>
  );
}
