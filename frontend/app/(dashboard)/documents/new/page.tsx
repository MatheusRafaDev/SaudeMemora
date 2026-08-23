"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, File, X, ArrowLeft, Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<string>("receita");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Por favor, selecione um arquivo.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const promise = api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      toast.promise(promise, {
        loading: "Fazendo upload e processando via IA...",
        success: "Documento processado com sucesso!",
        error: "Erro ao enviar o documento. Tente novamente.",
      });

      await promise;
      router.push("/documents");
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AppShell title="Novo Documento" subtitle="Envie exames, receitas ou laudos para análise.">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="rounded-lg">
          <Link href="/documents">
            <ArrowLeft className="mr-1 h-4 w-4" /> Voltar à biblioteca
          </Link>
        </Button>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <Label>Tipo de documento</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Selecione o tipo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exame">Exame</SelectItem>
                <SelectItem value="receita">Receita</SelectItem>
                <SelectItem value="laudo">Laudo Clínico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Arquivo</Label>
            {!file ? (
              <div 
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-2xl bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
                <p className="text-sm font-medium">Clique para escolher ou arraste o arquivo aqui</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, PDF (max. 10MB)</p>
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <File className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => setFile(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <Button type="submit" disabled={!file || isUploading} className="w-full h-12 rounded-xl text-base">
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processando...
              </>
            ) : (
              "Enviar e Analisar com IA"
            )}
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
